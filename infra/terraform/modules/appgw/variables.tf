variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "tags" {
  type = map(string)
}

variable "prefix" {
  type = string
}

variable "subnet_id" {
  description = "ID of snet-appgw (dedicated App Gateway subnet)."
  type        = string
}

variable "frontend_private_ip" {
  description = "Private IP of the frontend (web) VM."
  type        = string
}

variable "backend_private_ip" {
  description = "Private IP of the backend (api) VM."
  type        = string
}

variable "log_analytics_workspace_id" {
  description = "Log Analytics workspace resource ID for diagnostic settings."
  type        = string
}

variable "ssl_cert_secret_id" {
  description = "Key Vault secret ID for the SSL certificate (versioned sid)."
  type        = string
}

variable "identity_id" {
  description = "Resource ID of the user-assigned managed identity for App Gateway KV access."
  type        = string
}
