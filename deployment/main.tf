terraform {
  backend "s3" {
    bucket               = "homeassistant-tf"
    key                  = "terraform.tfstate"
    region               = "us-east-1"
    workspace_key_prefix = "bot"
  }
}

provider "aws" {
  region = "us-east-1"
}

module "us-east-1" {
  source       = "./infrastructure"
  region       = "us-east-1"
  stage        = terraform.workspace
  with_ec2     = true
  ecs_policy   = aws_iam_instance_profile.ecs_instance_profile.arn
  network_cidr = jsondecode(data.aws_secretsmanager_secret_version.cloud_deploy.secret_string)["cidr_us-east-1"]
}
