# Blog API

A backend API for managing blog posts, comments, and user accounts. This project uses Express, Prisma, PostgreSQL, JWT authentication, and author-role access controls for managing content.

## Features

- Create, edit, publish, and delete posts
- Draft and published post states
- Public access to published posts only
- Author-only access to management endpoints
- Nested comments on posts
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Request validation with express-validator
- Prisma ORM with PostgreSQL
- Pagination on list endpoints

## Tech stack

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT (`jsonwebtoken`)
- bcrypt
- express-validator
- Passport packages included in dependencies
- CORS support

## Project structure

```text
.
├── app.js
├── README.md
├── package.json
├── package-lock.json
├── .gitignore
├── LICENSE
├── config/
│   ├── bcrypt.js
│   ├── passport.js
│   └── prisma.js
├── controllers/
│   ├── authController.js
│   ├── commentController.js
│   ├── errorController.js
│   └── postController.js
├── db/
│   ├── comment.query.js
│   ├── post.query.js
│   └── user.query.js
├── middlewares/
│   ├── authenticateUser.js
│   └── validateRequest.js
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── routes/
│   ├── authRouter.js
│   ├── commentRouter.js
│   └── postRouter.js
├── validator/
│   ├── authValidation.js
│   ├── commentValidation.js
│   └── postValidation.js
├── .env
└── generated/
```

## Database schema

The Prisma schema defines the following models:

### User

- `id` (UUID)
- `username` (unique)
- `password`
- `isAuthor` (boolean, default `false`)
- `posts`
- `comments`

### Post

- `id` (UUID)
- `title`
- `content`
- `uploadTime`
- `published` (boolean, default `false`)
- `publishTime`
- `userId`
- `comments`

### Comment

- `id` (UUID)
- `content`
- `timestamp`
- `userId`
- `postId`

## Getting started

### Prerequisites

- Node.js 18 or later
- PostgreSQL database
- Access to a local or hosted PostgreSQL instance

### Installation

```bash
git clone https://github.com/Notme0017/Blogs.git
cd Blogs
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
JWT_SECRET="your-long-random-secret"
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
```

Notes:

- `DATABASE_URL` is required for Prisma.
- `JWT_SECRET` is required for JWT signing and verification.
- `CORS_ORIGINS` is optional but used by the app config.

### Database setup

```bash
npx prisma migrate dev
npx prisma generate
```

If you change `prisma/schema.prisma`, run the generate command again.

### Run the server

```bash
node app.js
```

The app listens on port `8080`.

## Authentication

The API uses stateless JWT authentication.

### Login flow

1. Create an account with `POST /auth/signup` or `POST /auth/author/signup`
2. Log in with `POST /auth/login`
3. Receive a JWT in the response
4. Send it as a bearer token for protected routes

Example:

```http
Authorization: Bearer <your-token>
```

### Response example

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Author access

Users can be flagged as authors via `isAuthor`. Author-only routes require:

- a valid JWT
- `req.user.isAuthor === true`

This is enforced in `middlewares/authenticateUser.js`.

## API endpoints

### Auth

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Create a user account |
| POST | `/auth/author/signup` | Public | Create a user with `isAuthor=true` |
| POST | `/auth/login` | Public | Log in and receive a JWT |
| GET | `/auth/me` | Authenticated | Get the current authenticated user |

### Posts

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/posts` | Public | List published posts |
| GET | `/posts/all` | Author | List all posts for the authenticated author |
| GET | `/posts/author/:id` | Author | View a specific post for the author |
| GET | `/posts/:id` | Public | Get a published post by ID |
| POST | `/posts` | Author | Create a new post (draft by default) |
| PUT | `/posts/:id` | Author | Update a post |
| PATCH | `/posts/:id/publish` | Author | Toggle published status using `publishStatus` |
| DELETE | `/posts/:id` | Author | Delete a post |

### Comments

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/posts/:postId/comments` | Public | List comments for a published post |
| POST | `/posts/:postId/comments` | Authenticated | Add a comment to a published post |
| PUT | `/posts/:postId/comments/:commentId` | Authenticated | Update a comment you own |
| DELETE | `/posts/:postId/comments/:commentId` | Authenticated | Delete a comment you own |

## Example payloads

### Create a post

```json
{
  "title": "My first blog post",
  "content": "This is the content of my post."
}
```

### Publish or unpublish a post

```json
{
  "publishStatus": true
}
```

### Add a comment

```json
{
  "content": "Nice article!"
}
```

### Sign up user

```json
{
  "username": "john_doe",
  "password": "MyStrongPass1!"
}
```

### Sign up author

```json
{
  "username": "author_name",
  "password": "MyStrongPass1!",
  "isAuthor": true
}
```

### Login

```json
{
  "username": "john_doe",
  "password": "MyStrongPass1!"
}
```

## Pagination

List endpoints accept `page` and `limit` query parameters.

Example:

```http
GET /posts?page=1&limit=10
GET /posts/:postId/comments?page=2&limit=20
```

Responses include `data` and `pagination`:

```json
{
  "data": [],
  "pagination": {
    "totalItems": 42,
    "totalPages": 5,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

## Validation rules

The app validates input using `express-validator`.

### User validation

- Username is required
- Username can include letters, numbers, and underscores
- Username must be unique
- Password must be 8-100 characters
- Password must include:
  - uppercase letter
  - lowercase letter
  - number
  - special character

### Post validation

- `title` is required and must be a string
- `content` is required and must be a string
- Max length for title is 255
- Max length for content is 50000

### Comment validation

- `content` is required
- Max length is 2000

## Status codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 204 | No content / deleted |
| 400 | Validation error |
| 401 | Missing, invalid, or expired JWT |
| 403 | Authenticated but not allowed |
| 404 | Resource not found |
| 409 | Duplicate username / conflict |

## Error handling

The app includes centralized error handling in `controllers/errorController.js` and returns structured JSON error messages for validation and authorization problems.

## Notes

- This repository is a backend service only; there is no frontend app included here.
- The app is currently started directly in `app.js` and listens on port `8080`.
- The project includes a `passport.js` config file, but the active authentication flow in the app is implemented using the custom JWT middleware in `middlewares/authenticateUser.js`.
- JWTs are stateless; logout is typically handled on the client by deleting the token.

## License

This project is licensed under the ISC license.
