# Documentação da API: Autenticação & Usuários

Este documento descreve os endpoints de autenticação e gerenciamento de usuários disponíveis no backend, baseados na implementação dos controllers `AuthController` e `UsersController`. Ele foi criado para auxiliar a equipe de frontend na integração desses serviços.

## Tipos Compartilhados & Enums

### `PixTipo`
Usado para identificar o tipo de chave PIX de um usuário. Os valores válidos são:
- `"CPF"`
- `"EMAIL"`
- `"TELEFONE"`
- `"ALEATORIA"`

---

## 🔐 Endpoints de Autenticação (Auth)

### 1. Registrar Usuário
Cria uma nova conta de usuário. 
> [!NOTE]
> Este endpoint não faz o login automático do usuário. Após um registro bem-sucedido, o cliente deve chamar o endpoint de login para obter um token de acesso.

- **Endpoint:** `POST /auth/register`
- **Autenticação Necessária:** Não

#### Corpo da Requisição (`application/json`)
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "senhaforte123",
  "pixKey": "john.doe@example.com", 
  "pixKeyType": "EMAIL" 
}
```
*(Nota: `pixKey` e `pixKeyType` são opcionais.)*

#### Respostas
- **`201 Created`** - Usuário registrado com sucesso.
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```
- **`400 Bad Request`** - Falha na validação (ex: campos obrigatórios ausentes, formato de email inválido, tipo de PIX inválido).
  ```json
  {
    "message": "Validation failed.",
    "errors": ["..."]
  }
  ```
- **`409 Conflict`** - Email já está em uso.
  ```json
  {
    "message": "Email already in use.",
    "error": "Conflict",
    "statusCode": 409
  }
  ```

### 2. Login
Autentica um usuário e retorna um token de acesso JWT.

- **Endpoint:** `POST /auth/login`
- **Autenticação Necessária:** Não

#### Corpo da Requisição (`application/json`)
```json
{
  "email": "john.doe@example.com",
  "password": "senhaforte123"
}
```

#### Respostas
- **`201 Created`** - Autenticado com sucesso. *(O NestJS usa 201 como padrão para endpoints POST, a menos que especificado de outra forma).*
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **`401 Unauthorized`** - Credenciais inválidas (email não encontrado ou senha incorreta).
  ```json
  {
    "message": "Unauthorized",
    "statusCode": 401
  }
  ```

---

## 👤 Endpoints de Usuários (Users)

Todas as requisições para as rotas `/users` exigem um token JWT válido.
> [!IMPORTANT]
> O token deve ser enviado no cabeçalho `Authorization` como um token Bearer:
> `Authorization: Bearer <access_token>`

### 3. Obter Perfil do Usuário Atual
Recupera o perfil do usuário atualmente autenticado com base no token JWT fornecido.

- **Endpoint:** `GET /users/me`
- **Autenticação Necessária:** Sim (JWT)

#### Respostas
- **`200 OK`** - Retorna o perfil público do usuário.
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "pixKey": "john.doe@example.com",
    "pixKeyType": "EMAIL",
    "createdAt": "2023-10-27T10:00:00.000Z"
  }
  ```
- **`401 Unauthorized`** - Token JWT ausente ou inválido.
- **`404 Not Found`** - O usuário associado ao token não existe mais no banco de dados.

### 4. Atualizar Perfil do Usuário Atual
Atualiza parcialmente o perfil do usuário autenticado. Apenas `name`, `pixKey` e `pixKeyType` podem ser atualizados através deste endpoint.

- **Endpoint:** `PATCH /users/me`
- **Autenticação Necessária:** Sim (JWT)

#### Corpo da Requisição (`application/json`)
Todos os campos são opcionais. Envie apenas os campos que deseja atualizar.
```json
{
  "name": "John Doe Atualizado",
  "pixKey": "12345678909",
  "pixKeyType": "CPF"
}
```

#### Respostas
- **`200 OK`** - Perfil atualizado com sucesso. Retorna o perfil atualizado.
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe Atualizado",
    "email": "john.doe@example.com",
    "pixKey": "12345678909",
    "pixKeyType": "CPF",
    "createdAt": "2023-10-27T10:00:00.000Z"
  }
  ```
- **`400 Bad Request`** - Falha na validação (ex: tipo de PIX inválido).
- **`401 Unauthorized`** - Token JWT ausente ou inválido.
- **`404 Not Found`** - O usuário associado ao token não existe mais.
