provider "google" {
  project = "CalmMyStreet"
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
  bucket   = "calmmystreet-${var.suffix}"
  role     = "roles/storage.objectViewer"
  member   = "allUsers"
}

resource "google_compute_backend_bucket" "bucket_backend" {
  name        = "calmmystreet-${var.suffix}-bucket-backend"
  bucket_name = google_storage_bucket.bucket.name
}
