# Frontend for Uniswap V3 Tracker

## Overview
This frontend is part of the Tokka Labs Engineering Challenge. It is a React-based UI that interacts with the backend to display transaction data from the Uniswap V3 WETH-USDC pool.

## Features
- Real-time display of swaps and transfers
- Historical transaction search by hash and date range
- UI built with React and Material UI

## Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a .env file in the root directory with the following variables:
```
PORT=5234

REACT_APP_SERVER_URL=http://localhost:3333
```

### 4. Run Frontend Locally
```bash
npm start
```
The frontend will be running on http://localhost:5234


## Running with Docker Compose
### 1. Build and Run with Docker Compose
```bash
docker-compose up --build
```

### 2. Stop the Frontend
```bash
docker-compose down
```

## Frontend Design Considerations

This frontend is developed using React and Material UI, providing a user interface for real-time and historical transaction data from the Uniswap V3 WETH-USDC pool.
