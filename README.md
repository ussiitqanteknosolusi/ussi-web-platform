# USSI ITS Official Platform

![USSI ITS Banner](/public/images/og-image.jpg)

**Modern Digital Ecosystem for Microfinance Institutions**

This repository contains the source code for the official website and digital platform of **PT. USSI ItQan Tekno Solusi (USSI ITS)**. Built with cutting-edge web technologies, this platform serves as the central hub for 1,700+ microfinance institutions (BPR, Koperasi, LKM) across Indonesia.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MySQL](https://www.mysql.com/) (Managed via [Prisma ORM](https://www.prisma.io/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: [Auth.js (NextAuth)](https://authjs.dev/)
- **Content Management**: Custom Admin Dashboard with Rich Text Editor (TipTap)

## Key Features

### 1. Dynamic Content Management

- **Integrated Admin Dashboard**: comprehensive analytics for Inquiries, Clients, and Products.
- **Blog System**: Full CMS capabilities for publishing articles and news.
- **Product & Service Management**: Dynamic pricing tiers, feature lists, and specifications.

### 2. High Performance & SEO

- **Server Side Rendering (SSR)**: Optimized for fast load times and search engine visibility.
- **Dynamic Sitemaps & Robots**: Automated SEO infrastructure.
- **Responsive Design**: Mobile-first architecture ensuring perfect display on all devices.

### 3. Client Trust System

- **Dynamic Partner Carousel**: Admin-managed logo marquee for 30+ key partners.
- **Lead Generation**: Integrated inquiry forms with email notification capabilities.

## Installation & Setup

### Prerequisites

- Node.js 18+
- MySQL Database

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ussi-its-official.git
   cd ussi-its-official
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/ussi_db"
   AUTH_SECRET="your_generated_secret_key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Setup Database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

## Deployment (Hostinger Node.js)

This project is optimized for deployment on Hostinger Business Plan (Node.js Environment).

1. **Connect Git**: Link this repository to your Hostinger account.
2. **Build Command**: `npm install && npx prisma generate && npm run build`
3. **Start Command**: `npm start`

> For detailed deployment instructions, refer to the internal documentation.

## License

Copyright &copy; 2026 PT. USSI ItQan Tekno Solusi. All rights reserved.
Please contact the administrator for license details.
