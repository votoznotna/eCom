#!/bin/bash

# Setup script for Docker deployment

echo "🚀 Setting up eCommerce Docker Environment"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
mkdir -p ssl

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ecom

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-very-secure-secret-key-here

# Node Environment
NODE_ENV=production

# Optional: Add your other environment variables here
# UPLOADTHING_SECRET=
# UPLOADTHING_APP_ID=
# PAYPAL_CLIENT_ID=
# PAYPAL_CLIENT_SECRET=
EOF
    echo "✅ .env file created. Please update with your actual values."
fi

# Generate self-signed SSL certificates (for development)
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    echo "🔐 Generating self-signed SSL certificates..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    echo "✅ SSL certificates generated."
fi

# Function to start production environment
start_production() {
    echo "🏭 Starting production environment..."
    docker-compose down
    docker-compose up --build -d
    echo "✅ Production environment started!"
    echo "🌐 Application available at: http://localhost"
    echo "📊 Database available at: localhost:5432"
}

# Function to start development environment
start_development() {
    echo "🛠️  Starting development environment..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build
    echo "✅ Development environment started!"
    echo "🌐 Application available at: http://localhost:3000"
}

# Function to stop all services
stop_all() {
    echo "🛑 Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ All services stopped."
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    echo "✅ Cleanup completed."
}

# Function to show logs
show_logs() {
    echo "📋 Showing application logs..."
    docker-compose logs -f app
}

# Function to run database migrations
run_migrations() {
    echo "🔄 Running database migrations..."
    docker-compose exec app npx prisma migrate deploy
    echo "✅ Migrations completed."
}

# Function to seed database
seed_database() {
    echo "🌱 Seeding database..."
    docker-compose exec app npx prisma db seed
    echo "✅ Database seeded."
}

# Main menu
case "$1" in
    "prod"|"production")
        start_production
        ;;
    "dev"|"development")
        start_development
        ;;
    "stop")
        stop_all
        ;;
    "clean")
        cleanup
        ;;
    "logs")
        show_logs
        ;;
    "migrate")
        run_migrations
        ;;
    "seed")
        seed_database
        ;;
    *)
        echo "Usage: $0 {prod|dev|stop|clean|logs|migrate|seed}"
        echo ""
        echo "Commands:"
        echo "  prod        - Start production environment"
        echo "  dev         - Start development environment"
        echo "  stop        - Stop all services"
        echo "  clean       - Clean up all Docker resources"
        echo "  logs        - Show application logs"
        echo "  migrate     - Run database migrations"
        echo "  seed        - Seed the database"
        echo ""
        echo "Examples:"
        echo "  $0 prod     # Start production environment"
        echo "  $0 dev      # Start development environment"
        echo "  $0 stop     # Stop all services"
        exit 1
        ;;
esac
