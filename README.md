# 🍽 Food Recipes — React + Supabase

A full-stack food recipe web app rebuilt from PHP/MySQL to **React + Supabase**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router v6 |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (recipe images) |
| Build Tool | Vite |

---

## 🚀 Setup Guide

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** and fill in the details
3. Wait for your project to be ready (~1 min)

---

### 2. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase-schema.sql` from this project
3. Paste it into the SQL Editor and click **Run**

This creates:
- `profiles` table (with role: user/admin)
- `recipes` table (with all fields including delivery links)
- `favourites` table
- Row Level Security (RLS) policies
- Storage bucket for recipe images
- Auto-trigger to create a profile on signup

---

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in your credentials from **Supabase Dashboard → Project Settings → API**:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 4. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

### 5. Create Your Admin Account

1. Go to the app and **Register** with your admin email
2. In Supabase **SQL Editor**, run:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'your-admin@email.com'
);
```

3. Log in — you'll be redirected to the **Admin Panel** automatically

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── RecipeCard.jsx      # Recipe card (user + admin views)
│   ├── Particles.jsx       # Floating food emoji animation
│   └── Toast.jsx           # Success/error notifications
├── context/
│   └── AuthContext.jsx     # Auth state + Supabase auth helpers
├── lib/
│   └── supabase.js         # Supabase client
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── UserHome.jsx        # Search page for users
│   ├── RecipeView.jsx      # Full recipe + favourites + order links
│   ├── Favourites.jsx      # User's saved recipes
│   ├── AdminHome.jsx       # Admin recipe management dashboard
│   ├── AddRecipe.jsx       # Admin: add new recipe
│   ├── EditRecipe.jsx      # Admin: edit existing recipe
│   ├── About.jsx
│   └── Contact.jsx
├── App.jsx                 # Route definitions + auth guards
├── main.jsx
└── index.css               # Global design system
```

---

## ✨ Features

### Users
- Register / Login (Supabase Auth)
- Search recipes by name (with biryani/biriyani alternate spelling)
- View full recipe: ingredients, procedure
- ❤️ Add/remove favourites
- 🍽 Order to Eat: Zomato & Swiggy links
- 🛒 Order to Cook: Blinkit, Zepto & Instamart links

### Admins
- Separate admin dashboard
- Add recipes with image upload (Supabase Storage)
- Edit any recipe
- Delete recipes (also removes image from storage)
- Role is set via SQL — secure, not self-assignable

---

## 🔒 Security

- Row Level Security (RLS) on all tables
- Admin actions are enforced at the **database level**, not just the UI
- Passwords handled by Supabase Auth (bcrypt, not plaintext)
- No SQL injection possible (Supabase client uses parameterized queries)

---

## 🏗 Build for Production

```bash
npm run build
```

Deploy the `dist/` folder to **Vercel**, **Netlify**, or any static host.

> Remember to add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in your hosting dashboard.
