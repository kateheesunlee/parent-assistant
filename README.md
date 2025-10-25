# Parent Assistant

A modern web application built with Next.js, Material-UI (MUI), and Supabase.

## Features

- ⚡ **Next.js 16** with App Router and TypeScript
- 🎨 **Material-UI** for beautiful, responsive components
- 🗄️ **Supabase** for backend services (database, auth, real-time)
- 📱 **Responsive Design** that works on all devices
- 🔧 **TypeScript** for type safety and better development experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- A Supabase account (free at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd parent-assistant
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Add these to your `.env.local` file
4. Optionally, add the service role key for server-side operations

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
│   ├── supabase.ts     # Supabase client configuration
│   ├── theme.ts        # MUI theme configuration
│   └── config.ts       # Environment configuration
└── types/              # TypeScript type definitions
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Material-UI** - React component library
- **Supabase** - Backend-as-a-Service
- **Tailwind CSS** - Utility-first CSS framework

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
