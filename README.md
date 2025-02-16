# URL Shortener

A modern URL shortening service built with the T3 Stack (Next.js, TypeScript, tRPC, Prisma, NextAuth.js, and Tailwind CSS).

## Features

- ✂️ URL Shortening with custom slug support
- 🔒 User Authentication
- 📊 URL visit tracking
- 📋 Copy to clipboard functionality
- 🛡️ Rate limiting
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

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

### Email Testing

This project uses MailHog for email testing in development. No real emails are sent - instead, you can view all emails in the MailHog web interface:

#### Local Development

1. Start the application using the Docker command above
2. Open [http://localhost:8025](http://localhost:8025) in your browser
3. You'll see all emails sent by the application (signup, password reset, etc.)

#### Live Environment

For the live deployment, you can view emails at [https://mailhog-latest-xiqq.onrender.com/](https://mailhog-latest-xiqq.onrender.com/)

## Live Demo

The application is deployed and available at [deeporigin.sachinmour.com](https://deeporigin.sachinmour.com)

### Development

For local development:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development environment: `npm run docker:dev`
4. The application will be available at [http://localhost:3000](http://localhost:3000)

## Tech Stack

- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [TypeScript](https://typescriptlang.org)
- [Docker](https://www.docker.com/)
