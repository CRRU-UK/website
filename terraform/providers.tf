terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.57"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.6"
    }
  }
}
