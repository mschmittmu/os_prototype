# The Operator Standard - Design Guidelines

## Brand & Philosophy
**Core Identity**: "The Operator Sets The Standard. The AI Enforces It."
- Military ops dashboard intensity meets Strava polish meets Discord community
- Warrior mentality with supportive brotherhood
- Patriotic buffalo symbol with 5 stars - represents American strength, resilience, charging into storms
- Values: Discipline Over Emotion, Extreme Accountability, Physical Excellence, Zero Regression

## Color System
- **Primary Background**: Clean white (#FFFFFF) - crisp, professional
- **Surface Background**: Light gray (#F9FAFB) for cards
- **Accent**: Bold patriotic red (#E31837) - wins, achievements, critical actions
- **Navy Blue**: (#1E3A8A) - secondary accents, icons
- **Text**: Dark charcoal (#1A1A1A) primary, medium gray (#6B7280) secondary
- **Borders**: Light gray (#E5E7EB)
- **Success**: Emerald green (#10B981)
- **Warning**: Amber (#F59E0B)

## Typography
- **Headlines**: Bold, condensed, UPPERCASE - military stencil/industrial sans-serif feel
- **Body**: Clean, readable sans-serif
- **Numbers/Stats**: Monospace or tabular figures for tactical aesthetic

## Visual Style
- Light mode primary with white background
- Cards have subtle gray borders (#E5E7EB)
- Red accent for active states and CTAs
- Minimal shadows, clean lines
- Progress rings and arc visualizations with red fill
- Micro-animations on task completion (pulse, confetti burst)

## Logo Usage
- Patriotic buffalo with 5 stars displayed in header (top left)
- Logo shown without text title - icon only
- Used as app icon and splash screen

## Architecture

### Authentication
- SSO required (Apple Sign-In for iOS, Google for cross-platform)
- Profile with tier badge, stats, avatar
- Account management in settings

### Navigation
**Bottom Tab Bar** (5 tabs):
- Home | Execution | Media | Social | Crews
- Active state: Red icon with label
- Inactive: Gray icon
- Always visible across main sections

### Screen Specifications

**1. Home Dashboard**
- White header with buffalo logo (left) and action icons (right)
- Scrollable content with safe area insets
- Today's Tasks card with completion status
- Current Challenges section
- XP Progress with stats cards
- Continue Watching carousel

**2. Execute (Power List)**
- Task list with checkbox cards
- Progress indicator at top
- Full-screen celebration overlay when all tasks complete

**3. Media Library**
- Scrollable grid/list
- Featured hero at top
- Categories: Operator Standard | MFCEO Project | Shorts
- Continue watching section

**4. Social Feed**
- Tab bar within screen: General | Founders | Saved
- Pull-to-refresh
- Scrollable post cards
- FAB: Red compose button

**5. Crew Screen**
- Chat feed with system cards and user messages
- Message input at bottom
- Leaderboard section

**6. Stats/Insights**
- Period selector at top
- Scrollable stats cards with charts
- AI insights section

**7. Core Values**
- Full-screen swipeable cards
- Buffalo icon with each value
- Final manifesto card

**8. Profile/Settings**
- Header: Avatar, name, tier, member since
- Scrollable sections
- Subscription status visible

## Components & Interactions

**Task Completion Flow**:
1. Tap checkbox - fills with red checkmark
2. Task text strikes through
3. XP floats up
4. Final task - "YOU'VE WON THE DAY" celebration

**Progress Elements**:
- Red progress bars and rings
- Light gray track backgrounds
- Completion percentages displayed

**Interactive Feedback**:
- All touchable elements have press states
- Cards with subtle borders
- Pull-to-refresh on feeds

## Mobile-First Requirements
- Safe area insets respected across all screens
- Thumb-friendly tap targets (minimum 44pt)
- Optimized for iOS/Android
- Gesture-friendly (swipe, pull-to-refresh)
