# Board CRUD API

A complete CRUD (Create, Read, Update, Delete) implementation for a board system using NestJS, following the company's technical constraints.

## Technical Stack

- **Server Framework**: NestJS (with Express platform)
- **File Database**: node-json-db (v2.4.2)
- **Test Library**: Jest
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript
- **HTTP Communication**: NestJS handles all HTTP requests/responses

## Project Structure

```
src/board/
├── database/
│   └── board.database.ts      # File database service using node-json-db
├── dto/
│   ├── create-board.dto.ts    # DTO for creating boards with validation
│   └── update-board.dto.ts    # DTO for updating boards
├── entities/
│   └── board.entity.ts        # Board entity definition
├── board.controller.ts        # REST API endpoints
├── board.service.ts           # Business logic
├── board.service.spec.ts      # Unit tests
└── board.module.ts            # Module configuration
```

## API Endpoints

### Create Board
- **POST** `/board`
- **Body**:
  ```json
  {
    "title": "Board Title",
    "content": "Board content here",
    "author": "Author Name"
  }
  ```
- **Validation**:
  - `title`: 2-100 characters, required
  - `content`: 1-5000 characters, required
  - `author`: 2-50 characters, required

### Get All Boards
- **GET** `/board`
- Returns array of all boards

### Get Single Board
- **GET** `/board/:id`
- Returns single board or 404 if not found

### Update Board
- **PATCH** `/board/:id`
- **Body**: Partial board data (all fields optional)
- Returns updated board or 404 if not found

### Delete Board
- **DELETE** `/board/:id`
- Returns 200 on success or 404 if not found

## Data Model

```typescript
{
  id: number;           // Auto-incremented
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Unit Tests
```bash
npm test -- board.service.spec
```

### E2E Tests
```bash
npm run test:e2e -- board.e2e-spec
```

### All Tests
```bash
npm test
```

## Database

- Uses `node-json-db` for file-based storage
- Data persisted in `boardDB.json` at project root
- Async operations with Promise-based API
- Auto-initialization on first run

## Test Coverage

### Unit Tests (10 tests)
- ✓ Create board
- ✓ Auto-increment ID
- ✓ Find all boards
- ✓ Find board by ID
- ✓ Update board
- ✓ Delete board
- ✓ Error handling (NotFoundException)

### E2E Tests (13 tests)
- ✓ Create board with validation
- ✓ Validate required fields
- ✓ Validate field lengths
- ✓ Reject unknown properties
- ✓ Get all boards
- ✓ Get single board
- ✓ Update board (full and partial)
- ✓ Delete board
- ✓ 404 error handling

## Key Implementation Details

1. **Async/Await**: All database operations use async/await for proper Promise handling
2. **Validation**: Input validation using class-validator decorators
3. **Error Handling**: Proper HTTP status codes (404 for not found)
4. **Clean Architecture**: Separation of concerns (Controller → Service → Database)
5. **Type Safety**: Full TypeScript implementation with proper typing

## Future Enhancements (Advanced Practice)

For race condition practice, consider implementing:
- First-come-first-served coupon system
- Concurrent booking/reservation system
- Stock management with inventory limits
- Rate limiting with counters

These would require:
- Transaction-like operations
- Optimistic/Pessimistic locking
- Queue management
- Atomic operations
