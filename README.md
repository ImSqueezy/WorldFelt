# 🌍 WorldFelt

A calm, emotional, map-first experience. WorldFelt visualizes how people around the world are feeling in real-time, creating a sense of quiet human connection across the globe.

![WorldFelt](https://img.shields.io/badge/WorldFelt-Earth%20at%20Night-0a0a0a?style=for-the-badge)

## ✨ Features

- **Dotted World Map** — A subtle, elegant map background rendered with dots
- **Emotion Visualization** — Colorful dots representing different emotions appear across the globe
- **Typing Animation** — Messages appear with a realistic typing effect
- **Speech Bubbles** — Chat-style bubbles with tails pointing to each location
- **Breathing Animations** — Soft, pulsing glows that feel alive
- **Responsive Design** — Optimized for both desktop and mobile

## 🎨 Emotion Color System

| Emotion | Color |
|---------|-------|
| 😌 Calm | Bright Cyan Teal |
| 😊 Happy | Bright Orange |
| 😢 Sad | Bright Blue |
| 😴 Tired | Soft Sky Blue |
| 😰 Anxious | Bright Rose Pink |
| 😠 Angry | Bright Red |

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Globe**: [MapLibre GL](https://maplibre.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Language**: TypeScript
- **React**: 19

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/worldfelt.git
cd worldfelt
```

2. Install dependencies:
```bash
npm install
```

3. Set up your database:

Create a `.env` file in the root directory:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/worldfelt?schema=public"
```

4. Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

### Database Setup

The app uses PostgreSQL with Prisma. The schema includes:

- **Feeling model**: Stores user feelings with latitude, longitude, feeling type, optional comment, and timestamp
- Automatically indexes by creation date for performance
- Limits queries to last 100 feelings

### API Endpoints

- `GET /api/feelings` - Fetch all feelings (last 100)
- `POST /api/feelings` - Create a new feeling
  ```json
  {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "feeling": "hopeful",
    "comment": "the fog cleared today"
  }
  ```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
WorldFelt/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   └── ui/
│       └── worldfelt-background.tsx  # Main background component
├── lib/
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## 🎭 How It Works

1. **Initial Load**: Dots with emotion messages appear one by one across the globe
2. **Continuous Updates**: Every 3 seconds, new emotion dots appear in different locations
3. **Cycling Emotions**: All 6 emotions cycle through, each with unique messages
4. **Max Display**: Up to 5 extra dots display at once (3 on mobile), oldest ones fade as new ones appear

## 🌟 Design Philosophy

WorldFelt is designed to feel like **Earth at night** — quiet, alive, and human. The background:

- Never distracts from content
- Uses soft, breathing animations
- Creates a sense of global human connection
- Maintains ~15-20% opacity to stay subtle

## 📱 Responsive Behavior

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Initial dots | 10 | 5 |
| Extra dots (max) | 5 | 3 |
| Element scale | 1x | 1.5x |

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

<p align="center">
  <em>Quiet lights scattered across the Earth at night, suggesting human presence without demanding attention.</em>
</p>
