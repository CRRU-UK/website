variable "digitalocean_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_account_id" {
  type      = string
  sensitive = true
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_zone_id" {
  type      = string
  sensitive = true
}

variable "google_analytics_id" {
  type = string
}

variable "website_domain" {
  type = string
}

variable "contentful_space_id" {
  type = string
}

variable "contentful_environment" {
  type = string
}

variable "contentful_delivery_api_token" {
  type      = string
  sensitive = true
}

variable "contentful_preview_api_token" {
  type      = string
  sensitive = true
}

variable "smtp_host" {
  type      = string
  sensitive = true
}

variable "smtp_port" {
  type      = string
  sensitive = true
}

variable "smtp_username" {
  type      = string
  sensitive = true
}

variable "smtp_password" {
  type      = string
  sensitive = true
}

variable "sighting_email" {
  type      = string
  sensitive = true
}
