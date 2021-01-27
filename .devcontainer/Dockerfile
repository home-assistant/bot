FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:14

ENV \
  DEBIAN_FRONTEND=noninteractive \
  DEVCONTAINER=true \
  PATH=$PATH:./node_modules/.bin

# Install cli
RUN \
    yarn global add \
        @nestjs/cli

# Install Terraforms
ARG TERRAFORM_VERSION=0.14.3
RUN \
    curl -Lo terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
    && unzip terraform.zip -d /usr/bin \
    && rm -f terraform.zip

# Setup AWS
COPY .devcontainer/* /tmp/data/
RUN \
    mkdir -p /root/.aws \
    && printf "[default]\nregion = us-east-1" > /root/.aws/config \
    && [ -f /tmp/data/credentials ] && cp /tmp/data/credentials /root/.aws/ || true \
    && rm -rf /tmp/data
