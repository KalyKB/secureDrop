# secureDrop

A secure web-based file storage application built for cybersecurity coursework. Supports user authentication, role-based access control, and encrypted file storage via AWS S3.

## Live Demo

**[tagg02.github.io/secureDrop](https://tagg02.github.io/secureDrop)**

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- File upload, download, and delete
- Files stored securely in AWS S3
- Admin dashboard to view users and manage roles
- Rate limiting and security headers

## Tech Stack

**Frontend:** HTML, CSS, JavaScript — hosted on GitHub Pages  
**Backend:** Node.js, Express — hosted on Railway  
**Database:** MySQL (Railway)  
**Storage:** AWS S3

## Usage

Visit the live site above. Register an account to start uploading files. Admins can manage user roles from the Admin Dashboard.

## Local Development

1. Clone the repo
2. Create `FullBackend/.env` with the following variables:
DATABASE_URL=your_mysql_url
JWT_SECRET=your_secret
AWS_REGION=your_region
AWS_ACCESS_KEY=your_key
AWS_SECRET_KEY=your_secret_key
AWS_BUCKET=your_bucket_name


3. Run `npm install` inside `FullBackend/`
4. Run `node server.js`
5. Open `docs/index.html` with Live Server
