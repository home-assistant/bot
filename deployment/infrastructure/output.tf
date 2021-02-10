output "public_subnet" {
  value = aws_subnet.public[*].id
}

output "private_subnet" {
  value = aws_subnet.private[*].id
}

output "ecs_cluster" {
  value = aws_ecs_cluster.svcs.id
}

output "network_id" {
  value = aws_vpc.network.id
}
