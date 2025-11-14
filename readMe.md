# Products API Documentation

## Overview
Complete CRUD API for managing products with role-based access control, caching, and pagination.

---

## API Endpoints

### 📖 PUBLIC ENDPOINTS (No Authentication Required)

#### 1. **Get All Products** (with pagination, filtering, sorting)
```
GET /api/v1/products
```
**Query Parameters:**
- `page` (integer, default: 1) - Page number for pagination
- `limit` (integer, default: 10) - Items per page
- `category` (string) - Filter by category (optional)
- `available` (boolean) - Filter by availability (optional)
- `sortBy` (string, default: "-createdAt") - Sort field (e.g., "price", "-price", "-createdAt")

**Example Request:**
```bash
curl -X GET "http://localhost:5400/api/v1/products?page=1&limit=10&category=Electronics&sortBy=price"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "product-id",
        "name": "Product Name",
        "description": "Product description",
        "price": 99.99,
        "category": "Electronics",
        "stock": 50,
        "available": true,
        "createdAt": "2025-11-13T10:00:00Z",
        "updatedAt": "2025-11-13T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pages": 10,
      "limit": 10
    }
  }
}
```

---

#### 2. **Get Single Product by ID**
```
GET /api/v1/products/:id
```

**Example Request:**
```bash
curl -X GET "http://localhost:5400/api/v1/products/507f1f77bcf86cd799439011"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 25,
    "available": true,
    "createdAt": "2025-11-13T10:00:00Z"
  }
}
```

---

#### 3. **Get Products by Category**
```
GET /api/v1/products/category/:category
```

**Example Request:**
```bash
curl -X GET "http://localhost:5400/api/v1/products/category/Electronics"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Products by category retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "category": "Electronics",
      "stock": 25,
      "available": true
    }
  ]
}
```

---

### 🔒 PROTECTED ENDPOINTS (Admin Only)

#### 4. **Create New Product**
```
POST /api/v1/products/create
```

**Headers:**
```
Authorization: Bearer <access-token>
meaning you need to be logged in
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50,
  "available": true
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:5400/api/v1/products" \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Laptop",
    "description": "Latest gaming laptop",
    "price": 1499.99,
    "category": "Electronics",
    "stock": 30,
    "available": true
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "New Laptop",
    "description": "Latest gaming laptop",
    "price": 1499.99,
    "category": "Electronics",
    "stock": 30,
    "available": true,
    "createdAt": "2025-11-13T10:30:00Z"
  }
}
```

---

#### 5. **Update Product**
```
PATCH /api/v1/products/update:id
```

**Headers:**
```
Authorization: Bearer <access-token>

```

**Request Body (partial update):**
```json
{
  "price": 1399.99,
  "stock": 25
}
```

**Example Request you get:**
```bash
curl -X PATCH "http://localhost:5400/api/v1/products/507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1399.99,
    "stock": 25
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "New Laptop",
    "description": "Latest gaming laptop",
    "price": 1399.99,
    "category": "Electronics",
    "stock": 25,
    "available": true,
    "updatedAt": "2025-11-13T10:45:00Z"
  }
}
```

---

#### 6. **Delete Product**
```
DELETE /api/v1/products/:id
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Example Request:**
```bash
curl -X DELETE "http://localhost:5400/api/v1/products/507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer <access-token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "New Laptop",
    "description": "Latest gaming laptop",
    "price": 1399.99,
    "category": "Electronics",
    "stock": 25,
    "available": true
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Name, description, price, and category are required",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found",
  "data": null
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "You are not logged in! Please log in to gain access.",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "data": null
}
```

---

## Features Implemented

✅ **CRUD Operations** - Create, Read (single & multiple), Update, Delete  
✅ **Authentication & Authorization** - JWT-based with role checking  
✅ **Pagination** - Page and limit support  
✅ **Filtering** - By category and availability  
✅ **Sorting** - Flexible sorting by any field  
✅ **Search** - Full-text search by name and description  
✅ **Caching** - Redis caching for public endpoints  
✅ **Rate Limiting** - Protection against abuse  
✅ **Error Handling** - Comprehensive error messages  
✅ **Input Validation** - Schema validation via Zod (ready for integration)

---

## Caching Strategy

Public endpoints are cached to improve performance:
- **Get All Products**: 3600 seconds (1 hour)
- **Get Single Product**: 3600 seconds (1 hour)
- **Get by Category**: 3600 seconds (1 hour)

Cache is automatically cleared when a product is created, updated, or deleted.

---

## Authentication

To use protected endpoints, you need:

1. **Register/Login** to get an access token
2. **Include the token** in the Authorization header:
   ```
   Authorization: Bearer <your-access-token>
   ```

Only users with the `admin` role can create, update, or delete products.

---

## Testing with Postman

### Setup:
1. Get your access token from `/api/v1/auth/login`
2. Use `{{token}}` in Authorization header
3. by choosing bearer token and paste the token you got from logging in there

### Example:
```
Authorization: Bearer {{token}}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Product IDs are MongoDB ObjectIDs
- Prices and stock are numbers
- pagination included on the getAllProducts