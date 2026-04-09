# Restaurant Backend

A Spring Boot REST API for restaurant management with JWT authentication and Oracle database integration.

## Features

- User registration and login with JWT authentication
- Menu item management
- Order management
- Cart functionality
- Oracle database integration

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Oracle Database

## Setup

1. Clone the repository
2. Update `src/main/resources/application.properties` with your Oracle database credentials:
   ```
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
   jwt.secret=your_jwt_secret_key
   ```
3. Run the application:
   ```
   mvn spring-boot:run
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Menu Items
- `GET /menu` - Get all menu items
- `POST /menu` - Add a new menu item (admin)
- `PUT /menu/{id}` - Update menu item (admin)
- `DELETE /menu/{id}` - Delete menu item (admin)

### Orders
- `GET /orders` - Get user's orders
- `POST /orders` - Place a new order
- `GET /orders/{id}` - Get order details

### Cart
- `GET /cart` - Get user's cart items
- `POST /cart` - Add item to cart
- `PUT /cart/{id}` - Update cart item quantity
- `DELETE /cart/{id}` - Remove item from cart

## Database Tables

- USERS
- MENU_ITEMS
- ORDERS
- ORDER_ITEMS
- CART

## Security

Uses JWT for authentication. Include the token in the Authorization header as `Bearer <token>` for protected endpoints.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.