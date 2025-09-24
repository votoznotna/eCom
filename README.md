# eCommerce Platform

A modern, full-stack eCommerce platform built with Next.js 15, featuring user authentication, product management, shopping cart, order processing, and admin dashboard. The application uses PostgreSQL with Prisma ORM, NextAuth.js for authentication, and includes Docker support for both development and production environments.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Next.js API routes with server actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta)
- **File Upload**: UploadThing integration
- **Payments**: PayPal integration
- **Testing**: Jest with React Testing Library
- **Deployment**: Docker containerization with Nginx reverse proxy

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** (v15 or higher) or Docker
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eCom
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ecom"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-very-secure-secret-key-here"

# Optional: File Upload (UploadThing)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Optional: PayPal Integration
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Node Environment
NODE_ENV="development"
```

### 4. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `ecom`
3. Update the `DATABASE_URL` in your `.env` file
4. Run database migrations:

```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

#### Option B: Docker PostgreSQL

```bash
# Start PostgreSQL container
docker run --name ecom-postgres \
  -e POSTGRES_DB=ecom \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine

# Run migrations
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🐳 Docker Setup

The project includes comprehensive Docker support for both development and production environments.

### Development Environment

```bash
# Start development environment
npm run docker:dev
# or
./docker-setup.sh dev
```

### Production Environment

```bash
# Start production environment
npm run docker:prod
# or
./docker-setup.sh prod
```

### Docker Commands

```bash
# Stop all services
npm run docker:stop

# View application logs
npm run docker:logs

# Run database migrations
npm run docker:migrate

# Seed the database
npm run docker:seed

# Clean up Docker resources
npm run docker:clean
```

## 🧪 Testing

The project includes comprehensive testing setup with Jest and React Testing Library.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API route and database interaction tests
- **E2E Tests**: User flow and authentication tests

## 📁 Project Structure

```
eCom/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/                   # Public routes
│   │   ├── cart/
│   │   ├── order/
│   │   ├── product/
│   │   └── search/
│   ├── admin/                    # Admin dashboard
│   │   ├── orders/
│   │   ├── products/
│   │   └── users/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   └── uploadthing/
│   └── user/                     # User dashboard
├── components/                   # React components
│   ├── admin/                    # Admin-specific components
│   ├── shared/                   # Shared components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions and configurations
│   ├── actions/                  # Server actions
│   ├── constants/                # Application constants
│   └── validators/               # Zod schemas
├── prisma/                       # Database schema and migrations
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── tests/                        # Test files
└── public/                       # Static assets
```

## 🔧 Key Features

### Authentication & Authorization

- NextAuth.js v5 integration
- Credential-based authentication
- Role-based access control (user/admin)
- Protected routes and middleware

### Product Management

- Product CRUD operations
- Image upload with UploadThing
- Category and brand management
- Stock tracking and inventory

### Shopping Experience

- Shopping cart with session persistence
- Product search and filtering
- Product reviews and ratings
- Responsive design with dark/light mode

### Order Processing

- Multi-step checkout process
- Shipping address management
- Payment method selection
- Order tracking and history

### Admin Dashboard

- User management
- Product administration
- Order management
- Analytics and reporting

## 🛠️ Development

### Code Quality

The project uses ESLint for code linting:

```bash
npm run lint
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Adding New Components

The project uses shadcn/ui for component library:

```bash
# Add a new component
npx shadcn@latest add [component-name]

# Example: Add a button component
npx shadcn@latest add button
```

## 🔐 Security Considerations

- Environment variables for sensitive data
- CSRF protection with NextAuth.js
- Input validation with Zod schemas
- SQL injection prevention with Prisma
- Secure password hashing with bcrypt

## 📦 Build & Deployment

### Local Build

```bash
npm run build
npm start
```

### Docker Build

```bash
# Build production image
docker build -t ecom-app .

# Run production container
docker run -p 3000:3000 ecom-app
```

### Environment Variables for Production

Ensure the following environment variables are set in production:

- `DATABASE_URL`: Production database connection string
- `NEXTAUTH_URL`: Production application URL
- `NEXTAUTH_SECRET`: Secure random string
- `UPLOADTHING_SECRET`: UploadThing secret key
- `UPLOADTHING_APP_ID`: UploadThing application ID
- `PAYPAL_CLIENT_ID`: PayPal client ID
- `PAYPAL_CLIENT_SECRET`: PayPal client secret

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **Authentication Issues**

   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure environment variables are loaded

3. **Build Issues**

   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npx tsc --noEmit`

4. **Docker Issues**
   - Ensure Docker and Docker Compose are installed
   - Check port conflicts (3000, 5432)
   - Verify Docker daemon is running

## Production

You can view the production version of this project at [https://ecom-dusky-psi.vercel.app/](https://ecom-dusky-psi.vercel.app/).
