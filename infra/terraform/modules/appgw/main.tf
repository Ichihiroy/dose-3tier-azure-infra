locals {
  feip_name            = "feip-${var.prefix}"
  feport_http          = "feport-http"
  feport_https         = "feport-https"
  listener_http        = "listener-http"
  listener_https       = "listener-https"
  pool_frontend        = "pool-frontend"
  pool_backend         = "pool-backend"
  httpsetting_frontend = "httpsetting-frontend"
  httpsetting_backend  = "httpsetting-backend"
  probe_frontend       = "probe-frontend"
  probe_backend        = "probe-backend"
  urlmap               = "urlmap-${var.prefix}"
  urlmap_https         = "urlmap-https-${var.prefix}"
  routing_rule         = "rule-${var.prefix}"
  routing_rule_https   = "rule-https-${var.prefix}"
  redirect_http        = "redirect-http-to-https"
  ssl_cert_name        = "dose-ssl"
}

resource "azurerm_public_ip" "appgw" {
  name                = "pip-appgw-${var.prefix}"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"
  domain_name_label   = "burger-${var.prefix}"
  tags                = var.tags
}

resource "azurerm_web_application_firewall_policy" "main" {
  name                = "wafpol-${var.prefix}"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags

  policy_settings {
    enabled                     = true
    mode                        = "Prevention"
    request_body_check          = true
    max_request_body_size_in_kb = 128
    file_upload_limit_in_mb     = 100
  }

  managed_rules {
    managed_rule_set {
      type    = "OWASP"
      version = "3.2"
    }
  }
}

resource "azurerm_application_gateway" "main" {
  name                = "appgw-${var.prefix}"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags

  firewall_policy_id = azurerm_web_application_firewall_policy.main.id

  identity {
    type         = "UserAssigned"
    identity_ids = [var.identity_id]
  }

  ssl_certificate {
    name                = local.ssl_cert_name
    key_vault_secret_id = var.ssl_cert_secret_id
  }

  sku {
    name = "WAF_v2"
    tier = "WAF_v2"
    # capacity omitted — controlled by autoscale_configuration below
  }

  autoscale_configuration {
    min_capacity = 1
    max_capacity = 3
  }

  gateway_ip_configuration {
    name      = "gwipconf"
    subnet_id = var.subnet_id
  }

  frontend_ip_configuration {
    name                 = local.feip_name
    public_ip_address_id = azurerm_public_ip.appgw.id
  }

  frontend_port {
    name = local.feport_http
    port = 80
  }

  frontend_port {
    name = local.feport_https
    port = 443
  }

  backend_address_pool {
    name         = local.pool_frontend
    ip_addresses = [var.frontend_private_ip]
  }

  backend_address_pool {
    name         = local.pool_backend
    ip_addresses = [var.backend_private_ip]
  }

  probe {
    name                                      = local.probe_frontend
    protocol                                  = "Http"
    path                                      = "/"
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    pick_host_name_from_backend_http_settings = true
  }

  probe {
    name                                      = local.probe_backend
    protocol                                  = "Http"
    path                                      = "/api/health"
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    pick_host_name_from_backend_http_settings = true
  }

  backend_http_settings {
    name                                = local.httpsetting_frontend
    cookie_based_affinity               = "Disabled"
    port                                = 80
    protocol                            = "Http"
    request_timeout                     = 30
    probe_name                          = local.probe_frontend
    pick_host_name_from_backend_address = true
  }

  backend_http_settings {
    name                                = local.httpsetting_backend
    cookie_based_affinity               = "Disabled"
    port                                = 8080
    protocol                            = "Http"
    request_timeout                     = 30
    probe_name                          = local.probe_backend
    pick_host_name_from_backend_address = true
  }

  http_listener {
    name                           = local.listener_http
    frontend_ip_configuration_name = local.feip_name
    frontend_port_name             = local.feport_http
    protocol                       = "Http"
  }

  http_listener {
    name                           = local.listener_https
    frontend_ip_configuration_name = local.feip_name
    frontend_port_name             = local.feport_https
    protocol                       = "Https"
    ssl_certificate_name           = local.ssl_cert_name
  }

  redirect_configuration {
    name                 = local.redirect_http
    redirect_type        = "Permanent"
    target_listener_name = local.listener_https
    include_path         = true
    include_query_string = true
  }

  url_path_map {
    name                               = local.urlmap_https
    default_backend_address_pool_name  = local.pool_frontend
    default_backend_http_settings_name = local.httpsetting_frontend

    path_rule {
      name                       = "api-rule"
      paths                      = ["/api/*"]
      backend_address_pool_name  = local.pool_backend
      backend_http_settings_name = local.httpsetting_backend
    }
  }

  request_routing_rule {
    name                        = local.routing_rule
    rule_type                   = "Basic"
    http_listener_name          = local.listener_http
    redirect_configuration_name = local.redirect_http
    priority                    = 90
  }

  request_routing_rule {
    name               = local.routing_rule_https
    rule_type          = "PathBasedRouting"
    http_listener_name = local.listener_https
    url_path_map_name  = local.urlmap_https
    priority           = 100
  }
}

resource "azurerm_monitor_diagnostic_setting" "appgw" {
  name                       = "diag-appgw-${var.prefix}"
  target_resource_id         = azurerm_application_gateway.main.id
  log_analytics_workspace_id = var.log_analytics_workspace_id

  enabled_log {
    category = "ApplicationGatewayAccessLog"
  }

  enabled_log {
    category = "ApplicationGatewayPerformanceLog"
  }

  enabled_log {
    category = "ApplicationGatewayFirewallLog"
  }

  enabled_metric {
    category = "AllMetrics"
  }
}
