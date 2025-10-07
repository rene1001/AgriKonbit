# API AgriKonbit (FR)

- Base URL (dev): `http://localhost:5000`
- Docs Swagger: `http://localhost:5000/api-docs`

## Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/web3-login`
- GET `/api/auth/me`

## Projets
- GET `/api/projects` (query: status, category, page, limit)
- GET `/api/projects/:id`
- POST `/api/projects` (farmer)
- POST `/api/projects/:id/updates` (farmer)

## Investissements
- GET `/api/investments/my-investments`
- POST `/api/investments`
- GET `/api/investments/:id`
- GET `/api/investments/stats/overview`

## Marketplace
- GET `/api/products` (filtres)
- GET `/api/products/:id`
- POST `/api/products` (farmer)
- GET `/api/products/:id/traceability`

## Commandes
- POST `/api/orders`
- GET `/api/orders/my-orders`
- GET `/api/orders/:id`

## Blockchain (simulation)
- GET `/api/blockchain/gyt/info`
- GET `/api/blockchain/gyt/balance`
- GET `/api/blockchain/gyt/transactions`
- GET `/api/blockchain/nft/:nftId`

## Paiements (simulation)
- POST `/api/payments/stripe/create-payment-intent`
- POST `/api/payments/stripe/confirm-payment`
- POST `/api/payments/paypal/create-order`
- POST `/api/payments/paypal/capture-order`
