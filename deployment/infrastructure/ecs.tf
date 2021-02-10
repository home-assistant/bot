resource "aws_ecs_cluster" "svcs" {
  name = "HomeAssistant-Bot-${var.stage}"

  tags = {
    Environment = var.stage
    Region      = var.region
  }
}
