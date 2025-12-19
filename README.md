<div align="center">
  <img width="1200" height="475" alt="Gimmi Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # Gimmi
  
  **Gimmi: The wishlist app that makes perfect gifting a Gimmi.**
  
  Create wishlists, share with friends, and coordinate gifts with ease.
</div>

---

## 📖 Overview

**Gimmi** eliminates the stress of gift-giving by allowing users to create detailed wishlists and share them with friends ("Peeps"). Helping you find the perfect gift every time. Because gifting should be a Gimmi. Friends can view each other's lists and "claim" items to prevent duplicate gifts, ensuring every present is a perfect surprise.

Built with a Modern React stack and Supabase, it features real-time interactions, a beautiful glassmorphism UI, and fun social elements like confetti celebrations when claiming gifts.

## ✨ Features

- **📝 Smart Wishlists**: Add items with images, links, price ranges, and priority levels.
- **👀 Social Discovery**: Connect with "Peeps" to view their profiles and wishlists.
- **🎁 Gift Claiming System**: Mark items as "Claimed" on friends' lists (visible to everyone except the recipient!) to coordinate who buys what.
- **👤 Detailed Profiles**: Share your clothing sizes, interests, disadvantages (dislikes), and birthday.
- **🎉 Interactive UI**: Enjoy a polished experience with glassmorphism design, smooth transitions, and confetti effects.
- **🔐 Secure Authentication**: Easy sign-in with Google via Supabase Auth.

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
    Run the `schema.sql` file in your Supabase SQL Editor to create the necessary tables (`profiles`, `wishlist_items`), policies, and triggers.

5.  **Run the App**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🗄️ Database Schema

The application uses two main tables:
- **`profiles`**: extends Supabase Auth with user details (sizes, interests, etc.).
- **`wishlist_items`**: stores gift items with ownership and claim status.

Row Level Security (RLS) policies are configured to ensure users can only edit their own data while allowing friends to view profiles and claim items.
