# BlogSpace 🖋

A premium, text-first, minimalist publishing platform built on Next.js 16 and React 19. Designed with a strict monochrome aesthetic focused entirely on typography, performance, and seamless user experience.

![BlogSpace Demo Image](https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200)

---

## 🌟 Key Features

- **Built-in Markdown Engine:** A completely custom, zero-dependency Markdown parser and rendering engine (`utils/markdown.tsx`) supporting code blocks, tips, nested lists, and inline styles (bold, italics, links).
- **Intelligent Block Renderer:** Dynamically structured component mapping mapping content to specialized blocks preserving the minimalist aesthetic.
- **Dynamic Editor:** Functional text editor overlay with selection-preservation format hooks (`insertFormatting`) allowing writers to quickly craft beautifully formatted blogs.
- **Monochrome Design System:** Clean, strict black-and-white visual identity powered by raw Tailwind utilities, maximizing reader focus.
- **App Router Architecture:** Modern Next.js App Router implementation leveraging `<Suspense>` caching rules and granular layouts.
- **Enterprise-Ready Infrastructure:** Ships with multistage `Dockerfile`, optimized `standalone` Next configuration, and automated GitHub Actions CI/CD pipelines out-of-the-box.

---

## 🏗 Architecture & Tech Stack

- **Framework**: [Next.js (v16+)](https://nextjs.org/) App Router
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: Built-in React Hooks & Context API (`AuthContext`)
- **Data Persistence**: Local Storage (Designed purely for rapid UI/UX prototyping. Ready to be immediately swapped to an API client fetching databases like PostgreSQL/MongoDB).
- **Containerization**: `Node:22-alpine` Multi-stage Docker payload (`.next/standalone`).

---

## 🚀 Setup & Installation

### Local Development Setup

To run this project natively on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adhi1755/Blog.git
   cd Blog
   ```

2. **Ensure you have Node.js 20+ installed.**

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up Environment Variables:**
   Copy the example environment setting:
   ```bash
   cp .env.example .env.local
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *Navigate to `http://localhost:3000` to view the live dashboard.*

### Production Docker Deployment

This application includes highly optimized `standalone` tracing configurations yielding tight, lightweight Linux containers.

1. **Build the container image:**
   ```bash
   docker build -t blogspace-app .
   ```

2. **Run the container in detached mode:**
   ```bash
   docker run -d -p 3000:3000 --env-file .env.example blogspace-app
   ```
   *The application will now be running at port `3000` natively off the container server.*

---

## 🧪 CI/CD Pipeline

This application uses [GitHub Actions](https://github.com/features/actions) for Continuous Integration.
On every `push` and `pull_request` to the `main` or `dev` branches, the pipeline will securely:
1. Spin up an internal isolated Ubuntu runner.
2. Setup caching for `Node` v22 deployments.
3. Automatically run ESLint static checks (`npm run lint`).
4. Compiles the Next.js production build (`npm run build`).

Any failures will block deployment, ensuring robust codebase integrity.

---

## 📜 Roadmap

- [x] Establish Monochrome Theme Structure
- [x] Build Per-Page Independent App Headers
- [x] Custom Parsed Markdown Engine Implementations
- [x] Configure Production Docker & GitHub CI
- [ ] Implement backend Database Client API (Supabase or Prisma)
- [ ] Add real-time interactive user comments via Socket/Websocket

---
*Created by [Adithyan] as a prototype for advanced web systems styling & architecture.*
