# Todo API

A simple CRUD (Create, Read, Update, Delete) REST API for managing todos, built with Express.js and Winston for logging.

## Features

- ✅ Full CRUD operations
- ✅ In-memory data storage
- ✅ Modular architecture (MVC pattern)
- ✅ Request logging with Winston
- ✅ Input validation
- ✅ Standardized JSON responses

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000/api/todos
```

### 1. Get All Todos

**Endpoint:** `GET /api/todos`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "createdAt": "2025-10-07T10:30:00.000Z",
      "updatedAt": "2025-10-07T10:30:00.000Z"
    }
  ]
}
```

### 2. Get Todo by ID

**Endpoint:** `GET /api/todos/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2025-10-07T10:30:00.000Z",
    "updatedAt": "2025-10-07T10:30:00.000Z"
  }
}
```

### 3. Create Todo

**Endpoint:** `POST /api/todos`

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2025-10-07T10:30:00.000Z",
    "updatedAt": "2025-10-07T10:30:00.000Z"
  }
}
```

### 4. Update Todo

**Endpoint:** `PUT /api/todos/:id`

**Request Body:** (all fields are optional)
```json
{
  "title": "Buy groceries and cook",
  "description": "Milk, eggs, bread, chicken",
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": 1,
    "title": "Buy groceries and cook",
    "description": "Milk, eggs, bread, chicken",
    "completed": true,
    "createdAt": "2025-10-07T10:30:00.000Z",
    "updatedAt": "2025-10-07T10:32:00.000Z"
  }
}
```

### 5. Delete Todo

**Endpoint:** `DELETE /api/todos/:id`

**Response:**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2025-10-07T10:30:00.000Z",
    "updatedAt": "2025-10-07T10:30:00.000Z"
  }
}
```

## Testing with cURL

### Create a Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy groceries\",\"description\":\"Milk, eggs, bread\",\"completed\":false}"
```

### Get All Todos
```bash
curl http://localhost:3000/api/todos
```

### Get Todo by ID
```bash
curl http://localhost:3000/api/todos/1
```

### Update a Todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy groceries and cook\",\"completed\":true}"
```

### Delete a Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## Project Structure

```
logging-api/
├── controllers/
│   └── todoController.js    # Business logic for todos
├── routes/
│   └── todos.js             # Route definitions
├── logs/                    # Winston log files
├── index.js                 # Main application file
├── logger.js                # Winston logger configuration
├── package.json
└── README.md
```

## Architecture

The API follows the **MVC (Model-View-Controller)** pattern:

- **Routes** (`routes/todos.js`): Define API endpoints
- **Controllers** (`controllers/todoController.js`): Handle business logic
- **Models**: In-memory array (no database for now)
- **Middleware**: JSON parsing and request logging

## Error Handling

All endpoints include proper error handling and return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Server Error

## Logging

All requests and errors are logged using Winston to:
- Daily rotating log files in the `logs/` directory
- Console (in development mode)

## License

ISC

