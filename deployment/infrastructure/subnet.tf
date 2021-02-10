data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.network.id
  cidr_block        = cidrsubnet(var.network_cidr, 8, count.index + 1)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Environment = var.stage
    Region      = var.region
    Zone        = "public"
  }
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_subnet" "private" {
  count = var.with_ec2 ? 2 : 0

  vpc_id            = aws_vpc.network.id
  cidr_block        = cidrsubnet(var.network_cidr, 8, count.index + 16)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Environment = var.stage
    Region      = var.region
    Zone        = "private"
  }
}

resource "aws_route_table_association" "private" {
  count = var.with_ec2 ? 2 : 0

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}
