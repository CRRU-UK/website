terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.46"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }

    logtail = {
      source  = "BetterStackHQ/logtail"
      version = "~> 0.2.0"
    }
  }
}
