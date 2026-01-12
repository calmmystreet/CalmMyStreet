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
