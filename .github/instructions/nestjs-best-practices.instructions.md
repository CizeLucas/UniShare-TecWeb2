---
description: "Use when: NestJS development standards and best practices for scalable Node.js server-side applications in this repo."
applyTo: "**/*.ts, **/*.js, **/*.json, **/*.spec.ts, **/*.e2e-spec.ts"
---

# NestJS Development Best Practices

- Scope: Apply these rules for backend NestJS code under backend/. For frontend work, follow [frontend/AGENTS.md](frontend/AGENTS.md).

## Core principles

- Dependency injection: use @Injectable(), constructor injection, and interface-driven providers when possible.
- Modular architecture: build feature modules, avoid circular imports, and use shared modules for common utilities.
- Decorators and metadata: use @Controller, @Get, @Post, @UseGuards, @UseInterceptors, and @UsePipes.

## Project structure and naming

- Prefer feature modules under src/modules and shared code under src/common and src/shared.
- Naming:
  - Controllers: \*.controller.ts
  - Services: \*.service.ts
  - Modules: \*.module.ts
  - DTOs: \*.dto.ts
  - Entities: \*.entity.ts
  - Guards: \*.guard.ts
  - Interceptors: \*.interceptor.ts
  - Pipes: \*.pipe.ts
  - Filters: \*.filter.ts

Example:

```text
src/
  app.module.ts
  main.ts
  common/
    decorators/
    filters/
    guards/
    interceptors/
    pipes/
    interfaces/
  modules/
    users/
    auth/
  shared/
    services/
    constants/
```

## API patterns

- Controllers stay thin; delegate business logic to services.
- Use DTOs with class-validator and class-transformer for input validation.
- Prefer explicit return types in controllers and services.

Example controller:

```ts
@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: GetUsersDto): Promise<User[]> {
    return this.usersService.findAll(query);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() input: CreateUserDto): Promise<User> {
    return this.usersService.create(input);
  }
}
```

DTO example:

```ts
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain uppercase, lowercase and number",
  })
  password: string;
}
```

## Data access

- Use TypeORM entities and repositories when applicable.
- Keep query logic in repositories or services, not controllers.
- Use migrations for schema changes.

## Auth and authorization

- Prefer JWT with Passport strategies and guards.
- Use custom decorators plus a RolesGuard for RBAC.

## Error handling and logging

- Use global exception filters for consistent error responses.
- Use Nest Logger with meaningful context and log levels.

## Testing

- Unit test services with mocks.
- Use TestingModule for integration tests.
- Use supertest for e2e flows.

## Performance and security

- Validate inputs on all public endpoints.
- Use rate limiting where appropriate (for example, ThrottlerGuard).
- Use pagination for large lists and avoid heavy responses.

## Configuration

- Use @nestjs/config and validate env on startup.
- Never hardcode secrets; use env variables.

## Pitfalls to avoid

- Circular module dependencies
- Business logic in controllers
- Missing validation or error handling
- Manual instantiation instead of DI

## Project notes

- Backend scripts and commands: see [backend/README.md](backend/README.md).
