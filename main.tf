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

variable "suffix" {
  type    = string
  default = "main"
}

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

resource "google_compute_url_map" "http_redirect" {
  default_url_redirect {
    https_redirect         = true
    strip_query            = false
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
  }
  name = "calmmystreet-${var.suffix}-redirect"
}

resource "google_compute_url_map" "https_proxy" {
  default_service = google_compute_backend_bucket.bucket_backend.id
  name            = "calmmystreet-${var.suffix}-proxy"
}

resource "google_compute_target_http_proxy" "target_http_proxy" {
  name    = "calmmystreet-${var.suffix}-target-http-redirect"
  url_map = google_compute_url_map.http_redirect.id
}

resource "google_compute_target_https_proxy" "target_https_proxy" {
  name    = "calmmystreet-${var.suffix}-target-proxy"
  url_map = google_compute_url_map.https_proxy.id
  ssl_certificates = [
    "projects/calmmystreet/global/sslCertificates/calmmystreet" # external dependency!
  ]
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "calmmystreet-${var.suffix}-http-forwarding"
  target                = google_compute_target_http_proxy.target_http_proxy.self_link
  ip_address            = google_compute_global_address.ip.id
  port_range            = 80
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_compute_global_forwarding_rule" "https" {
  name                  = "calmmystreet-${var.suffix}-https-forwarding"
  target                = google_compute_target_https_proxy.target_https_proxy.self_link
  ip_address            = google_compute_global_address.ip.id
  port_range            = 443
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_compute_global_address" "ip" {
  name = "calmmystreet-${var.suffix}-ip"
}