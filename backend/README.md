# Yihune Belay — Portfolio API

A simple Node.js + Express backend used to power a portfolio site for Yihune Belay. This repository provides routes for projects, messages, photo logs, and admin authentication, plus utilities for seeding photos and managing an admin user.

**Repository contents**
- `server.js`: App entrypoint (Express server)

- `models/`: Mongoose-style models (Admin, Project, Message)
- `routes/`: Route handlers for projects, messages, auth, and admin
- `middleware/`: Authentication and upload helpers
- `uploads/`: Directory for uploaded files (photos)

Features
- Basic admin authentication
- CRUD endpoints for projects
- Message posting endpoint (contact form)
- File upload handling for photos

Tech
- Node.js
- Express
- (Optional) MongoDB or other database configured in `server.js`

Prerequisites
- Node.js (16+ recommended)
- npm or yarn
- A running MongoDB instance (if using database persistence)

1. Install dependencies:

	npm install

2. Create a `.env` file in the project root with the environment variables your `server.js` expects, for example:

	MONGODB_URI=mongodb://localhost:27017/portfolio
	JWT_SECRET=your_jwt_secret_here

3. Seed uploads (optional):

	node seed-photos.js

4. Create an admin user (one-time):

	node create-admin.js

5. Start the server:

	node server.js

Scripts and utilities
- `create-admin.js` — interactively creates an admin user (or use env variables if implemented)
- `update-admin.js` — update admin credentials
- `test-endpoints.js` — lightweight script to exercise API endpoints

Environment variables
- `PORT` — port the server listens on (default 3000)
- `MONGODB_URI` — connection string for MongoDB
- `JWT_SECRET` — secret for signing JWTs used by auth middleware

API overview
The repo exposes several HTTP routes (see `routes/` for full details). Common endpoints include:

- `POST /api/auth/login` — Admin login, returns JWT
- `POST /api/admin` — Admin management (protected)
- `GET /api/projects` — List projects
- `POST /api/projects` — Create project (protected)
- `GET /api/projects/:id` — Get project
- `PUT /api/projects/:id` — Update project (protected)
- `DELETE /api/projects/:id` — Delete project (protected)
- `POST /api/messages` — Submit a message/contact form

See the `routes/` folder for exact route names, request bodies, and expected responses.

Uploads
- Uploaded files are stored in the `uploads/` directory. Make sure this folder is writable by the server and not exposed publicly unless intended.

Testing
- Use `test-endpoints.js` or tools like Postman to exercise the API.

Deployment notes
- Ensure `NODE_ENV` and production database connection strings are set.
- Consider using a cloud storage provider (S3, Azure Blob, etc.) for production file uploads instead of local `uploads/`.

Contributing
- Open an issue or submit a PR with improvements. Keep changes focused and test locally before submitting.

License
- This repository does not include a license file. Add one if you plan to open-source the project.

---

If you want, I can also:
- Add example `.env.example` with required variables
- Create Postman collection for the endpoints
- Wire uploads to a cloud provider

Updated file: [README.md](README.md)
