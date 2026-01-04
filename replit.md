# The Operator Standard

A discipline and accountability lifestyle mobile app built with Expo React Native.

## Overview

The Operator Standard is a command center for people taking control of their lives. It combines the intensity of a military ops dashboard with the polish of Strava and the community of Discord.

**Philosophy**: "The Operator Sets The Standard. The AI Enforces It."

## Core Features

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

## Recent Changes

- Initial MVP implementation with all core screens
- Power List with task completion and celebration
- Social feed with likes and saves
- Crew chat interface
- Stats dashboard with charts
- Core values presentation
