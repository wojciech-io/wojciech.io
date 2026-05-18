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
      compatibility_date    = "2026-05-10"
      usage_model           = "standard"
      fail_open             = true
    }
    production {
      environment_variables = {
        PUBLIC_CF_BEACON_TOKEN = "26d8fe58addc4d2aa30f80f03f4c13c0"
      }
      compatibility_date    = "2026-05-10"
      usage_model           = "standard"
      fail_open             = true
    }
  }
}

resource "cloudflare_pages_domain" "wojciech_io_custom" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.wojciech_io.name
  domain       = "wojciech.io"
}
