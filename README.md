<div align="center">
  
  # Gimmi
  
  **Gimmi: The wishlist app that makes perfect gifting a Gimmi.**
  
  Create wishlists, share with friends, and coordinate gifts with ease.
  Now featuring **Guest Mode**—start building your list instantly!
</div>

---

## 📖 Overview

**Gimmi** eliminates the stress of gift-giving by allowing users to create detailed wishlists and share them with friends ("Peeps"). Helping you find the perfect gift every time. Because gifting should be a Gimmi. Friends can view each other's lists and "claim" items to prevent duplicate gifts, ensuring every present is a perfect surprise.

Built with a Modern React stack and Supabase, it features real-time interactions, a beautiful glassmorphism UI, a new customised Landing Page, and fun social elements like confetti celebrations when claiming gifts.

## ✨ Features

- **🚀 Guest Mode**: Start building your wishlist immediately without signing up.
- **📝 Smart Wishlists**: Add items with images, links, price ranges, and priority levels.
- **🔐 Email Authentication**: Simple Sign Up & Sign In to save your data across devices.
- **👀 Social Discovery**: Connect with "Peeps" to view their profiles and wishlists.
- **🎁 Gift Claiming System**: Mark items as "Claimed" on friends' lists (visible to everyone except the recipient!) to coordinate who buys what.
- **👤 Detailed Profiles**: Share your clothing sizes, interests, disadvantages (dislikes), and birthday.
- **🎉 Interactive UI**: Enjoy a polished experience with glassmorphism design, smooth transitions, and confetti effects.

## 🛠️ Tech Stack

- **Frontend**: React 19, Swift-like sleek UI with **Tailwind CSS**.
- **Build Tool**: Vite.
- **Backend**: Supabase (PostgreSQL, Auth, Realtime).
- **Icons**: Lucide React.
- **Effects**: Canvas Confetti.

## 🚀 Getting Started

Follow these steps to get the application running locally.

### Prerequisites

- Node.js (v18+ recommended)
- A Supabase account

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd the-perfect-gift-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**
    Execute the following SQL scripts in your Supabase SQL Editor in order:
    1.  `schema.sql` (Creates base tables: `profiles`, `wishlist_items`)
    2.  `migration_friends_function.sql` (Creates `friendships` table and helper functions)

5.  **Run the App**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🗄️ Database Schema

The application uses three main tables:
- **`profiles`**: User details (sizes, interests, etc.) linked to Supabase Auth.
- **`wishlist_items`**: Gift items with ownership and claim status.
- **`friendships`**: Manages friend connections.

Row Level Security (RLS) policies are configured to ensure secure data access.
