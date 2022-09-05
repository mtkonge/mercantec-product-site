# API documentation

## Auth

This app uses authentication this is done with a token as a cookie in the client side browser which is used for almost everything

The cookie is set at `/login`

Can be removed at `/logout`

The token is needed on all requests with an `--auth` flag

## Users

### User model

```ts
{
    id: number,
    username: string,
    admin: boolean
}
```

### POST /user/register

#### Request

```ts
{
    username: string,
    password: string
}
```

#### Response

```ts
{

    response: "OK" | "Username occupied" | "invalid username/password" | "Missing input",
    userId?: number //User.id

}
```

### POST /user/login

Checks login credentials and creates a new session

#### Request

```typescript
{
    username: string,
    password: string
}
```

#### Response

```typescript
{
    response: "Ok" | "Wrong username/password",
    id?: number, // User.id
}
```

Adds a `token` cookie upon success.

### POST /user/logout

logout a token/user

#### Response

clears cookie token

```typescript
{
    response: "Ok";
}
```

### GET /user/one/:id --auth

#### Response

```typescript
{
    response: "Unauthorized" | "Ok" | "User doesn't exist",
    id?: number,
    username?: string,
    admin?: boolean
}
```

### GET /user/data --auth

#### Response

```typescript
{
    response: "Unauthorized" | "Ok" | "User doesn't exist",
    data: User?,
}
```

## Product

### Product model

```typescript
{
    title: string,
    content: string,
    image: string,
    id: number
}
```

### POST /product/create

#### Request

```typescript
{
    data: Product;
}
```

#### Response

```typescript
{
    msg: "Unauthorized" | "Ok" | "Title invalid" | "Missing input",
}
```

### POST /product/remove/:id

#### Request

```typescript
{
    id: number;
}
```

#### Response

```typescript
{
    msg: "Unautorized" | "Ok" | "Invalid product",
}
```

### GET /product/one/:id

#### Request

```typescript
{
    id: number;
}
```

#### Response

```typescript
{
    msg: "Ok" | "Invalid product",
    data?: Product
}
```

### GET /product/all

#### Response

```typescript
{
    msg: "Ok",
    data: Product[]
}
```

## Orders

### Order Model

```typescript
{
    id: number,
    productId: number,
    firstName: string,
    lastName: string,
    mail: string,
    phone: string,
    details: string,
    date: Date,
    archived: boolean
}
```

### GET /order/all

#### Response

```typescript
{
    msg: "Ok" | "Unauthorized",
    data?: Order[]
}
```

### POST /order/create

#### Request

```typescript
{
    data: Omit<Order, "date", "archived">
}
```

#### Response

```typescript
{
    msg: "Ok" | "Details field too long" | "Not logged in";
}
```

### POST /order/remove/:id

#### Request

```typescript
{
    id: number;
}
```

#### Response

```typescript
{
    msg: "Ok" | "Unauthorized" | "Invalid order";
}
```

### POST /order/archive/:id

#### Request

```typescript
{
    id: number;
}
```

#### Response

```typescript
{
    msg: "Ok" | "Unauthorized" | "Invalid order";
}
```

### POST /order/unarchive/:id

#### Request

```typescript
{
    id: number;
}
```

#### Response

```typescript
{
    msg: "Ok" | "Unauthorized" | "Invalid order";
}
```
