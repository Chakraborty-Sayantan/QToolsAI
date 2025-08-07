# QTools AI

QTools AI is a modern web application built with Next.js, React, and TypeScript, offering a suite of AI-powered tools and utilities. The project features a clean, responsive design using Tailwind CSS and includes various AI integrations.

## 🚀 Features

- Modern, responsive UI built with Next.js and Tailwind CSS
- AI-powered tools and utilities
- Dashboard interface
- Game integrations
- Dark/Light theme support
- Type-safe development with TypeScript

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Animation:** Framer Motion
- **AI Integration:** 
  - OpenAI SDK
  - Hugging Face Inference
- **Date Handling:** date-fns
- **Icons:** Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd qtools-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
# Add your environment variables here
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
qtools-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── ai-tools/          # AI tools pages
│   ├── dashboard/         # Dashboard pages
│   ├── games/            # Game-related pages
│   └── utilities/        # Utility pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── public/               # Static assets
└── styles/               # Global styles
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

The project uses several configuration files:
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and maintainers

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
