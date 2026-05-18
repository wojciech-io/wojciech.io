variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages:Edit + DNS:Edit scope for the wojciech.io zone"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (visible in dashboard URL)"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for wojciech.io"
  type        = string
}
