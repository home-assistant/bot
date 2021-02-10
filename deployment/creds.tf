data "aws_secretsmanager_secret" "homeassistant_bot_env" {
  name = "${terraform.workspace}/bot/env"
}

data "aws_secretsmanager_secret_version" "homeassistant_bot_env" {
  secret_id = data.aws_secretsmanager_secret.homeassistant_bot_env.id
}


data "aws_secretsmanager_secret" "homeassistant_bot_deploy" {
  name = "${terraform.workspace}/bot/deploy"
}

data "aws_secretsmanager_secret_version" "homeassistant_bot_deploy" {
  secret_id = data.aws_secretsmanager_secret.homeassistant_bot_deploy.id
}
