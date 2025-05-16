BOL Tracker API – Backend
This backend system is designed to manage Bill of Lading (BOL) records for a dispatching and logistics platform. It provides full CRUD functionality through RESTful endpoints and is intended to integrate with a React frontend. The API supports operations like creating, updating, retrieving, and deleting BOL entries.

Frontend Repository
Frontend GitHub Repo
Live Frontend Deployment

Technologies Used
Node.js

Express

MongoDB

Mongoose

Dotenv

CORS

Render (for deployment)

API Endpoints
GET /api/bols – Retrieve all BOL records

GET /api/bols/:id – Retrieve a single BOL record by ID

POST /api/bols – Create a new BOL record

PUT /api/bols/:id – Update an existing BOL record

DELETE /api/bols/:id – Delete a BOL record

Each BOL entry includes fields such as:

loadNumber

shipper

consignee

rate

miles

status

Project Structure
go
Copy code
backend/
├── models/
│   └── Bol.js           // Mongoose schema
├── routes/
│   └── bolRoutes.js     // API route handlers
├── server.mjs           // Express server config
├── .env                 // Environment variables
├── .gitignore
├── package.json
Getting Started (Local Installation)
Clone the repository

bash
Copy code
git clone https://github.com/JoanneOs/Osman_Joanne_BOLTrack2_Capstone.git
cd backend
Install dependencies

bash
Copy code
npm install
Create a .env file and add the following:

ini
Copy code
PORT=3000
MONGO_URI=your_mongodb_connection_string
Run the server

bash
Copy code
npm run dev
Server runs locally at:
http://localhost:3000/api/bols

Deployed API
Live backend hosted on Render:
https://back-end-pyu8.onrender.com

User Stories
As a dispatcher, I want to create BOL records for new shipments.

As a logistics manager, I want to view all active and completed BOLs.

As an admin, I want to update a BOL’s status (e.g., In Transit, Delivered).

As a user, I want to delete outdated or incorrect BOLs.

Resources & References
Express Documentation

MongoDB & Mongoose

Render Deployment Guide

REST API Design

Future Plans
Add user authentication and role-based access

Add validation and error handling improvements

Expand the BOL schema with timestamps, notes, and tracking history

Implement file upload for signed delivery documents 