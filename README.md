# URL Shortener

A modern URL shortening service built with the T3 Stack (Next.js, TypeScript, tRPC, Prisma, NextAuth.js, and Tailwind CSS).

## Project Overview

This URL shortener service demonstrates modern full-stack development practices and architecture. It allows users to create shortened versions of long URLs, making them easier to share and manage. The project showcases clean architecture, type safety, and security best practices.

### Key Design Decisions

- **T3 Stack**: Chosen for its excellent developer experience and type safety across the full stack
- **tRPC**: Enables end-to-end typesafe APIs without schema duplication
- **NextAuth.js**: Provides secure authentication
- **Docker**: Ensures consistent development and production environments
- **Rate Limiting**: Implements security best practices to prevent abuse

## Features

- ✂️ URL Shortening with custom slug support
- 🔒 User Authentication
- 📊 URL visit tracking
- 📋 Copy to clipboard functionality
- 🛡️ Rate limiting
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Demo

Watch the demo video: [URL Shortener Demo](https://komododecks.com/recordings/ksM5QtbKydJRpY3vp8f2)

Try the live application at [deeporigin.sachinmour.com](https://deeporigin.sachinmour.com)

For the live deployment, you can view emails at [https://mailhog-latest-xiqq.onrender.com/](https://mailhog-latest-xiqq.onrender.com/)

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 22+ (for local development)

### Running with Docker

To start the application in production mode:

```bash
npm run docker:prod
```

This will start all required services:

- Web application
- PostgreSQL database
- MailHog (for email testing)

### Development

For local development:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development environment: `npm run docker:dev`
4. The application will be available at [http://localhost:3000](http://localhost:3000)

### Testing

The project includes:

- Unit tests for core business logic
- Integration tests for API endpoints
- E2E tests using Playwright
- Rate limiting tests

Run tests with:

```bash
npm test        # Unit and integration tests
npm run test:e2e # E2E tests
```

## API Documentation

The API follows the JSON:API specification. Full documentation is available in [api-spec.yaml](./api-spec.yaml).

### Email Testing

This project uses MailHog for email testing in development. No real emails are sent - instead, you can view all emails in the MailHog web interface:

#### Local Development

1. Start the application using the Docker command above
2. Open [http://localhost:8025](http://localhost:8025) in your browser
3. You'll see all emails sent by the application (signup, password reset, etc.)

## Production Considerations

For a production-grade URL shortening service, several optimizations and architectural changes would be implemented:

### Security & Environment Variables

Note: This project currently uses basic environment variable handling for demonstration purposes. In a production environment, we would implement:

- **Secrets Management**:
  - Use AWS Secrets Manager or HashiCorp Vault for sensitive data
  - Rotate credentials regularly
  - Use separate keys for development and production

### Performance Optimizations

- **Redis Cache**: Implement Redis for:
  - Distributed Caching slug to URL mappings for faster redirects
  - Distributed Rate limiting implementation
  - Session management
- **CDN Integration**: Use a CDN for global distribution and faster redirects
- **Database Optimization**:
  - Database sharding for horizontal scaling
  - Read replicas for heavy analytics queries
  - Implement database connection pooling

### Infrastructure

- **Cloud Provider**: Migrate to a cloud provider like AWS or GCP for:
  - Auto-scaling capabilities
  - Load balancing
  - Geographic distribution
- **Monitoring & Observability**:
  - Implement ELK stack for logging
  - Use Prometheus & Grafana for metrics
  - Set up error tracking with Sentry
- **Database**: Consider using:
  - Supabase for better scalability and real-time features
  - MongoDB for flexible schema and horizontal scaling

### Feature Enhancements

- **Analytics**:
  - Click tracking with geographic data
  - User agent analysis
  - Traffic source tracking
- **API**:
  - Implement GraphQL for flexible data querying
  - Webhook support for URL visit notifications
- **User Features**:
  - URL expiration dates
  - QR code generation
  - Link preview customization

## Tech Stack

- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [TypeScript](https://typescriptlang.org)
- [Docker](https://www.docker.com/)
