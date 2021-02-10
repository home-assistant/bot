data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm*"]
  }

  filter {
    name   = "name"
    values = ["*x86_64-ebs"]
  }
}

resource "aws_security_group" "cluster" {
  count = var.with_ec2 ? 1 : 0

  name        = "homeassistant-bot-ecs-cluster-${var.stage}"
  description = "homeassistant-bot-ecs-cluster"
  vpc_id      = aws_vpc.network.id

  egress {
    description = "Outgoing traffics"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Internal access"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.network_cidr]
  }

  tags = {
    Environment = var.stage
    Region      = var.region
  }
}


resource "aws_launch_configuration" "ecs_launch_configuration" {
  count = var.with_ec2 ? 1 : 0

  name_prefix          = "ecs-homeassistant-bot-${var.stage}-"
  image_id             = data.aws_ami.amazon_linux.id
  instance_type        = var.stage == "t2.small"
  iam_instance_profile = var.ecs_policy

  security_groups = [aws_security_group.cluster[0].id]

  root_block_device {
    volume_type           = "standard"
    volume_size           = 100
    delete_on_termination = true
  }

  lifecycle {
    create_before_destroy = true
  }

  user_data = <<EOF
                                  #!/bin/bash
                                  echo ECS_CLUSTER=${aws_ecs_cluster.svcs.name} >> /etc/ecs/ecs.config
                                  EOF

  depends_on = [aws_ecs_cluster.svcs]
}

resource "aws_cloudwatch_metric_alarm" "ecs_memory_high" {
  count = var.with_ec2 ? 1 : 0

  alarm_name          = "mem-util-high-cloud-${var.stage}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryReservation"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "90"
  alarm_description   = "This metric monitors ec2 memory for high reservation on ecs ec2 hosts"
  alarm_actions = [
    aws_autoscaling_policy.ecs_autoscaling_up[0].arn
  ]
  dimensions = {
    ClusterName = aws_ecs_cluster.svcs.name
  }
}

resource "aws_cloudwatch_metric_alarm" "ecs_memory_low" {
  count = var.with_ec2 ? 1 : 0

  alarm_name          = "mem-util-low-homeassistant-bot-${var.stage}"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryReservation"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "40"
  alarm_description   = "This metric monitors ec2 memory for low reservation on ecs ec2 hosts"
  alarm_actions = [
    aws_autoscaling_policy.ecs_autoscaling_down[0].arn
  ]
  dimensions = {
    ClusterName = aws_ecs_cluster.svcs.name
  }
}

resource "aws_cloudwatch_metric_alarm" "ecs_cpu_high" {
  count = var.with_ec2 ? 1 : 0

  alarm_name          = "cpu-util-high-homeassistant-bot-${var.stage}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUReservation"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "90"
  alarm_description   = "This metric monitors ec2 cpu for high reservation on ecs ec2 hosts"
  alarm_actions = [
    aws_autoscaling_policy.ecs_autoscaling_up[0].arn
  ]
  dimensions = {
    ClusterName = aws_ecs_cluster.svcs.name
  }
}

resource "aws_cloudwatch_metric_alarm" "ecs_cpu_low" {
  count = var.with_ec2 ? 1 : 0

  alarm_name          = "cpu-util-low-homeassistant-bot-${var.stage}"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUReservation"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "40"
  alarm_description   = "This metric monitors ec2 cpu for low reservation on ecs ec2 hosts"
  alarm_actions = [
    aws_autoscaling_policy.ecs_autoscaling_down[0].arn
  ]
  dimensions = {
    ClusterName = aws_ecs_cluster.svcs.name
  }
}
