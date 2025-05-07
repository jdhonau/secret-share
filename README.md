# Secret-share
An ephemeral secret sharing application

## About the project
This is a modern full stack application using the Next.js framework, which allows for both frontend and backend functionality in a single codebase. The application follows the App Router pattern introduced in Next.js 13+, which provides features like server components, API routes, and client-side interactivity all in one unified structure.

### Frontend:
- Uses React 19 as the frontend framework
- Implements TailwindCSS for styling
- Uses TypeScript for type safety
- Has React Hook Form for form handling
- Contains frontend components in src/app/components

### Backend/API:
- Uses Next.js API routes (indicated by the src/app/api directory)
- This means it has serverless backend functionality built into the Next.js framework
- Can handle server-side operations through Next.js API routes

### Additional Features:
- Has crypto-js integration for cryptographic operations
- Uses Zod for schema validation
- Implements form handling with @hookform/resolvers


The presence of both client-side components and API routes completes this full stack application, where both the frontend and backend are integrated into a single Next.js project.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
