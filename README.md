# Blog Web App 

A simple Blog Web App built with Express.js, EJS templates, and JWT following the MVC architecture pattern.

## Tech Stack
- **Node.js & Express.js**: Server framework
- **EJS**: Template engine
- **Sequelize**: ORM for database operations
- **MySQL**: Database
- **JWT**: Cookie-Based JWT Authentication
- **bcrypt**: Password hashing
- **cookie-parser**: Cookie handling


## Seed the database:
  seeder/
   - node databaseSeeder.js
   

## Project Structure (MVC Architecture)

### Models
- Located in `/models`
- Handles data logic and database interactions
- Uses Sequelize ORM for database operations
- Example: `User` model with password hashing using bcrypt

### Views
- Located in `/views`
- EJS templates for rendering dynamic content
- Separate templates for login, registration, and dashboard
- Clean separation of presentation logic

### Controllers
- Located in `/controllers`
- Handles business logic
- Processes user input
- Manages authentication flow
- Interacts with models and renders views

## Authentication Flow

1. **Registration**
   - User submits registration form
   - Validation of input data checked
   - Password is hashed using bcrypt
   - User data stored in database

2. **Login**
   - User submits credentials
   - Server validates credentials
   - JWT token generated
   - Token stored in HTTP-only cookie

3. **Authentication**
   - JWT token verified on each request
   - Protected routes check for valid token (Admin rights, e.g: Add, Edit, delete article)
   - Automatic redirection to login page if unauthorized


### Security Features
- HTTP-only cookies prevent XSS attacks
- JWT expiration limits token lifetime
- Secure password hashing with bcrypt
- Protected routes using middleware


## API Routes
- Application Entry point: `http://localhost:3000/`

### Authentication Routes
- `POST /auth/register`: User registration
- `POST /auth/login`: User login
- `GET /auth/logout`: User logout
- `GET admin/dashboard`: Protected admin dashboard along with CRUD functionality

