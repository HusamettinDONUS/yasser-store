# Yasser Store - E-commerce Platform

Modern, tam özellikli e-ticaret uygulaması. Next.js, TypeScript, Prisma ve NextAuth ile geliştirilmiş.

## 🚀 Özellikler

- 🛍️ **Tam E-ticaret Sistemi**: Ürün katalogu, sepet, sipariş yönetimi
- 🔐 **Güvenli Authentication**: NextAuth ile kullanıcı giriş/kayıt
- 👨‍💼 **Admin Paneli**: Ürün ve sipariş yönetimi
- 🌐 **Çoklu Dil**: Türkçe, Arapça, İngilizce desteği
- 📱 **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- 🎨 **Modern UI**: Shadcn/ui + TailwindCSS

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: TailwindCSS + Shadcn/ui
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel + Vercel Postgres

## 📦 Kurulum

1. **Repository'yi klonlayın**

```bash
git clone <repository-url>
cd yasser-store
```

2. **Dependencies'leri yükleyin**

```bash
npm install
```

3. **Environment variables'ı ayarlayın**

```bash
# .env.local dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

# Database (Development için SQLite, Production için PostgreSQL)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Admin
ADMIN_EMAIL="admin@example.com"
```

4. **Database'i hazırlayın**

```bash
npx prisma generate
npx prisma db push
```

5. **Development server'ı başlatın**

```bash
npm run dev
```

## 🚢 Vercel'e Deployment

### 1. Vercel Postgres Database Oluşturun

- Vercel dashboard → Storage → Create Database
- PostgreSQL seçin
- Connection string'i kopyalayın

### 2. Environment Variables (Vercel Dashboard)

```bash
DATABASE_URL="your-vercel-postgres-url"
DIRECT_URL="your-vercel-postgres-direct-url"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="secure-random-string"
ADMIN_EMAIL="your-admin-email"
```

### 3. Deploy

```bash
npm run vercel-build  # Test build locally
vercel --prod         # Deploy to production
```

## 📋 Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run vercel-build` - Vercel deployment build
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Prisma Studio

## 🔑 Admin Kurulumu

1. Uygulamayı deploy edin
2. `ADMIN_EMAIL` ile kayıt olun
3. Otomatik admin yetkisi alacaksınız
4. Admin paneline `/admin` üzerinden erişin

## 📖 Detaylı Deployment Guide

Detaylı deployment rehberi için `DEPLOYMENT.md` dosyasına bakın.
