# Demo Script — Burger Builder

## 1. Show the Live App (2 min)

Open browser → `http://burger-proj2-dev-group-3.northeurope.cloudapp.azure.com`

- Browse ingredients
- Build a burger — add patty, cheese, toppings
- Add to cart
- Place order
- Check order history

**Talking point:** "Frontend on vm-web, API on vm-api, data persisted in Azure SQL — all behind App Gateway WAF v2."

---

## 2. Show the Infrastructure (2 min)

**Azure Portal → Resource Group `rg-proj2-dev-group-3`**

Point out:
- App Gateway → Backend health (both Healthy)
- SQL Server → Networking → public access Disabled, private endpoint shown
- Key Vault → Networking → private endpoint, IP allowlist for runner
- 3 VMs — no public IPs, all access via Azure Bastion

**Talking point:** "Zero trust network — SQL and KV only reachable inside VNet via private endpoints. No VM has a public IP — all admin access goes through Azure Bastion."

---

## 3. Show CI/CD Pipeline (2 min)

**GitHub → Actions tab**

Trigger a dummy push or show last successful run:
- Backend pipeline: SonarQube scan → Quality Gate → Docker build+push → Ansible deploy
- Frontend pipeline: Tests+coverage → SonarQube scan → Docker build+push → Ansible deploy

**Talking point:** "Code goes through quality gate before it can deploy. If SonarQube fails, pipeline stops — no bad code reaches production."

---

## 4. Show SonarQube (1 min)

Access via Azure Bastion → vm-ops → `http://localhost:9000`

Show:
- `gp3-project2` (backend) — test coverage, code smells, security issues
- `gp3-project2-web` (frontend) — same

**Talking point:** "Self-hosted SonarQube on the ops VM inside the VNet — no public exposure, accessible only from within the VNet via Bastion."

---

## 5. Show IaC — Terraform (1 min)

```bash
cd infra/terraform
terraform show | head -50
```

Or show the module structure in the repo.

**Talking point:** "Entire infrastructure is code — VNet, subnets, NSGs, App Gateway, SQL, Key Vault, VMs. Reproducible in any region with one command."

---

## 6. Show Configuration Management — Ansible (1 min)

```bash
# Connect via Azure Bastion → vm-ops
# Azure Portal → Virtual Machines → vm-ops-proj2-dev-group-3 → Connect → Bastion
cd ~/GP3-PROJECT2/config/ansible
cat inventories/dev/hosts.ini
cat playbooks/site.yml
```

**Talking point:** "Ansible handles all VM configuration and Docker deployments. Secrets managed via ansible-vault — never stored in plaintext."

---

## Sample curl Commands

```bash
# Health check
curl http://burger-proj2-dev-group-3.northeurope.cloudapp.azure.com/api/health

# Get all ingredients
curl http://burger-proj2-dev-group-3.northeurope.cloudapp.azure.com/api/ingredients

# Get ingredients by category
curl http://burger-proj2-dev-group-3.northeurope.cloudapp.azure.com/api/ingredients/patty

# Create order
curl -X POST http://burger-proj2-dev-group-3.northeurope.cloudapp.azure.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"demo-session","email":"demo@test.com"}'

# Get order history
curl http://burger-proj2-dev-group-3.northeurope.cloudapp.azure.com/api/orders/history
```
