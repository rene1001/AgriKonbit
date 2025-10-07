# AgriKonbit 🌱

A complete crowdfunding + marketplace platform for agricultural projects with blockchain integration.

## Features

- **Crowdfunding**: Farmers submit projects, investors fund them
- **Marketplace**: Buy agricultural products with blockchain traceability
- **Blockchain**: GYT token (ERC20) + Product NFTs (ERC721) on Polygon
- **Payments**: Stripe, PayPal, MetaMask integration
- **Multi-role**: Farmers, Investors, Consumers, Admins

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Blockchain**: Polygon Mumbai testnet
- **Payments**: Stripe, PayPal, MetaMask
- **Storage**: S3-compatible
- **Deployment**: Docker + GitHub Actions

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

## Project Structure

```
agrikonbit/
├── client/                 # React frontend
├── server/                 # Express backend
├── contracts/              # Smart contracts
├── migrations/             # Database migrations
├── docs/                   # Documentation
└── docker/                 # Docker configuration
```

## Database Schema

The platform uses MySQL with the following main tables:
- `users` - User accounts and roles
- `projects` - Agricultural projects
- `investments` - Investment records
- `products` - Marketplace products
- `orders` - Purchase orders

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Smart Contracts

- **GYT Token**: ERC20 token for platform transactions
- **Product NFT**: ERC721 for product traceability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
