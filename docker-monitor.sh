#!/bin/bash

# Docker monitoring script for eCommerce application

echo "🔍 eCommerce Application Monitoring"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi

# Function to check container status
check_container() {
    local container_name=$1
    local status=$(docker inspect -f '{{.State.Status}}' "$container_name" 2>/dev/null)
    
    if [ "$status" = "running" ]; then
        echo "✅ $container_name: Running"
    elif [ "$status" = "exited" ]; then
        echo "❌ $container_name: Exited"
    elif [ -z "$status" ]; then
        echo "❌ $container_name: Not found"
    else
        echo "⚠️  $container_name: $status"
    fi
}

# Function to check service health
check_service_health() {
    local service_name=$1
    local url=$2
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo "✅ $service_name: Healthy"
    else
        echo "❌ $service_name: Unhealthy"
    fi
}

# Function to show resource usage
show_resource_usage() {
    echo ""
    echo "📊 Resource Usage:"
    echo "=================="
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

# Function to show container logs
show_recent_logs() {
    echo ""
    echo "📋 Recent Logs:"
    echo "==============="
    echo "App Container:"
    docker logs --tail 5 ecom_app 2>/dev/null || echo "No logs available"
    
    echo ""
    echo "Database Container:"
    docker logs --tail 5 ecom_postgres 2>/dev/null || echo "No logs available"
}

# Main monitoring
echo ""
echo "🐳 Container Status:"
echo "===================="
check_container "ecom_app"
check_container "ecom_postgres"
check_container "ecom_nginx"

echo ""
echo "🌐 Service Health:"
echo "=================="
check_service_health "Application" "http://localhost:3000/api/health"
check_service_health "Nginx" "http://localhost/health"

# Show resource usage
show_resource_usage

# Show recent logs if requested
if [ "$1" = "--logs" ] || [ "$1" = "-l" ]; then
    show_recent_logs
fi

# Show disk usage
echo ""
echo "💾 Docker Disk Usage:"
echo "====================="
docker system df

echo ""
echo "📈 System Information:"
echo "====================="
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker-compose --version)"
echo "System uptime: $(uptime)"

# Check for updates
echo ""
echo "🔄 Container Images:"
echo "==================="
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | head -10
