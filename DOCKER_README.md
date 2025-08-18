# Docker Setup for eCommerce Application

This repository contains a complete Docker setup for the Next.js eCommerce application with PostgreSQL database and Nginx reverse proxy.

## 🏗️ Architecture

The Docker setup includes:

- **Next.js Application**: Main eCommerce application
- **PostgreSQL Database**: Data storage
- **Nginx**: Reverse proxy with SSL termination and rate limiting
- **Docker Compose**: Container orchestration

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Port 80, 443, 3000, and 5432 available

### Production Setup

1. **Clone and setup**:

   ```bash
   git clone <your-repo>
   cd eCom
   ./docker-setup.sh prod
   ```

2. **Access the application**:
   - Main application: http://localhost
   - Database: localhost:5432

### Development Setup

1. **Start development environment**:

   ```bash
   ./docker-setup.sh dev
   ```

2. **Access the application**:
   - Main application: http://localhost:3000
   - Database: localhost:5432

## 📋 Available Commands

| Command                     | Description                   |
| --------------------------- | ----------------------------- |
| `./docker-setup.sh prod`    | Start production environment  |
| `./docker-setup.sh dev`     | Start development environment |
| `./docker-setup.sh stop`    | Stop all services             |
| `./docker-setup.sh clean`   | Clean up Docker resources     |
| `./docker-setup.sh logs`    | Show application logs         |
| `./docker-setup.sh migrate` | Run database migrations       |
| `./docker-setup.sh seed`    | Seed the database             |

## 🔧 Configuration

### Environment Variables

Update the `.env` file (created automatically) with your values:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ecom

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-very-secure-secret-key-here

# Node Environment
NODE_ENV=production

# Optional: Add your other environment variables
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### SSL Certificates

For production, replace the self-signed certificates in the `ssl/` directory:

```bash
# Place your certificates
ssl/cert.pem    # SSL certificate
ssl/key.pem     # Private key
```

## 🏭 Production Deployment

### Docker Compose Production

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Manual Docker Commands

```bash
# Build the application
docker build -t ecom-app .

# Run with database
docker run -d --name ecom-postgres \
  -e POSTGRES_DB=ecom \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

docker run -d --name ecom-app \
  -e DATABASE_URL=postgresql://postgres:postgres@ecom-postgres:5432/ecom \
  -p 3000:3000 \
  --link ecom-postgres:postgres \
  ecom-app
```

## 🛠️ Development

### Local Development with Docker

```bash
# Start development environment
./docker-setup.sh dev

# Or manually
docker-compose -f docker-compose.dev.yml up --build
```

### Database Operations

```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npx prisma db seed

# Access database shell
docker-compose exec postgres psql -U postgres -d ecom

# Reset database
docker-compose exec app npx prisma migrate reset --force
```

## 🔍 Monitoring and Debugging

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f nginx
```

### Container Shell Access

```bash
# Access app container
docker-compose exec app sh

# Access database container
docker-compose exec postgres psql -U postgres -d ecom
```

### Health Checks

```bash
# Check application health
curl http://localhost/health

# Check database connection
docker-compose exec postgres pg_isready -U postgres
```

## 🔒 Security Features

### Nginx Security Headers

- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Rate Limiting

- General requests: 10 requests/second
- Authentication requests: 5 requests/second
- Burst handling configured

### SSL/TLS

- TLS 1.2 and 1.3 support
- Modern cipher suites
- HTTPS redirect (configurable)

## 📊 Performance Optimizations

### Nginx Features

- Gzip compression
- Static file caching
- Upstream load balancing ready
- Browser caching headers

### Docker Optimizations

- Multi-stage builds
- Minimal Alpine Linux base
- Layer caching optimization
- Non-root user execution

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**:

   ```bash
   # Check port usage
   lsof -i :80 -i :443 -i :3000 -i :5432
   ```

2. **Database connection issues**:

   ```bash
   # Check database logs
   docker-compose logs postgres

   # Test connection
   docker-compose exec postgres pg_isready -U postgres
   ```

3. **SSL certificate issues**:

   ```bash
   # Regenerate certificates
   rm ssl/*
   ./docker-setup.sh prod
   ```

4. **Build failures**:
   ```bash
   # Clean build
   docker-compose down -v
   docker system prune -f
   docker-compose up --build
   ```

### Performance Issues

```bash
# Monitor resource usage
docker stats

# Check disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Database Backups

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres ecom > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres ecom < backup.sql
```

### Log Rotation

Configure log rotation in your production environment:

```bash
# Example logrotate configuration
/var/log/docker/containers/*/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
}
```

## 📝 Additional Notes

- The setup uses PostgreSQL 15 Alpine for minimal footprint
- Next.js runs in standalone mode for optimized Docker deployment
- Nginx serves as a reverse proxy with production-ready configuration
- All services are connected via a custom Docker network
- Persistent volumes are used for database data

For more information, check the individual configuration files:

- `Dockerfile` - Production application container
- `Dockerfile.dev` - Development container
- `docker-compose.yml` - Production orchestration
- `docker-compose.dev.yml` - Development orchestration
- `nginx.conf` - Nginx configuration
