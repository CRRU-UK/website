terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.46"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.52"
    }
  }
}
