# 🎯 Score Board

A modern, real-time score tracking application built with Next.js 15 and Supabase, featuring a beautiful UI powered by Radix UI components and Tailwind CSS.

![Score Board Screenshot](/public/scoreboard.jpg)

## ✨ Features

- 🔐 Secure authentication system
- 👥 User management with role-based access control
- 📊 Real-time score tracking and updates
- 🎨 Modern and responsive UI
- 🌓 Dark/Light theme support
- 🔒 Protected admin routes
- 📱 Mobile-friendly design

## 🔑 Testing Credentials

You can test the application using these credentials:
- **Email:** admin@gmail.com
- **Password:** password
- **Demo Link:** [Score Board App](https://score-board-one-alpha.vercel.app/login)

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Styling:** 
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Radix UI](https://www.radix-ui.com/) components
- **Form Handling:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Theme:** next-themes

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/score-board.git
   cd score-board
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

```
score_board/
├── app/                # Next.js 15 app directory
├── components/         # Reusable UI components
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and configurations
├── public/           # Static assets
├── styles/           # Global styles
├── supabase/         # Supabase related configurations
└── types/            # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
