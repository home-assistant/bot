[
  {
    "name": "bot",
    "image": "${image}",
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": 8000
      }
    ],
    "command": [
      "start:prod"
    ],
    "environment": [
      {
        "name": "WEBSOCKET_PORT",
        "value": "8000"
      },
%{ for sec_name, sec_value in secrets}
      {
        "name": "${sec_name}",
        "value": "${sec_value}"
      },
%{ endfor }
      {
        "name": "LOG_LEVEL",
        "value": "${log_level}"
      },
      {
        "name": "NODE_ENV",
        "value": "${node_env}"
      }
    ],
    "Ulimits": [
      {
        "HardLimit": 1000000,
        "Name": "nofile",
        "SoftLimit": 1000000
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }
]