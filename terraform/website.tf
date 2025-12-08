locals {
  app_name = "app"

  egress_ips = toset([for ip in data.digitalocean_app.website_app_data.dedicated_ips : ip.ip_address])

  image_cache_directives = join(", ", [
    "public",
    "max-age=18000",                  # 5 minutes
    "s-maxage=31536000",              # 1 year
    "stale-while-revalidate=1209600", # 2 weeks
    "stale-if-error=604800",          # 1 week
  ])
}

output "egress_ips" {
  value = digitalocean_app.website_app.dedicated_ips
}

resource "digitalocean_app" "website_app" {
  spec {
    name   = "website"
    region = "lon"

    disable_edge_cache              = true
    disable_email_obfuscation       = true
    enhanced_threat_control_enabled = false

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
        http_path             = "/api/health"
        initial_delay_seconds = 2
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

      env {
        key   = "SENTRY_DSN"
        value = var.sentry_dsn
        scope = "RUN_AND_BUILD_TIME"
        type  = "SECRET"
      }

      env {
        key   = "SENTRY_ORG"
        value = var.sentry_org
        scope = "RUN_AND_BUILD_TIME"
        type  = "GENERAL"
      }

      env {
        key   = "SENTRY_PROJECT"
        value = var.sentry_project
        scope = "RUN_AND_BUILD_TIME"
        type  = "GENERAL"
      }

      env {
        key   = "SENTRY_AUTH_TOKEN"
        value = var.sentry_auth_token
        scope = "RUN_AND_BUILD_TIME"
        type  = "SECRET"
      }
    }
  }
}

data "digitalocean_app" "website_app_data" {
  app_id = digitalocean_app.website_app.id
}

resource "cloudflare_turnstile_widget" "website_challenge" {
  account_id = var.cloudflare_account_id

  domains        = [var.website_domain]
  name           = "CRRU Website"
  mode           = "managed"
  region         = "world"
  bot_fight_mode = false
}

resource "cloudflare_dns_record" "website_dns_apex" {
  zone_id = var.cloudflare_zone_id

  for_each = local.egress_ips

  name    = "@"
  type    = "A"
  content = each.key
  ttl     = 1
  proxied = true
  comment = "Website (apex)"
}

resource "cloudflare_dns_record" "website_dns_www" {
  zone_id = var.cloudflare_zone_id

  for_each = local.egress_ips

  name    = "www"
  type    = "A"
  content = each.key
  ttl     = 1
  proxied = true
  comment = "Website (www)"
}

resource "cloudflare_ruleset" "website_cache_enable" {
  zone_id = var.cloudflare_zone_id

  name  = "Enable caching"
  phase = "http_request_cache_settings"
  kind  = "zone"

  rules = [{
    enabled     = true
    action      = "set_cache_settings"
    description = "Enable cache for all requests"

    expression = true

    action_parameters = {
      cache = true
    }
  }]
}

resource "cloudflare_ruleset" "website_image_cache" {
  zone_id = var.cloudflare_zone_id

  name  = "Custom caching for NextJS images"
  phase = "http_response_headers_transform"
  kind  = "zone"

  rules = [{
    enabled     = true
    action      = "rewrite"
    description = "Overwrite Cache-Control header"

    expression = "(http.request.uri.path eq \"/_next/image\")"

    action_parameters = {
      headers = {
        "Cache-Control" = {
          operation = "set"
          value     = local.image_cache_directives
        }
      }
    }
  }]
}
