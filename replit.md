# The Operator Standard

A discipline and accountability lifestyle mobile app built with Expo React Native.

## Overview

The Operator Standard is a command center for people taking control of their lives. It combines the intensity of a military ops dashboard with the polish of Strava and the community of Discord.

**Philosophy**: "The Operator Sets The Standard. The AI Enforces It."

## Core Features

### Operator HUD Dashboard (Home Screen)
- **Life Score Ring**: Large animated circular display showing overall life score (0-100)
- **Vital Stats Row**: Streak, Win Rate, and Total Days at a glance
- **Arcane Assessment**: AI-powered truth statement highlighting the user's biggest issue
- **Operator Attributes**: 8 life attributes with progress bars (Discipline, Physical, Work Execution, Consistency, Mental Control, Financial, Recovery, Relationships)
- **Today's Tasks Summary**: Simplified Power List view with completion status

### Power List (Daily Tasks)
- 5 daily tasks that must be completed to "win the day"
- Task completion with satisfying animations
- Streak tracking and XP rewards
- "Day Won" celebration when all tasks complete

### Media Library
- Episode content organized by category
- Continue watching functionality
- Video player with progress tracking

### Social Feed
- Community posts with likes, comments, and saves
- Filter by General, Founders, or Saved posts
- Post composer with media attachments

### Crew System
- Team chat with real-time messaging
- Achievement announcements
- Crew leaderboards

### Stats & Insights
- Days won vs lost tracking
- Completion rate visualization
- Category breakdown
- AI-powered insights

### Core Values
- Swipeable cards presenting the 10 core values
- Dramatic manifesto presentation

## Project Structure

```
client/
  App.tsx                 # Main app entry with navigation
  components/             # Reusable UI components
    Card.tsx              # Animated card component
    TaskCard.tsx          # Task item with checkbox
    ProgressRing.tsx      # Circular progress indicator
    StreakBadge.tsx       # Streak display badge
    EpisodeCard.tsx       # Media episode card
    PostCard.tsx          # Social feed post
    FAB.tsx               # Floating action button
    DayWonCelebration.tsx # Victory celebration overlay
    LifeScoreRing.tsx     # Animated life score circular display
    VitalStatsRow.tsx     # Streak, win rate, total days stats
    ArcaneDirective.tsx   # AI assessment component
    OperatorAttributes.tsx # 8 life attributes with progress bars
    TodaysTasksSummary.tsx # Simplified task list for HUD
  constants/
    theme.ts              # Colors, spacing, typography
  hooks/                  # Custom React hooks
  lib/
    storage.ts            # AsyncStorage persistence
    mockData.ts           # Sample data for MVP
  navigation/             # React Navigation setup
  screens/                # All app screens
server/
  index.ts                # Express server
  routes.ts               # API routes
```

## Design System

- **Primary Background**: Deep black (#0A0A0A)
- **Accent**: Bold crimson red (#DC2626)
- **Surfaces**: Steel gray (#1F2937)
- **Success**: Emerald green (#10B981)
- **Warning**: Amber (#F59E0B)

## Running the App

The app runs on:
- **Web**: Port 8081 (Expo)
- **Mobile**: Scan QR code with Expo Go

### Operator Mode
- One-tap activation from shield icon in header (top-left)
- Uses default 60-minute STANDARD protocol on quick start
- Full setup/customization available in Settings
- Timer screen with exit confirmation and consequences
- Mission complete celebration

## Recent Changes

- **NEW: Operator HUD Dashboard** - Replaced home screen with Life Score system
  - Life Score ring with animated progress and trend indicator
  - Vital Stats row (streak, win rate, total days)
  - Arcane Assessment - AI-powered truth statement
  - Operator Attributes - 8 life metrics with color-coded progress bars
  - Today's Tasks summary with quick access to full list
- Added Operator Mode with one-tap activation from header icon
- Operator Mode setup moved to Settings screen
- Shield icon in top-left header for instant activation
- Initial MVP implementation with all core screens
- Power List with task completion and celebration
- Social feed with likes and saves
- Crew chat interface
- Stats dashboard with charts
- Core values presentation
