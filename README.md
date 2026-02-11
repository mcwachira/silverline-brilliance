# Silverline Technologies Admin Dashboard

A comprehensive admin dashboard for Silverline Technologies, an audiovisual services company. Built with Next.js 14, Supabase, Sanity.io, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Authentication**: Secure login with Supabase Auth
- **Dashboard**: Overview with stats, quick actions, and activity timeline
- **Bookings Management**: Complete CRUD operations with status tracking
- **Blog Management**: Full CMS with rich text editor (Tiptap)
- **Media Library**: File upload and management
- **Email Templates**: Customizable email templates
- **Settings**: Comprehensive configuration options

### Technical Features
- **Responsive Design**: Mobile-first approach with tablet/desktop layouts
- **Real-time Updates**: Supabase subscriptions for live data
- **PDF Generation**: Generate booking confirmations and reports
- **Email Integration**: SMTP email sending with templates
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Beautiful purple and gold color scheme

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **CMS**: Sanity.io for blog content
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: Tiptap editor
- **Email**: Nodemailer
- **PDF**: jsPDF + jsPDF-autotable

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Sanity.io account
- SMTP credentials (for email)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Email (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 3. Database Setup

Run the SQL commands from `DATABASE_SCHEMA.md` in your Supabase SQL editor.

### 4. Sanity Setup

Initialize Sanity and create schemas as documented in the project structure.

### 5. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and navigate to `/admin`.

## 🔐 Demo Credentials

- **Email**: `admin@silverlinetech.com`
- **Password**: `admin123`

## 📁 Project Structure

```
silverline-admin/
├── app/
│   ├── (auth)/login/           # Login page
│   ├── admin/                  # Admin dashboard
│   │   ├── dashboard/          # Dashboard overview
│   │   ├── bookings/           # Booking management
│   │   ├── blog/              # Blog management
│   │   ├── media/             # Media library
│   │   └── settings/          # Settings page
│   ├── api/                   # API routes
│   └── layout.tsx             # Root layout
├── components/
│   ├── admin/                 # Admin-specific components
│   ├── bookings/              # Booking components
│   ├── blog/                  # Blog components
│   ├── ui/                    # Reusable UI components
│   └── ...
├── lib/
│   ├── supabase/              # Supabase client
│   ├── sanity/                # Sanity client
│   └── utils/                 # Utility functions
├── types/                     # TypeScript definitions
└── styles/                    # Global styles
```

## 🎨 Design System

### Color Scheme
- **Primary Purple**: `#8B1FA8`
- **Purple Dark**: `#4A0E6B` 
- **Accent Gold**: `#FFD700`
- **Gold Hover**: `#FFC107`
- **Success**: `#28A745`
- **Warning**: `#FFC107`
- **Danger**: `#DC3545`

## 📱 Responsive Design

- **Mobile (< 768px)**: Stacked layouts, hamburger menu
- **Tablet (768px - 1024px)**: 2-column layouts, collapsible sidebar
- **Desktop (> 1024px)**: Full multi-column layouts

## 🚀 Deployment

Deploy to Vercel for best results. All environment variables must be configured in production.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
