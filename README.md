# Backend Service for Uniswap V3 Tracker

## Overview
This backend service is part of the Tokka Labs Engineering Challenge. It tracks transactions in the Uniswap V3 WETH-USDC pool and calculates the transaction fee in USDT.

## Features
- Fetches transaction details by hash
- Supports fetching historical transactions
- Calculates transaction fees in ETH and USDT
- Provides RESTful endpoints for frontend integration

## Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a .env file in the root directory with the following variables:

```
POOL_ADDRESS="0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"

# ETHERSCAN
ETHERSCAN_API_KEY=<enter_your_etherscan_api_key_here>
ETHERSCAN_URL="https://api.etherscan.io"

# INFURA
INFURA_API_KEY=<enter_your_infura_api_key_here>
INFURA_API_KEY_SECRET=<enter_your_infura_api_key_secret_here>

# PORT
PORT=3333
```

### 4. Run the backend locally
```bash
npm start
```

## Testing
### 1. Run Unit Tests
```bash
npm test
```
