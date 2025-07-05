# DevSocial

**DevSocial** is a full‑stack social networking platform designed for software engineers. The application lets developers create rich professional profiles, share knowledge through posts, and engage with peers via comments and likes—all within a modern MERN‑stack architecture.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

- **Secure authentication** – JSON Web Tokens (JWT) protect all private API routes.
- **Developer profiles** with skills, work experience, education history, and social links.
- **Interactive feed** – create, like, and comment on posts; real‑time feedback with optimistic UI updates.
- **RESTful API** built with Express and MongoDB (Mongoose) featuring thorough request validation.
- **Responsive React UI** with global state managed by Redux Toolkit and asynchronous data handled with Redux Thunk.
- **Concurrent development workflow** – run client and server together via a single `npm run dev` command.

## Tech Stack

| Layer            | Technologies                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Frontend**     | React 18  ·  Redux Toolkit  ·  React Router 6  ·  Axios  ·  Moment.js                    |
| **Backend**      | Node.js  ·  Express.js  ·  MongoDB / Mongoose  ·  JWT  ·  bcryptjs  ·  express‑validator |
| **Tooling / DX** | Nodemon  ·  Concurrently (parallel client/server)                                        |

## Installation

### Prerequisites

- **Node.js 14+** and **npm**
- **MongoDB** instance (local or Atlas)

### Quick Start

```bash
# 1. Clone the repository
$ git clone https://github.com/codereyes-1/DevSocial.git
$ cd DevSocial

# 2. Install root (server) dependencies
$ npm install

# 3. Install client dependencies
$ npm install --prefix client

# 4. Configure environment
#   Create config/default.json and add:
#   {
#     "mongoURI": "<Your MongoDB URI>",
#     "jwtSecret": "<Random Long String>"
#   }

# 5. Launch the development environment
$ npm run dev
```

This starts **Express** on `http://localhost:5000` and the **React** client on `http://localhost:3000` via a proxy, enabling seamless full‑stack development.

## Usage

1. Register an account and log in.
2. Complete your developer profile by adding skills, experience, education, and social handles.
3. Post updates, insights, or questions to the community feed.
4. Interact with peers through likes and threaded comments.
5. Explore other developers’ profiles to expand your professional network.

## License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

