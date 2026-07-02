# MasterOS — Premium Productivity Operating System

MasterOS is a premium, developer-centric productivity operating system that brings learning tracks, task management, peer-to-peer collaboration, and gamified statistics into a beautifully coordinated operating system.

---

## 🚀 Key Features

- **🧠 AI Roadmap Generator**: Enter any topic, duration, study level, and intensity to dynamically compile modular learning tracks, topics, subtopics, recommended projects, and milestones via Gemini AI.
- **⚡ Task Boards & Pinned Focus Tasks**: Manage daily habits, workspace tasks, and university timelines with inline priorities, status toggles, and pinned focus boards.
- **💬 Real-Time Collaboration & Chats**: Real-time DM messaging with emojis, file attachments, and direct workspace link sharing, backed by active Firestore listener nodes.
- **🔥 Gamified Statistics & Achievements**:
  - Live XP metrics synchronized on completion of tasks.
  - Active Daily Streak verification with a contribution calendar Heatmap.
  - Visual badges and ranking lists calculated dynamically based on user stats.
- **🚨 Urgent & Important Preview**: An integrated overview panel tracking overdue tasks, upcoming exams, and assignments pending within 7 days.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, Vite 8, React Router 7
- **Styling**: TailwindCSS 4, Custom Glassmorphic layouts, CSS animations
- **Backend & Database**: Firebase Auth (Google Provider), Firebase Firestore (Real-time DB)
- **AI Core Integration**: Google Gemini API via AI Studio (Gemini Flash Model)

---

## 📁 Firebase Schema Architecture

MasterOS uses a denormalized Firestore data model to sync profiles, progress, and messages:

| Entity | Collection Name | Storage Model | Details |
|---|---|---|---|
| **Users / Profiles** | `users` | Document per User | User details, skills, badges, and `activityHistory` (commitment map). |
| **Workspaces** | `workspaces` | Document per Workspace | Embedded roadmap tracks, notes, study resources, and progress percentage. |
| **Todos** | `tasks` | Document per Task | Pinned/personal tasks (`workspaceId = null`). |
| **Assignments** | `assignments` | Document per Assignment | Tracker for university assignments and due dates. |
| **Exams** | `exams` | Document per Exam | Tracker for exam schedules. |
| **Leaderboard** | `leaderboards` | Document per Entry | Public leaderboard records containing active streaks, task tallies, and total XP. |
| **Friends** | `friends` | Document per Peer | Friendship pairings (ID: sorted combination of user UIDs). |
| **Chats** | `chats` | Document per DM Room | Direct messaging metadata, last message summary, and timestamps. |
| **Messages** | `chats/{id}/messages` | Subcollection | Room-level messages including payload attachments (files, images, workspaces). |

---

## ⚡ Setup & Installation

### Prerequisites

Ensure you have **Node.js 18+** installed on your machine.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/levidishashidarreddy/Masteros.git
cd Masteros
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Gemini API Key (Get from: https://aistudio.google.com/app/apikey)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Web App Config
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id_here
```

### 3. Run Locally

Start the Vite development server:

```bash
npm run dev
```

### 4. Build for Production

Compile the optimized bundle:

```bash
npm run build
```

---

## 🌐 Deployment Instructions

MasterOS is ready to build and deploy to hosting providers like **Vercel**, **Netlify**, or **Firebase Hosting**:

### Deploying to Vercel/Netlify
1. Connect your GitHub repository to Vercel/Netlify.
2. Set the Build Command to `npm run build` and Output Directory to `dist`.
3. Add the exact environment variables from your `.env` file under the project settings.

---

## 🔮 Future Roadmap (V2)
- **📊 Interactive Analytics Dashboard**: Deep-dive analytics tracking study habits and task velocity over time.
- **💻 Collaboration Workspace Sharing**: Collaborative multi-user editing for active workspace nodes.
- **🔔 Native Push Notifications**: System-level notifications for upcoming deadlines and received chats.
