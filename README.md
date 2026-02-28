# ⚡ TaskFlow Pro — Advanced Task Management System

![TaskFlow Pro](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=300&fit=crop&auto=format,compress)

A production-grade full-stack task management application with advanced circular timers, 20-theme system, particle effects engine, and token reward/penalty system. All state persists in [Cosmic](https://www.cosmicjs.com) as the single source of truth.

## Features

- ⏱️ **Advanced Circular Timer** — SVG with 5-color gradient ring, HH:MM:SS:MS, pulse animations, refresh-persistent
- 🎨 **20 Unique Themes** — Bright whites, deep darks, neon, pastel, minimal — stored in database
- 🪙 **Token System** — Automatic reward/penalty, manual add/remove, permanently persisted
- ✨ **Particle Engine** — High-density with mouse repulsion, click explosions, gravitational distortion, linking lines
- 📋 **7 Pages** — Home, Library, Temporary, Paused, Completed, Failed, Logs
- 📜 **Action Logging** — Every action logged in Pakistan Time 12-hour AM/PM format
- 🔄 **Real-time Sync** — Backend is single source of truth, refresh-safe

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68e3f730260d9dd939d1c12f&clone_repository=69a31fa82f592b85452c3824)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "ROLE & BEHAVIOR LOCK
>
> You are a software implementation engine, not a planner.
>
> You MUST:
>
> Implement exactly what is written.
>
> NOT redesign anything.
>
> NOT summarize requirements.
>
> NOT create your own architecture plan.
>
> NOT simplify features.
>
> NOT skip difficult systems.
>
> NOT replace systems with easier alternatives.
>
> You are strictly forbidden from generating a new proposal or rewritten plan.
>
> If requirements are understood → start implementation immediately.
>
> APPLICATION TYPE
>
> Create a fast production-grade full-stack web application using:
>
> Real backend server
>
> Real database
>
> Persistent storage
>
> Optimized APIs
>
> High performance UI
>
> 🚫 STRICTLY FORBIDDEN
>
> Authentication
>
> Login system
>
> User accounts
>
> Signup
>
> Permissions system
>
> Application must open directly to usable interface.
>
> DEFAULT APPLICATION BEHAVIOR
>
> Website always opens on Home Page
>
> Last selected theme must automatically load
>
> Timer must continue correctly after reload
>
> Refresh must NOT reset timers
>
> Backend remains single source of truth
>
> TOKEN SYSTEM
>
> System includes global tokens.
>
> Rules:
>
> Completing task → add reward tokens
>
> Failed task → subtract penalty tokens
>
> Tokens update automatically
>
> User can manually:
>
> Add tokens
>
> Remove tokens
>
> No default input values allowed.
>
> Token value must persist permanently.
>
> ADVANCED CIRCULAR TIMER
> Visual:
>
> Large centered circular timer
>
> Smooth SVG or Canvas rendering
>
> 5-color animated gradient ring
>
> Inside display:
>
> HH : MM : SS : MS
>
> Animation:
>
> Second change → zoom pulse
>
> Minute change → stronger pulse
>
> Hour change → strongest pulse
>
> Smooth scaling only
>
> Persistence:
>
> Timer state saved in backend
>
> Continues accurately after reload
>
> No restart on refresh
>
> 20 UNIQUE PERSISTENT THEMES
>
> Exactly 20 themes required.
>
> Include:
>
> Bright white themes
>
> Deep dark themes
>
> Neon styles
>
> Soft pastel
>
> Professional minimal
>
> Color-rich styles
>
> Mandatory Rules:
>
> Full UI adaptation
>
> Text always readable
>
> Particle colors adapt
>
> Smooth transition animation
>
> Stored in database
>
> Last theme auto loads
>
> ADVANCED PARTICLE ENGINE
>
> Must include:
>
> High-density micro particles
>
> Depth/parallax motion
>
> Continuous floating physics
>
> Mouse hover repulsion
>
> Click explosion effect
>
> Mouse hold gravitational distortion
>
> Dynamic linking lines
>
> Theme-adaptive colors
>
> Performance optimized rendering
>
> No basic particles allowed.
>
> PAGE STRUCTURE (ALL REQUIRED)
>
> Home
> Library
> Temporary
> Paused
> Completed
> Failed
> Logs
>
> LIBRARY PAGE — MASTER CONTROL
>
> Tasks displayed in vertical categorized tables:
>
> Running Tasks
>
> Pending Tasks
>
> Paused Tasks
>
> Completed Tasks
>
> Failed Tasks
>
> Each task includes:
>
> Start
> Pause
> Resume
> Reset
> Delete Permanently
>
> Library Reset Button Logic
>
> When pressed:
>
> ✅ Completed → move to Pending
> ✅ Failed → move to Pending
>
> ❌ Running tasks unchanged
> ❌ Paused tasks unchanged
> ❌ Pending tasks unchanged
>
> Moved tasks must show Start button again.
>
> TEMPORARY TASK PAGE
>
> Task creation allowed here and Library ONLY.
>
> No defaults allowed.
>
> Temporary task behavior:
>
> Visible while Running or Paused
>
> When Completed or Failed → automatically removed from Temporary page
>
> Still exists inside Library
>
> Temporary Page Reset Button
>
> Pressing reset:
>
> ✅ Deletes ALL tasks ONLY from Temporary page
>
> ❌ Must NOT delete from Library or other pages
>
> PAUSED PAGE
>
> Shows only paused tasks.
>
> Each task:
>
> Resume
>
> Reset
>
> Page reset affects ONLY paused tasks shown here.
>
> COMPLETED PAGE RESET
>
> Reset button:
>
> ✅ Removes tasks ONLY from Completed page view
> ❌ Must NOT delete from Library or Temporary
>
> FAILED PAGE RESET
>
> Reset button:
>
> ✅ Removes tasks ONLY from Failed page view
> ❌ Must NOT delete elsewhere
>
> LOGS PAGE
>
> Log EVERY action including:
>
> Start
> Pause
> Resume
> Reset
> Delete
> Completion
> Failure
> Theme change
> Token change
> Page resets
>
> Log Rules:
>
> Show ONLY latest 10 actions
>
> Older logs auto removed
>
> Persist in database
>
> Time format MUST be:
>
> ✅ Pakistan Time
> ✅ 12-hour format
> ✅ AM / PM
>
> Example: 07:45 PM
>
> STATE SYNCHRONIZATION
>
> All pages auto update
>
> Backend controls state
>
> No duplicated logic
>
> Refresh safe
>
> Real-time consistency required
>
> IMPLEMENTATION ENFORCEMENT
>
> You MUST:
>
> Implement ALL features
>
> Implement EXACT logic
>
> Maintain persistence
>
> Maintain UI behavior
>
> Maintain animations
>
> Maintain database syncing
>
> ❗ FINAL EXECUTION RULE
>
> Do NOT output explanations.
> Do NOT redesign system.
> Do NOT create a new plan.
>
> Begin implementation directly and continue until all systems above are fully functional."

