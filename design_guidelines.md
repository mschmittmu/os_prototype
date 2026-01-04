# The Operator Standard - Design Guidelines

## Brand & Philosophy
**Core Identity**: "The Operator Sets The Standard. The AI Enforces It."
- Military ops dashboard intensity meets Strava polish meets Discord community
- Warrior mentality with supportive brotherhood
- Buffalo symbol represents strength, resilience, charging into storms
- Values: Discipline Over Emotion, Extreme Accountability, Physical Excellence, Zero Regression

## Color System
- **Primary Background**: Deep black (#0A0A0A) - operators work in the dark
- **Accent**: Bold crimson red (#DC2626) - wins, achievements, critical actions
- **Surfaces**: Steel gray (#1F2937) for cards and elevated elements
- **Text**: Pure white (#FFFFFF) primary, muted gray (#9CA3AF) secondary
- **Success**: Emerald green (#10B981)
- **Warning**: Amber (#F59E0B)

## Typography
- **Headlines**: Bold, condensed, UPPERCASE - military stencil/industrial sans-serif feel
- **Body**: Clean, readable sans-serif
- **Numbers/Stats**: Monospace or tabular figures for tactical aesthetic

## Visual Style
- Dark mode primary (light mode optional)
- Subtle black-to-dark-gray gradients on cards
- Red accent glows and highlights
- Sharp corners default, slightly rounded on interactive cards
- Subtle texture/noise overlay for depth
- Progress rings and arc visualizations
- Micro-animations on task completion (pulse, confetti burst)

## Architecture

### Authentication
- SSO required (Apple Sign-In for iOS, Google for cross-platform)
- Profile with tier badge, stats, avatar
- Account management in settings

### Navigation
**Bottom Tab Bar** (5 tabs):
- Home | Execute | Media | Social | Crew
- Active state: Red icon with label
- Inactive: Gray icon
- Always visible across main sections

### Screen Specifications

**1. Home Dashboard**
- Transparent header
- Scrollable content with safe area insets
- Components: Greeting + streak, Power List hero card (progress ring), Challenge card, XP stats row, quick actions, Continue Watching carousel
- FAB not needed (actions in main UI)

**2. Execute (Power List)**
- Header: Week calendar strip (completion dots), stats button top-right
- Scrollable task list with checkbox cards
- Progress indicator at top
- FAB: Red add task button (bottom-right, floating with shadow)
- Full-screen celebration overlay when 5/5 complete
- Swipe-left gesture for edit/delete

**3. Task Creation/Edit**
- Native modal (full-screen)
- Large text input, category selector, optional fields (goal link, reminder, recurring)
- Save button at bottom
- Cancel in header left

**4. Media Player**
- Stack navigation (pushed from library)
- Video player at top
- Controls below: play/pause, skip buttons, progress scrubber, speed, cast, download
- Episode list below
- Background audio indicator

**5. Media Library**
- Scrollable grid/list
- Featured hero at top
- Categories: Operator Standard | MFCEO Project | Shorts
- Continue watching section

**6. Social Feed**
- Tab bar within screen: General | Founders | Saved
- Pull-to-refresh
- Scrollable post cards (avatar, name, timestamp, tier badge, content, engagement)
- FAB: Red compose button

**7. Post Composer**
- Native modal
- Text area, attachment buttons, character count
- Post button disabled until content exists

**8. Crew Screen**
- Tab bar: Chat | Details | Other Crews
- Chat feed with system cards and user messages
- Message input at bottom
- Leaderboard in Details tab

**9. Challenges**
- Scrollable grid of challenge cards
- Active section at top
- Challenge detail: stack navigation push

**10. Arcane AI Coach**
- Chat interface
- Dark bubbles for AI, red accent for user
- Quick action buttons at bottom
- AI avatar (stylized, not cartoonish)

**11. Stats/Insights**
- Period selector at top
- Scrollable stats cards with charts
- AI insights section

**12. Core Values**
- Full-screen swipeable cards OR dramatic presentation
- Buffalo icon with each value
- Final manifesto card

**13. Profile/Settings**
- Header: Avatar, name, tier, member since
- Scrollable sections
- Subscription status visible

## Components & Interactions

**Task Completion Flow**:
1. Tap checkbox → fills with animation
2. Task text strikes through
3. XP +XX floats up
4. Final task → "YOU WON THE DAY" celebration overlay with streak counter animation

**Streak Visualization**:
- Flame icon that intensifies with length
- "🔥 X Day Streak" badge style throughout app

**Progress Elements**:
- Circular progress rings for Power List
- Linear progress bars for challenges/episodes
- All progress uses red accent for completion

**Interactive Feedback**:
- All touchable elements have press states
- Floating buttons: subtle shadow (offset: {width: 0, height: 2}, opacity: 0.10, radius: 2)
- Swipe gestures enabled where appropriate
- Pull-to-refresh on feeds

**Animations**:
- Task completion: satisfying checkmark animation
- Day won: celebration with confetti burst
- Streak counter: number animates upward
- XP gains: float-up animation

## Design System Assets
- System icons (Feather icons) for standard actions
- Buffalo logo/icon
- Tier badges
- Achievement badges
- User avatars with tier indicators
- Episode thumbnails
- Challenge category icons

## Mobile-First Requirements
- Safe area insets respected across all screens
- Thumb-friendly tap targets (minimum 44pt)
- Optimized for iOS/Android
- Gesture-friendly (swipe, pull-to-refresh)