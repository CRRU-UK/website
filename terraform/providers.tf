terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.46"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.48"
    }
  }
}

provider "digitalocean" {
  token = var.digitalocean_api_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
