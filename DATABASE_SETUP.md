# Database Setup Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the root directory:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/worldfelt?schema=public"
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

4. **Push the schema to your database**:
   ```bash
   npm run prisma:push
   ```

5. **Start the dev server**:
   ```bash
   npm run dev
   ```

## Local PostgreSQL Setup

### Option 1: Using Docker (Recommended)

```bash
docker run --name worldfelt-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=worldfelt -p 5432:5432 -d postgres:16
```

Your DATABASE_URL will be:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/worldfelt?schema=public"
```

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database:
   ```bash
   createdb worldfelt
   ```
3. Update your `.env` with your credentials

## Prisma Commands

- **Generate Client**: `npm run prisma:generate` - Generates the Prisma Client
- **Push Schema**: `npm run prisma:push` - Pushes schema changes to database
- **Open Studio**: `npm run prisma:studio` - Opens Prisma Studio (database GUI)

## Production Deployment

For production, use a hosted PostgreSQL service:

- **Vercel Postgres**: Easiest with Vercel deployment
- **Supabase**: Free tier with 500MB
- **Railway**: Simple PostgreSQL hosting
- **Neon**: Serverless PostgreSQL

Update your production environment variables with the connection string from your chosen provider.

## Schema Overview

```prisma
model Feeling {
  id        Int      @id @default(autoincrement())
  latitude  Float
  longitude Float
  feeling   String
  comment   String?
  createdAt DateTime @default(now())
}
```

## API Endpoints

### GET /api/feelings
Returns the last 100 feelings ordered by creation date (newest first).

### POST /api/feelings
Creates a new feeling. Required fields:
- `latitude` (number, -90 to 90)
- `longitude` (number, -180 to 180)
- `feeling` (string)
- `comment` (string, optional)
