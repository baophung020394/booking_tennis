
---

## 2. Separation of Concerns

Each feature must separate:

- UI components
- business logic
- types
- validation schema (zod)
- hooks
- server actions (if needed)

Never mix logic into UI files.

---

## 3. Rendering Rules

- Use Server Components by default.
- Use Client Components only when:
  - Form handling
  - Interactivity
  - Charts
  - Animations

---

## 4. Form Rules

All forms must use:

- react-hook-form
- zod validation
- proper error handling
- reusable form components

---

## 5. Role-Based UI

System must support 5 roles:

- Admin
- Coach
- Student (Training Member)
- Parent (optional UI stub)
- Casual Player

Use a role-based layout rendering strategy.

Example:
- AdminLayout
- CoachLayout
- StudentLayout
- PlayerLayout

---

# CORE FEATURES TO IMPLEMENT (PHASE 1 FRONTEND)

---

## 1. Authentication UI

Pages:
- /login
- /register
- /forgot-password

Include:
- role selection (mocked)
- form validation
- clean layout
- reusable form input components

---

## 2. Court Listing

Page: /courts

Features:

- Court card component
- Show:
  - name
  - type
  - price per hour
  - availability status
  - image
- Filter:
  - by type
  - by availability
- Booking button

---

## 3. Booking System

Support 3 booking types:

### A. Court Only
User books court without coach.

### B. Court + Coach
User selects court + available coach.

### C. Training Session
Coach session with one or multiple students.

Booking modal must include:

- Date picker
- Time slot selector
- Duration selector
- Optional coach selector
- Price breakdown
- Booking type selector

Use clean modal architecture.

---

## 4. Coach Listing

Page: /coaches

Coach card must include:

- avatar
- name
- experience years
- hourly rate
- bio preview
- specialties

Allow:
- View details
- Book coach
- Book court + coach

---

## 5. Report Module (CRITICAL FEATURE)

Only visible to Coach role.

Page: /reports/create

Report form must include:

- Skill rating sliders (1-10):
  - forehand
  - backhand
  - serve
  - footwork
  - stamina
- Attendance checkbox
- Overall comment (textarea)
- Improvement plan
- Next goal

Must use:
- react-hook-form
- zod
- Clean reusable slider component

---

## 6. Dashboard

---

### Student Dashboard

Must show:

- Upcoming sessions
- Recent reports
- Skill trend chart (line chart)
- Attendance rate
- Average score summary

---

### Coach Dashboard

Must show:

- Today's sessions
- Pending reports
- Student list
- Quick create report button

---

### Casual Player Dashboard

Must show:

- Upcoming court bookings
- Booking history
- Favorite courts (mocked)

---

### Admin Dashboard

Must show:

- Total bookings
- Revenue summary (mock)
- Court utilization rate
- Active students
- Active coaches

Use clean analytics cards.

---

# UI DESIGN RULES

- White + Blue primary theme
- Modern SaaS layout
- Rounded-xl corners
- Soft shadows
- Motion transitions
- Mobile-first responsive design
- Consistent spacing system

---

# REUSABLE COMPONENTS REQUIRED

- Button
- Card
- Badge
- Avatar
- Modal
- FormInput
- FormSelect
- FormTextarea
- SkillSlider
- ChartCard
- BookingCard
- SectionHeader

---

# MOCK DATA STRUCTURE

Include mock data for:

- Courts
- Coaches
- Users (multiple roles)
- Bookings
- Reports
- Sessions

All data must be typed using TypeScript.

---

# CLEAN CODE RULES

- No inline business logic inside JSX
- No duplicated components
- No hardcoded random styles
- Strict typing everywhere
- No messy nested JSX
- Keep components small and composable

---

# OUTPUT FORMAT

You must output:

1. Folder structure tree
2. Key reusable components
3. Example page implementation
4. Mock data
5. Clean scalable structure
6. Type definitions

No explanations.
Only structured production-ready code.

END.