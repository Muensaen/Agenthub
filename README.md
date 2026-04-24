# 🤖 AI Agent Hub

A Next.js web application for managing and monitoring AI Agents. Supports creating agents and tracking their real-time processing status.

## Features

- **สร้าง Agent** – Create a new AI Agent with a name, type, and description. A "กำลังสร้าง..." (Creating…) spinner shows while the agent is being initialised.
- **กำลังประมวลผล** – Agents transition through statuses: **รอดำเนินการ** → **กำลังประมวลผล** → **เสร็จสิ้น** (or **ล้มเหลว**), with a live progress bar and animated badge.
- **Dashboard stats** – At-a-glance counts for each status category.
- **Persistent storage** – Agent list is saved to `localStorage` so it survives page refreshes.

## Tech stack

- [Next.js 16 (App Router)](https://nextjs.org) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
