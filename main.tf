variable "suffix" {
  type    = string
  default = "main"
}

variable "domain" {
  type    = string
  default = "calmmystreet.com"
}

variable "dnszone" {
  type    = string
  default = "calmmystreet-com"
}

provider "google" {
  project = "calmmystreet"
  region  = "us-west1"
}

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.14.0"
    }
  }
  backend "gcs" {
    bucket = "calmmystreet-terraform"
    prefix = "terraform/state"
  }
}

provider "cloudflare" {
  api_token = var.CLOUDFLARE_API_TOKEN
  email = var.CLOUDFLARE_EMAIL
}

### BUCKET ###
resource "google_storage_bucket" "bucket" {
  name          = "calmmystreet-${var.suffix}"
  location      = "us-west1"
  storage_class = "REGIONAL"
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_iam_member" "bucket_member" {
  bucket = google_storage_bucket.bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_compute_backend_bucket" "bucket_backend" {
  name        = "calmmystreet-${var.suffix}-bucket-backend"
  bucket_name = google_storage_bucket.bucket.name
}

### TRAFFIC ROUTING ###
resource "google_compute_url_map" "lb_redirect" {
  default_url_redirect {
    https_redirect         = true
    strip_query            = false
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
  }
  name = "calmmystreet-${var.suffix}-lb-redirect"
}

resource "google_compute_url_map" "lb" {
  default_service = google_compute_backend_bucket.bucket_backend.id
  name            = "calmmystreet-${var.suffix}-lb"
}

resource "google_compute_target_http_proxy" "target_http_proxy" {
  name    = "calmmystreet-${var.suffix}-target-proxy"
  url_map = google_compute_url_map.lb_redirect.id
}

resource "google_compute_target_https_proxy" "target_https_proxy" {
  name    = "calmmystreet-${var.suffix}-target-proxy"
  url_map = google_compute_url_map.lb.id
  ssl_certificates = [
    google_compute_managed_ssl_certificate.cert.id
  ]
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "calmmystreet-${var.suffix}-forwarding-rule"
  target                = google_compute_target_http_proxy.target_http_proxy.self_link
  ip_address            = google_compute_global_address.ip.id
  port_range            = 80
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_compute_global_forwarding_rule" "https" {
  name                  = "calmmystreet-${var.suffix}"
  target                = google_compute_target_https_proxy.target_https_proxy.self_link
  ip_address            = google_compute_global_address.ip.id
  port_range            = 443
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

### NETWORKING ###
resource "google_compute_global_address" "ip" {
  name       = "calmmystreet-${var.suffix}-ip"
  ip_version = "IPV4"
}

resource "google_compute_managed_ssl_certificate" "cert" {
  name = "calmmystreet-${var.suffix}-cert"
  managed {
    domains = [var.domain]
  }
}

resource "google_dns_record_set" "dns" {
  managed_zone = var.dnszone
  name         = "${var.domain}."
  type         = "A"
  ttl          = 21600
  routing_policy {
    wrr {
      weight  = 1
      rrdatas = [google_compute_global_address.ip.address]
    }
  }
}

### BUCKET CONTENT ###
## TODO: Swap content_type for a map or something
resource "google_storage_bucket_object" "html" {
  for_each      = fileset("./build", "**/*.html")
  name          = each.value
  source        = "./build/${each.value}"
  content_type  = "text/html"
  cache_control = "no-cache"
  bucket        = google_storage_bucket.bucket.id
}

resource "google_storage_bucket_object" "png" {
  for_each     = fileset("./build", "**/*.png")
  name         = each.value
  source       = "./build/${each.value}"
  content_type = "image/png"
  bucket       = google_storage_bucket.bucket.id
}

resource "google_storage_bucket_object" "ico" {
  for_each     = fileset("./build", "**/*.ico")
  name         = each.value
  source       = "./build/${each.value}"
  content_type = "image/vnd.microsoft.icon"
  bucket       = google_storage_bucket.bucket.id
}

resource "google_storage_bucket_object" "css" {
  for_each     = fileset("./build", "**/*.css")
  name         = each.value
  source       = "./build/${each.value}"
  content_type = "text/css"
  bucket       = google_storage_bucket.bucket.id
}

resource "google_storage_bucket_object" "js" {
  for_each     = fileset("./build", "**/*.js")
  name         = each.value
  source       = "./build/${each.value}"
  content_type = "text/javascript"
  bucket       = google_storage_bucket.bucket.id
}

resource "google_storage_bucket_object" "json" {
  for_each      = fileset("./build", "**/*.json")
  name          = each.value
  source        = "./build/${each.value}"
  content_type  = "application/json"
  cache_control = "no-cache"
  bucket        = google_storage_bucket.bucket.id
}

resource "google_storage_bucket_object" "webmanifest" {
  for_each     = fileset("./build", "**/*.webmanifest")
  name         = each.value
  source       = "./build/${each.value}"
  content_type = "application/manifest+json"
  bucket       = google_storage_bucket.bucket.id
}

resource "google_storage_bucket_object" "txt" {
  for_each     = fileset("./build", "**/*.txt")
  name         = each.value
  source       = "./build/${each.value}"
  content_type = "text/plain"
  bucket       = google_storage_bucket.bucket.id
}
