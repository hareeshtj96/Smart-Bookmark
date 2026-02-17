**Smart Bookmark App**
A modern bookmark manager built with Next.js and Supabase that supports realtime updates across multiple tabs using Supabase Realtime.

Live Demo
Deployment Link: https://smart-bookmark-theta-seven.vercel.app/

**Features**
- Add bookmarks
- Delete bookmarks
- Realtime sync across multiple tabs
- Responsive design


**Tech Stack**
- Next.js
- TypeScript
- Supabase
- Tailwind CSS
- Framer motion
- Sonner

**How It Works**
1. Bookmarks are stored in Supabase.
2. A reatime subscription listens to changes in the 'bookmarks' table.
3. When a bookmark is inserted or deleted: - All open tabs receive updates instantly.
4. React state updates the UI automatically.


**Installation & Setup**

**Clone the Repository**

git clone https://github.com/hareeshtj96/Smart-Bookmark.git

Navigate into the Project 

cd Smart-Bookmark

Install Dependencies

npm install

Create Environment File

create a .env.local file and add
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

Run the Project

npm run dev

The app will run at :: http://localhost:3000


**Challenges Faced**

Realtime Inset not updating Same Tab::  
When two tabs were open:
Adding a bookmark updated the second tab instantly.
The tab that performed the insert did NOT update.
It worked on localhost but failed in production.

Root Cause
The UI relied only on Supabase Realtime to update state.
In production, network timing caused a race condition.
The insert event sometimes did not update local state correctly.

Solution
I implemented an UI update strategy. Instead of waiting for the realtime event to update the UI, I immediately updated the local state as soon as the bookmark was successfully inserted into the database.
This ensured
- The current tab updates instantly.
- Other open tabs sycn through Supabase Realtime.
- No refresh is required.


