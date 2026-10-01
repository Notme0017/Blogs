
# Blog API

A RESTful blog back end built with Express and Prisma. Authors can write, publish, and manage posts and comments. Readers can browse published posts and leave comments. Authentication uses JWTs sent in an `Authorization: Bearer` header.

## Features

- Posts with a published / unpublished (draft) state
- Comments nested under posts
- User accounts with author-only route protection
- Password hashing with bcrypt
- JWT authentication (Passport local strategy for login, JWT strategy for protected routes)
- Request validation and centralized error handling

## Tech stack

- Node.js and Express
- Prisma ORM with PostgreSQL
- Passport (`passport-local`, `passport-jwt`)
- `jsonwebtoken` and bcrypt
- Validation library of your choice (see `validator/`)

## Project structure

```
.
├── app.js                  # Express app setup, middleware, route mounting
├── config/
│   ├── bcrypt.js           # Password hashing settings
│   ├── passport.js         # Passport local + JWT strategies
│   └── prisma.js           # Prisma client instance
├── controllers/
│   ├── authController.js
│   ├── commentController.js
│   ├── errorController.js  # Central error handling
│   └── postController.js
├── db/                     # Database query functions
│   ├── comment.query.js
│   ├── post.query.js
│   └── user.query.js
├── generated/              # Generated Prisma client
├── middlewares/
│   ├── authenticateUser.js # Verifies the JWT on protected routes
│   └── validateRequest.js  # Returns validation errors
├── prisma/
│   ├── migrations/
│   └── schema.prisma       # Data models
├── routes/
│   ├── authRouter.js
│   ├── commentRouter.js
│   └── postRouter.js
├── validator/              # Validation rules per resource
│   ├── authValidation.js
│   ├── commentValidation.js
│   └── postValidation.js
├── .env                    # Environment variables (not committed)
└── package.json
```

**How a request flows:** route, then validator, then `validateRequest`, then (for protected routes) `authenticateUser`, then controller, then `db` query function, then response. Unexpected errors go to `errorController`.

## Getting started

### Prerequisites

- Node.js 18 or later
- A PostgreSQL database (local or hosted)

### Installation

```bash
git clone <https://github.com/Notme0017/Blogs.git>
cd <Blogs>
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
JWT_SECRET="a-long-random-string"
PORT=3000
```

Never commit `.env`. Use a long random value for `JWT_SECRET`, and a different one in production.

### Database setup

```bash
npx prisma migrate dev
npx prisma generate
```

Run `prisma generate` again whenever you change `schema.prisma`.

### Run the server

```bash
node app.js
```

If you've added a start or dev script to `package.json`, use that instead (for example `npm run dev`).

## Authentication

1. Log in with `POST /auth/login` using a username and password.
2. The response contains a JWT.
3. Send it on protected requests:

```
Authorization: Bearer <your-token>
```

4. Log out by deleting the token on the client.

Tokens expire after a set time, so expect a `401` when one expires and log in again. Authors are marked with an `isAuthor` flag on the user; set directly in the database (for example with Prisma Studio) for your account.

## API endpoints

### Auth

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Create an account |
| POST | `/auth/login` | Public | Log in and receive a JWT |

### Posts

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/posts` | Public | List published posts |
| GET | `/posts/all` | Author | List all posts, including drafts |
| GET | `/posts/:postId` | Public | Get one post (drafts visible to author only) |
| POST | `/posts` | Author | Create a post (starts as a draft) |
| PUT | `/posts/:postId` | Author | Edit a post |
| PATCH | `/posts/:postId/publish` | Author | Publish or unpublish a post |
| DELETE | `/posts/:postId` | Author | Delete a post |

### Comments

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/posts/:postId/comments` | Public | List comments on a post |
| POST | `/posts/:postId/comments` | Public | Add a comment |
| PUT | `/posts/:postId/comments/:commentId` | Author | Edit a comment |
| DELETE | `/posts/:postId/comments/:commentId` | Author | Delete a comment |

### Status codes

| Code | Meaning |
|---|---|
| 200 / 201 / 204 | Success / created / deleted |
| 400 | Invalid input |
| 401 | Missing, invalid, or expired token |
| 403 | Logged in but not allowed (not an author) |
| 404 | Resource not found |
| 409 | Conflict (for example, username already taken) |

## Troubleshooting

| Problem | Likely cause |
|---|---|
| `Can't reach database server` | Wrong `DATABASE_URL` or the database isn't running |
| `req.body` is undefined | `express.json()` is missing or registered after the routes |
| `401` on every protected request | Header isn't `Bearer <token>`, or `JWT_SECRET` differs between signing and verifying |
| `Failed to serialize user into session` | Passport sessions weren't disabled; use `session: false` |
| `req.params.postId` is undefined in comment routes | The comment router needs `express.Router({ mergeParams: true })` |
| CORS error in the browser | Add your front-end origin to the allowed origins |
| Prisma client errors after editing the schema | Run `npx prisma migrate dev` and `npx prisma generate` |

## Related projects

- Public blog front end: _add link_
- Author/admin front end: _add link_