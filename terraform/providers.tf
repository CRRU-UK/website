terraform {
  required_version = "~> 1.14.5"

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

  cloud {
    organization = "CRRU"

    workspaces {
      name = "website"
    }
  }
}
