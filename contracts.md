# API Contracts & Integration Plan - Sweet Home Bakery

## Overview

This document outlines the API contracts for integrating the frontend (currently using mock.js) with the FastAPI backend and MongoDB database.

## Database Models

### 1. Product Model

```python
{
    "_id": ObjectId,
    "id": str (UUID),
    "name": str,
    "category": str (Breads, Cookies & Brownies, Pastries),
    "price": float,
    "description": str,
    "image": str (URL),
    "featured": bool,
    "created_at": datetime,
    "updated_at": datetime
}
```

### 2. Order Model

```python
{
    "_id": ObjectId,
    "id": str (UUID),
    "customer": {
        "name": str,
        "email": str,
        "phone": str,
        "address": str,
        "delivery_zone": str
    },
    "items": [
        {
            "product_id": str,
            "name": str,
            "price": float,
            "quantity": int
        }
    ],
    "delivery_fee": float,
    "total_amount": float,
    "notes": str,
    "status": str (pending, confirmed, preparing, delivered),
    "created_at": datetime,
    "updated_at": datetime
}
```

### 3. Review Model

```python
{
    "_id": ObjectId,
    "id": str (UUID),
    "name": str,
    "rating": int (1-5),
    "comment": str,
    "date": datetime,
    "created_at": datetime
}
```

## API Endpoints

### Products

- **GET /api/products** - Get all products (with optional category filter)
- **GET /api/products/{id}** - Get single product by ID
- **POST /api/products** - Create new product (admin)
- **PUT /api/products/{id}** - Update product (admin)
- **DELETE /api/products/{id}** - Delete product (admin)

### Orders

- **POST /api/orders** - Create new order
- **GET /api/orders** - Get all orders (admin)
- **GET /api/orders/{id}** - Get single order by ID
- **PUT /api/orders/{id}/status** - Update order status (admin)

### Reviews

- **GET /api/reviews** - Get all reviews
- **POST /api/reviews** - Create new review
- **GET /api/reviews/{id}** - Get single review by ID

## Frontend Integration Changes

### Files to Update:

1. **Products.js** - Replace mock.products with API call to /api/products
2. **OrderForm.js** - Replace mock submission with POST to /api/orders
3. **Reviews.js** - Replace mock.reviews with API call to /api/reviews
4. **Remove mock.js** - Once all integrations are complete

### Mock Data Currently in Use:

- `mock.js` contains:
  - products[] - 6 products (breads, cookies, pastries)
  - reviews[] - 4 customer reviews
  - deliveryZones[] - 6 delivery zones (can keep in frontend)

### Integration Steps:

1. Keep CartContext.js (uses localStorage - no backend needed)
2. Fetch products from /api/products on Products component mount
3. Fetch reviews from /api/reviews on Reviews component mount
4. Submit order to /api/orders on OrderForm submission
5. deliveryZones can remain hardcoded in frontend (business logic)

## Seeding Strategy

On first backend startup, seed database with:

- 6 products from mock.js data
- 4 reviews from mock.js data
- Create indexes for performance

## Error Handling

- Frontend: Display toast errors for failed API calls
- Backend: Return proper HTTP status codes and error messages
- Network errors: Graceful fallback messages

## Testing Checklist

- [ ] GET /api/products returns all products
- [ ] Product filtering by category works
- [ ] POST /api/orders creates order successfully
- [ ] Order includes all cart items and customer info
- [ ] GET /api/reviews returns all reviews
- [ ] Frontend displays products from API
- [ ] Frontend displays reviews from API
- [ ] Order submission works end-to-end
