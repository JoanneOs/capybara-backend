BOL Tracker API – Backend Implementation

I built this backend system to manage Bill of Lading (BOL) records using Node.js, Express, and MongoDB. The API provides complete CRUD functionality through RESTful endpoints.

Project Setup

First, I initialized the backend structure:

Created the project directory with mkdir backend
Initialized a Node.js project using npm init -y
I installed these essential dependencies:

Express as our web framework
Mongoose for MongoDB object modeling
Dotenv for environment variables
CORS to enable cross-origin requests
The project follows this organized structure:

Models folder containing Bol.js for our data schema
Routes folder with bolRoutes.js for endpoint logic
Configuration files including .env and server.mjs
For configuration, I:

Set up environment variables for port (3000) and MongoDB connection
Initialized Git version control
Created a .gitignore file to exclude node_modules and .env
Server Implementation

I configured the server to:

Start in development mode using npm run dev
Automatically restart with nodemon during development
Handle all API requests through defined routes
API Endpoints

I implemented these key endpoints:

GET /api/bols

Retrieves all BOL records from the database
POST /api/bols

Creates new BOL records
Accepts JSON with loadNumber, shipper, consignee, rate, miles, and status
GET /api/bols/{id}

Returns a single BOL by its unique ID
PUT /api/bols/{id}

Updates existing BOL records
Accepts partial updates like status changes
DELETE /api/bols/{id}

Removes BOL records from the system
Core Components

I developed these main components:

server.mjs

Sets up Express server
Establishes MongoDB connection
Configures middleware and routes
models/Bol.js

Defines the complete BOL schema
Includes validation for required fields
Structures our database documents
routes/bolRoutes.js

Contains all route handlers
Implements CRUD operations
Manages request/response cycles
The system is now fully functional and ready for integration with frontend applications.

frontend github:
new: 
https://github.com/JoanneOs/Osman_Joanne_BOLTrack2_Capstone.git

//https://github.com/JoanneOs/Osman_Joanne_BOLTracker_Capstone.git

render: 

https://back-end-pyu8.onrender.com //new

https://osman-joanne-boltrack-capstone-backend.onrender.com

_______________________________
render last update:
Frontend (https://frontendrendertest.onrender.com) loads data from https://back-end-pyu8.onrender.com/api/bols.