### Code Generation Prompt

> "Based on the content model I created, now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- **Next.js 16** — App Router, Server Components, API Routes
- **React 19** — Client Components with hooks
- **TypeScript** — Strict typing throughout
- **Tailwind CSS 3** — Full theming system
- **Cosmic** — Backend CMS for tasks, settings, logs ([docs](https://www.cosmicjs.com/docs))
- **SVG** — Advanced circular timer rendering
- **Canvas** — High-performance particle engine

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A [Cosmic](https://www.cosmicjs.com) account with the content model set up

### Installation
```bash
bun create next-app taskflow-pro
cd taskflow-pro
bun add @cosmicjs/sdk@^1.6.0
```

### Environment Variables
Set these in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `COSMIC_WRITE_KEY`

## Cosmic SDK Examples

```typescript
import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Fetch all tasks
const { objects: tasks } = await cosmic.objects
  .find({ type: 'tasks' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Update task status
await cosmic.objects.updateOne(taskId, {
  metadata: { status_field: 'Running' }
})
```

## Cosmic CMS Integration

This app uses 3 Cosmic object types:
- **Tasks** — Full task lifecycle with timer persistence and page removal flags
- **App Settings** — Singleton for global tokens and active theme
- **Logs** — Action logging with Pakistan Time timestamps

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Push to GitHub
2. Import to Netlify
3. Set build command: `bun run build`
4. Add environment variables
5. Deploy
<!-- README_END -->