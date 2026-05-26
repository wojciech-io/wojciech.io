# Cloudflare IaC — wojciech.io

Manages Cloudflare Pages config via Terraform. State is local by default (gitignored).

## Prerequisites

1. Install Terraform: `brew install terraform`
2. Create a scoped CF API token at dash.cloudflare.com → My Profile → API Tokens:
   - Permission: **Cloudflare Pages — Edit**
   - Permission: **Zone — DNS — Edit** (for wojciech.io zone)
   - Zone resource: wojciech.io
3. Find your Account ID and Zone ID in the Cloudflare dashboard sidebar.

## First-time setup

```bash
cd terraform/

# Create a tfvars file (gitignored)
cat > terraform.tfvars <<EOF
cloudflare_api_token  = "your-token-here"
cloudflare_account_id = "your-account-id"
cloudflare_zone_id    = "your-zone-id"
EOF

terraform init
terraform plan
terraform apply
```

## Import existing Pages project (first run only)

If the Pages project already exists in Cloudflare:

```bash
terraform import cloudflare_pages_project.wojciech_io ACCOUNT_ID/wojciech-io
```

## Day-to-day

```bash
terraform plan   # preview changes
terraform apply  # apply changes
```

## WAF posture

The baseline WAF rollout lives in [waf-rules.md](./waf-rules.md). Apply it in
Cloudflare in log/simulate mode first, then promote to challenge/block after
checking production traffic.

## State backup

Move to Cloudflare R2 backend when the site is in production:
```hcl
backend "s3" {
  bucket                      = "tf-state"
  key                         = "wojciech-io/terraform.tfstate"
  region                      = "auto"
  endpoint                    = "https://ACCOUNT_ID.r2.cloudflarestorage.com"
  access_key                  = "..."
  secret_key                  = "..."
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  force_path_style            = true
}
```
