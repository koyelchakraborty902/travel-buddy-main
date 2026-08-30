## Project Title
TravelBuddy – Smart Short-Notice Trip Planner

## Short Description
TravelBuddy is a full-stack web application that helps users plan short-notice trips based on mood, budget, and available travel days. It provides hotel, food, and route suggestions, allows booking, and generates professional e-tickets.

## Features
• Mood-based destination suggestions
• Budget-based trip planning
• Hotel / food / travel route selection
• Automatic cost calculation
• Booking system
• PDF e-ticket generation
• Booking history
• Notification system

## Tech Stack
Frontend:
• Next.js
• Tailwind CSS
• Framer Motion

Backend:
• Django
• Django REST Framework
• SQLite

Other:
• ReportLab (PDF generation)

## Installation Steps
Backend

cd travelbuddy-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend

cd travelbuddy-frontend
npm install
npm run dev


## How to Use
• Open homepage
• Fill mood, days, budget
• Generate plan
• Select hotel, food, route
• Book trip
• Download ticket


## Future Improvements
• User login authentication
• Email ticket delivery
• Ratings & reviews



