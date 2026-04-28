#!/usr/bin/env bash
# Run this once to install Ansible on vm-ops via az vm run-command.
# Usage: bash bootstrap_ops.sh
set -e

RG="rg-proj2-dev-group-3"
VM="vm-ops-proj2-dev-group-3"

echo "==> Installing Ansible + sshpass on vm-ops..."
az vm run-command invoke \
  --resource-group "$RG" \
  --name "$VM" \
  --command-id RunShellScript \
  --scripts "
    set -e
    apt-get update -qq
    apt-get install -y software-properties-common sshpass
    add-apt-repository --yes --update ppa:ansible/ansible
    apt-get install -y ansible
    pip3 install ansible-core
    ansible-galaxy collection install community.docker
    ansible --version
    echo 'Ansible ready.'
  "

echo "==> Copying Ansible config to vm-ops..."
# Tar the ansible directory and push it via run-command
ANSIBLE_DIR="$(cd "$(dirname "$0")" && pwd)"
TAR_B64=$(tar -cz -C "$ANSIBLE_DIR/.." ansible | base64 -w 0)

az vm run-command invoke \
  --resource-group "$RG" \
  --name "$VM" \
  --command-id RunShellScript \
  --scripts "
    mkdir -p /home/azureuser/ansible
    echo '$TAR_B64' | base64 -d | tar -xz -C /home/azureuser/
    chown -R azureuser:azureuser /home/azureuser/ansible
    echo 'Files copied.'
  "

echo ""
echo "Done. SSH into vm-ops then run:"
echo "  cd /home/azureuser/ansible"
echo "  ansible-playbook playbooks/ping.yml"
echo ""
echo "To get ops public IP after terraform apply:"
echo "  cd infra/terraform && terraform output vm_ops_public_ip"
