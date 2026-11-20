
# DevFlow 🚀

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-282A36?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

## 📌 Quick Links
- [GitHub Issues](https://github.com/adelsolorenzohmi-cloud/devflow/issues)
- [Pull Requests](https://github.com/adelsolorenzohmi-cloud/devflow/pulls)

---

## 🛠️ Tech Stack & Architecture
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend API:** Next.js Route Handlers (`app/api/tasks`, `app/api/auth`)
- **Database:** PostgreSQL managed via Prisma ORM (`prisma/schema.prisma`)


## 👥 Team
- Adelso (Group Leader this week)
- Masango Dewheretsoko

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or newer
- PostgreSQL installed and running locally (pgAdmin 4 is optional)

### Setup
1. Clone the repo and enter the folder:
   ```bash
   git clone https://github.com/adelsolorenzohmi-cloud/devflow.git
   cd devflow
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root by copying `.env.example`, then put your own PostgreSQL password in `DATABASE_URL`. If your password has special characters (like `$`, `@`, `#`), URL-encode them (for example `$` becomes `%24`).
4. Create the database tables:
   ```bash
   npx prisma db push
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000 (the board is at http://localhost:3000/dashboard/board).

> Never commit your `.env` file.