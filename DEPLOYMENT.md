# Vercel Deployment Guide

This guide will help you deploy the Yasser Store application to Vercel with PostgreSQL database.

## Prerequisites

1. Vercel account (free tier is sufficient)
2. GitHub repository with your code
3. Vercel Postgres database (or external PostgreSQL service like Neon, Supabase)

## Step 1: Set up Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Create a new project or select existing one
3. Go to Storage tab
4. Create a new Postgres database
5. Copy the connection strings provided

### Option B: External PostgreSQL (Neon, Supabase, etc.)

1. Create a free PostgreSQL database on Neon.tech or Supabase
2. Get the connection string

## Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
DATABASE_URL=your_postgres_connection_string
DIRECT_URL=your_postgres_direct_connection_string
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate_a_secure_random_string
ADMIN_EMAIL=your_admin_email@example.com
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Method 2: GitHub Integration

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main branch
3. The build command will automatically run database migrations

## Step 4: Database Setup

After deployment, the database schema will be automatically created via the `vercel-build` script.

To manually run database operations:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# View database (local only)
npx prisma studio
```

## Step 5: Create Admin User

After deployment, register a new user with the email you set in `ADMIN_EMAIL`. This user will automatically become an admin.

## Important Notes

### File Storage

- Vercel serverless functions don't support persistent file storage
- For image uploads, consider using:
  - Vercel Blob Storage
  - Cloudinary
  - AWS S3
  - Supabase Storage

### Database Connections

- Vercel functions have connection limits
- Prisma handles connection pooling automatically
- Consider using Prisma Data Proxy for production

### Environment Variables

- Never commit `.env.local` to version control
- Set all environment variables in Vercel dashboard
- Use different values for development and production

## Troubleshooting

### Build Errors

1. Check that all environment variables are set
2. Ensure DATABASE_URL is accessible from Vercel
3. Check Vercel function logs for detailed errors

### Database Connection Issues

1. Verify connection string format
2. Check database firewall settings
3. Ensure database allows connections from Vercel IPs

### Authentication Issues

1. Verify NEXTAUTH_URL matches your domain
2. Check NEXTAUTH_SECRET is set and secure
3. Ensure cookies work with your domain

## Performance Optimization

1. Enable Vercel Analytics
2. Use Vercel Edge Functions for better performance
3. Implement proper caching strategies
4. Optimize images with Next.js Image component

## Monitoring

1. Use Vercel Analytics for performance monitoring
2. Set up error tracking (Sentry, LogRocket)
3. Monitor database performance
4. Set up uptime monitoring

## Scaling

Vercel free tier includes:
- 100GB bandwidth
- 1000 serverless function invocations
- 1 concurrent build

For higher traffic, consider upgrading to Vercel Pro.