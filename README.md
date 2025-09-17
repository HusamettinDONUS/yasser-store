# Yasser Store - Showcase Website

Modern ve şık ürün vitrin web sitesi. Toptancılar için basit ve etkili ürün sergilemesi. Next.js, TypeScript ve Prisma ile geliştirilmiş.

## 🚀 Özellikler

- 🏪 **Ürün Vitrin Sistemi**: Güzel ve modern ürün sergilemesi
- 🔐 **Admin Paneli**: Basit admin girişi ile ürün yönetimi (CRUD)
- 👨‍💼 **Sadece Admin Auth**: Basit admin authentication sistemi
- 🌐 **Çoklu Dil**: Türkçe, Arapça, İngilizce desteği
- 📱 **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- 🎨 **Modern UI**: Shadcn/ui + TailwindCSS
- 🚫 **No E-commerce**: Sepet, ödeme, sipariş yok - sadece vitrin

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod) + Prisma ORM
- **Auth**: Simple session-based authentication (admin only)
- **Styling**: TailwindCSS + Shadcn/ui
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel + Vercel Postgres/Blob

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

# Admin (ilk kayıt olan bu email admin olur)
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
2. `ADMIN_EMAIL` ile `/api/auth/register` endpoint'ine kayıt olun veya script kullanın
3. Otomatik admin yetkisi alacaksınız
4. `/auth/signin` üzerinden giriş yapın
5. Admin paneline `/admin` üzerinden erişin

### Admin Oluşturma Script'i

```bash
node scripts/create-admin.js
```

## 📖 Detaylı Deployment Guide

Detaylı deployment rehberi için `DEPLOYMENT.md` dosyasına bakın.
