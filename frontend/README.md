# Transmarket Frontend

## Getting Started

### 1. Clone the repository

```bash
git clone https://gitlab.com/transmarket-app/transmarket-front.git
cd transmarket-front
```

### 2. Install pnpm (recommended)

We recommend using [pnpm](https://pnpm.io/) for fast and efficient dependency management.

If you don't have `pnpm` installed globally, run:

```bash
npm install -g pnpm
```

You can also use `npm`, `yarn`, or `bun`, but `pnpm` is preferred for this project.

### 3. Install dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
# or
bun install
```

### 4. Setup environment variables

Copy the example environment file to create your own `.env` file:

```bash
cp .env.example .env
```

Edit the `.env` file and set the backend API URL:

```
API_URL=<your-backend-api-url>
```

Replace `<your-backend-api-url>` with the actual URL of your backend API.

### 5. Run the development server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
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
