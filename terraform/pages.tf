resource "cloudflare_pages_project" "wojciech_io" {
  account_id        = var.cloudflare_account_id
  name              = "wojciech-io"
  production_branch = "main"

  source {
    type = "github"
    config {
      owner                         = "wojciechluszczynski"
      repo_name                     = "wojciech-io"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["claude/**"]
      preview_branch_excludes       = []
    }
  }

  build_config {
    build_command   = "npm run build"
    destination_dir = "dist"
    root_dir        = ""
  }

  deployment_configs {
    preview {
      environment_variables = {}
      compatibility_date    = "2024-01-01"
    }
    production {
      environment_variables = {}
      compatibility_date    = "2024-01-01"
    }
  }
}

resource "cloudflare_pages_domain" "wojciech_io_custom" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.wojciech_io.name
  domain       = "wojciech.io"
}
