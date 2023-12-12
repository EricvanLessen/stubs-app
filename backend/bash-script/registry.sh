#!/bin/bash

# Set the path to the Docker registry image
REGISTRY_IMAGE="registry:2"

# Set the container name for the registry
REGISTRY_CONTAINER_NAME="local-registry"

# Set the port for the registry
REGISTRY_PORT=5000

echo "Pulling the latest Docker registry image..."
docker pull $REGISTRY_IMAGE

echo "Starting the Docker registry container..."
docker run -d -p $REGISTRY_PORT:$REGISTRY_PORT --restart=always --name $REGISTRY_CONTAINER_NAME $REGISTRY_IMAGE

echo "Docker registry is running on port $REGISTRY_PORT"
