terraform {
  required_version = ">= 1.7"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  # Store state remotely — swap backend to Cloudflare R2 or Terraform Cloud when ready.
  # For now: local state, gitignored.
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
