# Supabase Setup Guide

## Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in/create an account
2. Create a new project or select your existing project
3. Go to **Settings** → **API** in your project dashboard
4. Copy these two values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 2: Update Your Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

## Step 3: Restart Your Development Server

After updating the environment variables:
1. Stop your development server (Ctrl+C)
2. Start it again with `npm run dev` or `yarn dev`

## Step 4: Test the Connection

The app includes a connection test component that will verify your Supabase setup is working correctly.

## Next Steps: Database Setup

Once connected, you'll need to set up your database tables. The app expects these tables:
- `users` - for user authentication
- `brands` - for brand management
- `tells` - for user submissions
- `resolutions` - for resolution tracking

Would you like help setting up the database schema?