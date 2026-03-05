# Tennis Court & Coaching Management System  
Product Requirement Document (PRD)

---

## 1. Project Overview

This project is a modern web-based **Tennis Court Booking & Coaching Progress Management System**.

The system supports:

- Court booking (casual play or training)
- Coach scheduling
- Student progress tracking
- Parent monitoring
- Performance reporting
- Revenue & system analytics

The UI should be clean, modern, minimal, and friendly.  
Primary color theme: **White + Blue**

### Frontend Stack (Phase 1)

- Next.js (App Router)
- TailwindCSS
- shadcn/ui
- react-hook-form
- framer-motion

Backend:
Designed for scalable architecture (multi-branch ready, enterprise-ready RBAC).

---

## 2. User Roles

### 2.1 Admin
- Manage courts
- Manage branches
- Manage coaches
- Manage users
- View system reports
- View revenue dashboard
- Manage coach-student relationships

---

### 2.2 Coach
- View assigned students
- Manage availability schedule
- Conduct training sessions
- Create daily progress reports
- View session history

---

### 2.3 Student (Training Member)
- Book coach sessions
- Book court (practice)
- View progress reports
- Track skill improvement
- View session history

---

### 2.4 Parent (Optional Extension)
- Linked to one or more students
- View child progress
- Monitor attendance
- View performance analytics

---

### 2.5 Casual Player

A normal player who:
- Books court only
- May optionally add a coach to the booking
- Does NOT require long-term training relationship

Casual Player can:
- Register account
- Book court
- Book court + coach
- View booking history

---

## 3. Core Features

---

## 3.1 Authentication

- Register
- Login
- Forgot Password
- Role-based access control (RBAC)
- JWT session management
- Email verification (future)

---

## 3.2 Court Management

Each court includes:

- id
- name
- type (indoor / outdoor)
- pricePerHour
- status (active / maintenance)
- description
- images
- branchId

Users can:

- View court list
- Filter by date/time availability
- Filter by type
- Book time slot

---

## 3.3 Court Booking

### Booking Types

#### A. Court Only (Casual Play)
User books court without coach.

#### B. Court + Coach
User books court and selects available coach.

#### C. Training Session
Coach session with one or multiple students.

---

### Booking Structure

- id
- userId
- courtId
- coachId (nullable)
- bookingType (COURT_ONLY / COURT_COACH / TRAINING)
- date
- startTime
- endTime
- duration
- totalPrice
- paymentStatus
- bookingStatus

---

### UI Requirements

- Calendar time slot picker
- Real-time availability indicator
- Modern card layout
- Smooth animations
- Clear pricing breakdown

---

## 3.4 Coach Management

Coach entity includes:

- id
- userId
- experienceYears
- hourlyRate
- bio
- avatar
- availabilitySchedule
- specialties

Relationship model:

- 1 coach → many students
- many coaches ↔ many students (n-n)
- Casual player can book coach per session without permanent relation

---

## 3.5 Progress Report System (CRITICAL FEATURE)

After each training session, coach fills daily report form.

### Report Includes

- forehandScore (1–10)
- backhandScore (1–10)
- serveScore (1–10)
- footworkScore (1–10)
- staminaScore (1–10)
- attendance (present / absent)
- overallComment
- improvementPlan
- nextGoal
- sessionId
- studentId
- coachId

---

### Dashboard Must Display

- Historical progress
- Skill improvement chart (line chart)
- Attendance history
- Monthly performance summary
- Coach remarks timeline

Reports are only available for TRAINING sessions.

---

## 3.6 Booking History

Users can view:

- Court booking history
- Coach session history
- Payment history
- Upcoming sessions

---

## 3.7 Dashboard

### Student Dashboard
- Upcoming sessions
- Recent reports
- Skill progress charts
- Attendance rate

### Coach Dashboard
- Today's sessions
- Pending reports
- Student list
- Performance overview

### Casual Player Dashboard
- Upcoming bookings
- Past bookings
- Favorite courts

### Admin Dashboard
- Total bookings
- Revenue overview
- Court utilization rate
- Active students
- Active coaches
- Monthly growth

---

## 4. Data & Relationship Model (Conceptual)

User Types are controlled via:

- roles table
- users.role_id

Booking supports:

- user → court
- user → court + coach
- coach → multiple students (session-based)
- coach-student persistent relationship (optional)

The system must support:

- Many-to-many coach-student relationships
- Session-based attendance tracking
- Multi-branch scalability

---

## 5. UI Requirements

### Pages

- /login
- /register
- /dashboard
- /courts
- /coaches
- /reports
- /profile
- /bookings
- /admin

### Design Guidelines

- White + Blue theme
- Modern SaaS style
- Rounded corners
- Soft shadow
- Clean typography
- Smooth animations
- Responsive (mobile first)

---

## 6. Scalability Considerations

- Role-based access control
- Multi-branch ready
- Modular booking system
- Separated training & casual booking logic
- Ready for payment gateway integration
- Analytics-ready database structure

---

END OF DOCUMENT