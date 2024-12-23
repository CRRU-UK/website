locals {
  app_name          = "app"
  digitalocean_host = replace(digitalocean_app.website_app.default_ingress, "/(http(s)?://)/", "")
}

resource "digitalocean_app" "website_app" {
  spec {
    name   = "website"
    region = "lon"

    alert {
      rule     = "DEPLOYMENT_FAILED"
      disabled = false
    }

    alert {
      rule     = "DEPLOYMENT_LIVE"
      disabled = false
    }

    domain {
      name = var.website_domain
    }

    domain {
      name = "www.${var.website_domain}"
    }

    ingress {
      rule {
        component {
          name                 = local.app_name
          preserve_path_prefix = false
        }

        match {
          path {
            prefix = "/"
          }
        }
      }
    }

    service {
      name = local.app_name

      dockerfile_path = "Dockerfile"

      instance_size_slug = "apps-s-1vcpu-0.5gb"
      instance_count     = 1

      http_port      = 3000
      internal_ports = []

      github {
        repo           = "CRRU-UK/website"
        branch         = "main"
        deploy_on_push = true
      }

      health_check {
        http_path             = "/api/status"
        initial_delay_seconds = 0
        period_seconds        = 10
        timeout_seconds       = 1
        success_threshold     = 1
        failure_threshold     = 9
      }

      alert {
        rule     = "RESTART_COUNT"
        value    = "2"
        operator = "GREATER_THAN"
        window   = "FIVE_MINUTES"
      }

      env {
        key   = "NODE_ENV"
        value = "production"
        scope = "RUN_AND_BUILD_TIME"
        type  = "GENERAL"
      }

      env {
        key   = "NODE_CONTENTFUL_SPACE_ID"
        value = var.contentful_space_id
        scope = "RUN_TIME"
        type  = "GENERAL"
      }

      env {
        key   = "NODE_CONTENTFUL_ENVIRONMENT"
        value = var.contentful_environment
        scope = "RUN_TIME"
        type  = "GENERAL"
      }

      env {
        key   = "NODE_CONTENTFUL_DELIVERY_API_TOKEN"
        value = var.contentful_delivery_api_token
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "NODE_CONTENTFUL_PREVIEW_API_TOKEN"
        value = var.contentful_preview_api_token
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "NEXT_PUBLIC_CLOUDFLARE_CHALLENGE_SITE_KEY"
        value = cloudflare_turnstile_widget.website_challenge.id
        scope = "BUILD_TIME"
        type  = "GENERAL"
      }

      env {
        key   = "NODE_CLOUDFLARE_CHALLENGE_SECRET_KEY"
        value = cloudflare_turnstile_widget.website_challenge.secret
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "NEXT_PUBLIC_GOOGLE_ANALYTICS_ID"
        value = var.google_analytics_id
        scope = "BUILD_TIME"
        type  = "GENERAL"
      }

      env {
        key   = "NODE_SMTP_HOST"
        value = var.smtp_host
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "NODE_SMTP_PORT"
        value = var.smtp_port
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "NODE_SMTP_USERNAME"
        value = var.smtp_username
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "NODE_SMTP_PASSWORD"
        value = var.smtp_password
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "NODE_SIGHTING_EMAIL"
        value = var.sighting_email
        scope = "RUN_TIME"
        type  = "GENERAL"
      }
    }
  }
}

resource "cloudflare_turnstile_widget" "website_challenge" {
  account_id = var.cloudflare_account_id

  domains        = [var.website_domain]
  name           = "CRRU Website"
  mode           = "managed"
  region         = "world"
  bot_fight_mode = false
}

resource "cloudflare_record" "website_dns_apex" {
  zone_id = var.cloudflare_zone_id

  name    = "@"
  type    = "CNAME"
  content = local.digitalocean_host
  ttl     = 1
  proxied = true
  comment = "Website (apex)"
}

resource "cloudflare_record" "website_dns_www" {
  zone_id = var.cloudflare_zone_id

  name    = "www"
  type    = "CNAME"
  content = local.digitalocean_host
  ttl     = 1
  proxied = true
  comment = "Website (www)"
}
