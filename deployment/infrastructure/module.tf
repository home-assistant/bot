
provider "aws" {
  region = var.region
}

variable "stage" {
  description = "Stage area of infrastructure"
}

variable "region" {
  description = "Region of AWS for staging infrastructure"
}

variable "network_cidr" {
  description = "Network CIDR for VPC"
}

variable "with_ec2" {
  type        = bool
  description = "Attach EC2 to the ECS cluster / NAT"
}

variable "ecs_policy" {
  type        = string
  description = "The name attribute of the IAM instance profile"
}
