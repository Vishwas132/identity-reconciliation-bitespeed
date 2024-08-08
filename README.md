# Identity Reconciliation - Bitespeed Backend Task

This project implements the Bitespeed Backend Task: Identity Reconciliation. It provides a web service with an endpoint `/identify` that handles contact information reconciliation.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoint](#api-endpoint)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (>= 18)
- pnpm (https://pnpm.io/)
- PostgreSQL database (>= 14)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Vishwas132/identity-reconciliation-bitespeed.git
   ```

2. Navigate to the project directory:

   ```
   cd identity-reconciliation-bitespeed
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up the database:
   ```
   npm run db:migrate:dev
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
   PORT=3000
   ```
   Replace the database URL with your actual PostgreSQL connection string.

## Usage

To run the server in development mode with hot reloading:

```
npm run dev
```

To build the project:

```
npm run build
```

To run the production server:

```
npm run prod
```

## API Endpoint

The server exposes 2 endpoint:

- **POST** `/identify`

To get a reconciliation result, The endpoint is hosted on Render and can be accessed at:

https://identity-reconciliation-bitespeed-nxmc.onrender.com/identify

### Request Format

```json
{
  "email": string | null,
  "phoneNumber": string | null
}
```

Both `email` and `phoneNumber` are optional, but at least one must be provided.

### Response Format

```json
{
  "contact": {
    "primaryContactId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

- **DELETE** `/all`

To delete all contacts in the database for testing, The endpoint is hosted on Render and can be accessed at:

https://identity-reconciliation-bitespeed-nxmc.onrender.com/all

### Response Format

```json
{
  "success": true
}
```

## Testing

To run the test suite:

```
npm test
```

## Code Quality

This project uses ESLint for linting and Prettier for code formatting. To run these tools:

```
npm run lint
npm run format
```

The project is set up with Husky and lint-staged to run linting and formatting on pre-commit.

## Deployment

The application can be deployed to any Node.js hosting platform. Make sure to set the environment variables and run the database migrations before starting the server:

```
npm run db:migrate:prod
npm run prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

Viswas Lekhwar

## Acknowledgments

- Bitespeed for providing the task specification
