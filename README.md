# Dikta - Eisenhower Matrix Task Manager

Personal task management app based on the Eisenhower Matrix with AI-powered classification and Google Calendar integration.

## Features

- **AI Classification** - Tasks are automatically classified into Eisenhower quadrants using Llama 3.3 70B via Groq
- **Google Calendar** - Send any task to Google Calendar as an event with one click
- **Responsive** - Desktop 2x2 grid layout + mobile accordion
- **Dark UI** - Futuristic dark theme with neon color-coded quadrants

### Quadrants

| Quadrant | Color | Criteria |
|----------|-------|----------|
| DO | Green | Urgent + Important |
| PLAN | Blue | Important, not urgent |
| DELEGATE | Amber | Urgent, not important |
| ELIMINATE | Gray | Neither urgent nor important |

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript + React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL 16 + Prisma 6
- **AI**: Groq SDK + Llama 3.3 70B
- **Calendar**: Google Calendar API (googleapis)
- **Deployment**: Docker + Docker Compose

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker)
- [Groq API key](https://console.groq.com)
- Google Cloud project with Calendar API enabled (optional)

### Local Development

```bash
# Clone
git clone https://github.com/alvisdevops/dikta.git
cd dikta

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start database
docker compose up db -d

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

App runs at `http://localhost:3007`

### Docker (Full Stack)

```bash
# Configure environment
cp .env.example .env
# Edit .env with your values

# Start everything
docker compose up -d db
docker compose --profile tools run --rm migrator npx prisma migrate deploy
docker compose up -d app
```

## Environment Variables

```bash
# App
NODE_ENV=development
APP_PORT=3007
PROJECT_NAME=dikta

# Database
POSTGRES_PORT=5436
POSTGRES_USER=eisenhower
POSTGRES_PASSWORD=eisenhower123
POSTGRES_DB=eisenhower
DATABASE_URL=postgresql://eisenhower:eisenhower123@localhost:5436/eisenhower?schema=public

# AI Classification (required)
GROQ_API_KEY=your-groq-api-key

# Google Calendar (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3007/api/auth/google/callback
```

## Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a project or select an existing one
3. Enable the **Google Calendar API** in the API Library
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URI: `http://localhost:3007/api/auth/google/callback`
7. Copy the Client ID and Client Secret to your `.env`
8. In the app, click the **Calendar** button in the header to connect

### How it works

- Tasks **with a deadline** are created as all-day events on the deadline date
- Tasks **without a deadline** open a time picker to choose date and time
- Events are color-coded by quadrant (Tomato, Blueberry, Banana, Graphite)
- Event description includes the task description, quadrant, and AI reasoning
- Tasks already sent to Calendar show a check icon

## Project Structure

```
dikta/
├── app/
│   ├── api/
│   │   ├── tasks/            # CRUD endpoints
│   │   └── auth/google/      # OAuth2 flow
│   ├── components/
│   │   ├── matrix/           # Eisenhower grid, quadrants, task cards
│   │   ├── task-form.tsx     # Create/edit modal
│   │   └── calendar-time-picker.tsx
│   └── page.tsx              # Main app
├── modules/
│   ├── tasks/                # Service + Repository + Schemas
│   └── google-calendar/      # OAuth + Calendar service
├── hooks/
│   └── use-tasks.ts          # State management hook
├── lib/
│   ├── classify.ts           # Groq/Llama integration
│   ├── google-auth.ts        # OAuth2 client
│   ├── prisma.ts             # DB client
│   └── api-response.ts       # Response helpers
└── prisma/
    └── schema.prisma         # Database schema
```

**Architecture**: API Route → Service → Repository → Prisma → PostgreSQL

## Commands

```bash
npm run dev              # Dev server (Turbopack)
npm run build            # Production build
npm run start            # Start production
npm run lint             # Lint
npm run lint:fix         # Lint + fix
npm run format           # Format with Prettier
npm run db:migrate       # Create/apply migrations
npm run db:studio        # Database UI
npm run db:generate      # Generate Prisma client
npm run db:reset         # Reset database
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (filter: `completed`, `quadrant`) |
| POST | `/api/tasks` | Create task (AI classifies automatically) |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/calendar` | Send task to Google Calendar |
| GET | `/api/auth/google` | Start Google OAuth |
| GET | `/api/auth/google/callback` | OAuth callback |
| GET | `/api/auth/google/status` | Check connection status |
| POST | `/api/auth/google/disconnect` | Disconnect Google |
| GET | `/api/health` | Health check |

## License

MIT

---

Built by [ALVIS Solutions](https://github.com/alvisdevops)
