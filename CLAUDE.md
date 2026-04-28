# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Burger Builder — full-stack app: React/TypeScript frontend + Spring Boot (Java 21) backend + Azure 3-tier IaC (Terraform).

## Commands

### Frontend (`cd frontend`)
```bash
npm run dev           # dev server on :5173
npm run build         # tsc -b && vite build → dist/
npm run lint          # eslint
npm test              # vitest (watch)
npm run test:coverage # coverage report
```
Run a single test file: `npx vitest run src/components/Ingredients/IngredientCard.test.tsx`

### Backend (`cd backend`)
```bash
mvn spring-boot:run              # dev server on :8080 (H2 in-memory)
mvn test                         # all tests
mvn test -Dtest=CartServiceTest  # single test class
mvn clean package                # build JAR → target/
```

### Terraform (`cd infra/terraform`)
```bash
# Init (backend already bootstrapped)
terraform init -backend-config=backend.hcl

# Apply dev
export TF_VAR_vm_admin_password="..."
terraform plan  -var-file=envs/dev.tfvars -out=plan.out
terraform apply plan.out

# Format / validate (required before PR)
terraform fmt -recursive
terraform validate
```
State is stored in Azure Blob Storage (`sttfstateproj2ce77940d` / `tfstate` container / `proj2-dev.tfstate`).  
If the state lock is stuck: add `-lock=false` to plan/apply — do NOT delete the blob.

## Architecture

### Network layout (northeurope)
```
Internet → AppGW WAF v2 (snet-appgw 10.20.1.0/26)
  /        → vm-web (snet-web 10.20.2.0/24)
  /api/*   → vm-api (snet-api 10.20.3.0/24)
               └─ SQL Private Endpoint (snet-data 10.20.4.0/27)
               └─ KV  Private Endpoint (snet-kv   10.20.4.32/27)
snet-ops (10.20.5.0/27) — SonarQube + GitHub Actions self-hosted runner
```
- AppGW subnet has **no NSG attached** (WAF v2 requires ports 65200-65535 from GatewayManager; attaching an NSG to that subnet caused provisioning failures — it was intentionally removed).
- All VMs have no public IPs. SSH reaches vm-web/vm-api only from vm-ops (10.20.5.0/27).
- Key Vault has `public_network_access_enabled = true` with `ip_rules = [var.runner_ip]` so Terraform can write secrets from the admin IP; everything else is private endpoint only.

### Terraform modules
| Module | Purpose |
|--------|---------|
| `network` | VNet, subnets, NSGs, Private DNS zones + VNet links |
| `observability` | Log Analytics workspace + App Insights |
| `keyvault` | Key Vault (RBAC, private endpoint, IP allowlist for runner) |
| `data` | Azure SQL Server + database + private endpoint; password written to KV |
| `compute` | vm-web + vm-api (Ubuntu, password auth, no public IP) |
| `ops` | vm-ops (SonarQube + GH runner VM, public IP via ops NSG) |
| `appgw` | Application Gateway WAF v2, URL path map, diagnostic settings |

`random_string.suffix` is created once and stored in state — never changes on re-apply. Used for globally unique KV and SQL names.

### Backend profiles
| Profile | DB | Activated by |
|---------|----|-------------|
| default | H2 in-memory | `mvn spring-boot:run` (no profile) |
| `docker` | PostgreSQL | `SPRING_PROFILES_ACTIVE=docker` |
| `azure` | Azure SQL (mssql) | `SPRING_PROFILES_ACTIVE=azure` |

Backend env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER`, `CORS_ALLOWED_ORIGINS`. Copy from `environment.env.example`.

### Frontend API config
`VITE_API_BASE_URL` env var (defaults to `http://localhost:8080`). Set in `.env` file or as a Docker build-arg.

### CI/CD pipelines (`.github/workflows/`)
Both pipelines run on `self-hosted` runner (vm-ops) for SonarQube and Docker build stages. Stages: lint/typecheck → SonarQube scan → Quality Gate → Docker build+push (DockerHub) → Azure deploy.  
Required secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `SONAR_TOKEN`, `SONAR_HOST_URL`, `AZURE_CREDENTIALS`, `VITE_API_BASE_URL`.

## Key Known Issues / Decisions

- **AppGW NSG**: `azurerm_subnet_network_security_group_association.appgw` was removed from the network module. Do not re-add it — Azure AppGW WAF v2 needs unfiltered control-plane access on ports 65200-65535.
- **VM quota**: All VMs use `Standard_D2s_v3` in `northeurope`. Changing region or size may hit shared subscription quota limits.
- **KV soft-delete**: Key Vault names are globally unique and soft-deleted vaults block re-use for 90 days. If `terraform destroy` is needed, purge the KV manually or the next apply will fail with `VaultAlreadyExists`.
- **State bootstrap**: Run `infra/terraform/bootstrap/bootstrap.sh northeurope` only once before the first `terraform init`. The storage account (`rg-tfstate` RG) must not be destroyed.
- **`admin_source_cidr`**: Update `envs/dev.tfvars` with your current public IP (`curl -s ifconfig.me`) before each apply — it controls KV firewall and ops NSG SSH access.
