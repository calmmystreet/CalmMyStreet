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
  backend "gcs" {
    bucket = "calmmystreet-terraform"
    prefix = "terraform/state"
  }
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

resource "google_compute_global_forwarding_rule" "http_ipv6" {
  name                  = "calmmystreet-${var.suffix}-forwarding-rule-ipv6"
  target                = google_compute_target_http_proxy.target_http_proxy.self_link
  ip_address            = google_compute_global_address.ipv6.id
  port_range            = 80
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_compute_global_forwarding_rule" "https_ipv6" {
  name                  = "calmmystreet-${var.suffix}-ipv6"
  target                = google_compute_target_https_proxy.target_https_proxy.self_link
  ip_address            = google_compute_global_address.ipv6.id
  port_range            = 443
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

### NETWORKING ###
resource "google_compute_global_address" "ip" {
  name       = "calmmystreet-${var.suffix}-ip"
  ip_version = "IPV4"
}

resource "google_compute_global_address" "ipv6" {
  name       = "calmmystreet-${var.suffix}-ipv6"
  ip_version = "IPV6"
}

resource "google_compute_managed_ssl_certificate" "cert" {
  name = "calmmystreet-${var.suffix}-cert"
  managed {
    domains = [
      "${var.domain}"
    ]
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
