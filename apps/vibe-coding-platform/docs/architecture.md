# Vibe Coding Platform - Architecture

## System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React UI]
        State[Zustand Store]
        Monaco[Monaco Editor]
    end

    subgraph "API Layer"
        NextAPI[Next.js API Routes]
        Auth[NextAuth.js]
        RateLimit[Rate Limiter]
    end

    subgraph "Service Layer"
        AIGateway[AI Gateway]
        SandboxSvc[Sandbox Service]
        ProjectSvc[Project Service]
    end

    subgraph "Data Layer"
        Prisma[Prisma ORM]
        SQLite[(SQLite DB)]
        Redis[(Redis Cache)]
    end

    subgraph "External Services"
        Claude[Claude API]
        GPT[OpenAI API]
        Gemini[Gemini API]
        Sandbox[Vercel Sandbox]
    end

    UI --> State
    UI --> Monaco
    State --> NextAPI
    NextAPI --> Auth
    NextAPI --> RateLimit
    Auth --> Prisma
    NextAPI --> AIGateway
    NextAPI --> SandboxSvc
    NextAPI --> ProjectSvc
    AIGateway --> Claude
    AIGateway --> GPT
    AIGateway --> Gemini
    SandboxSvc --> Sandbox
    ProjectSvc --> Prisma
    Prisma --> SQLite
    RateLimit --> Redis
```

## Component Architecture

```mermaid
graph LR
    subgraph "Pages"
        Home["/"]
        Login["/login"]
        Register["/register"]
        Dashboard["/dashboard"]
        Project["/projects/[id]"]
    end

    subgraph "Components"
        Chat[ChatInterface]
        FileExp[FileExplorer]
        Editor[CodeEditor]
        Preview[Preview]
        Templates[TemplatePicker]
    end

    subgraph "Hooks"
        useChat[useChat]
        useSandbox[useSandboxStore]
        useAuth[useSession]
    end

    Home --> Chat
    Home --> FileExp
    Home --> Editor
    Home --> Preview
    Dashboard --> Templates
    Project --> Editor
    Chat --> useChat
    FileExp --> useSandbox
    Editor --> useSandbox
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant AI
    participant Sandbox

    User->>UI: Enter prompt
    UI->>API: POST /api/chat
    API->>AI: Stream request
    AI-->>API: Stream response
    API-->>UI: SSE events

    Note over UI,API: File generation
    UI->>API: Create files
    API->>Sandbox: Upload files
    Sandbox-->>API: Sandbox URL
    API-->>UI: Preview URL
    UI->>User: Show preview
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Auth
    participant DB

    User->>UI: Login request
    UI->>Auth: POST /api/auth/signin
    Auth->>DB: Verify credentials
    DB-->>Auth: User data
    Auth-->>UI: JWT token
    UI->>User: Redirect to dashboard

    Note over UI,Auth: Protected routes
    UI->>Auth: Check session
    Auth-->>UI: Session valid
    UI->>User: Show content
```

## Database Schema

```mermaid
erDiagram
    User ||--o{ Project : owns
    User ||--o{ Account : has
    User ||--o{ Session : has
    Project ||--o{ Conversation : contains
    Project ||--o{ GeneratedFile : contains
    Conversation ||--o{ Message : contains

    User {
        string id PK
        string email UK
        string name
        string password
        datetime createdAt
    }

    Project {
        string id PK
        string name
        string description
        string sandboxId
        string userId FK
        datetime createdAt
    }

    Conversation {
        string id PK
        string title
        string projectId FK
        datetime createdAt
    }

    Message {
        string id PK
        string role
        string content
        string conversationId FK
        datetime createdAt
    }

    GeneratedFile {
        string id PK
        string path
        string content
        string projectId FK
    }

    Template {
        string id PK
        string name
        string category
        string framework
        string prompt
    }
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Vercel Edge Network"
        Edge[Edge Functions]
        Static[Static Assets]
    end

    subgraph "Vercel Serverless"
        API[API Routes]
        SSR[Server Rendering]
    end

    subgraph "External"
        DB[(Database)]
        Redis[(Redis)]
        AI[AI Providers]
    end

    Client[Browser] --> Edge
    Edge --> Static
    Edge --> API
    API --> SSR
    API --> DB
    API --> Redis
    API --> AI
```

## Security Layers

```mermaid
graph TB
    Request[Incoming Request]

    subgraph "Security Middleware"
        RateLimit[Rate Limiting]
        Auth[Authentication]
        CSRF[CSRF Protection]
        Validation[Input Validation]
    end

    subgraph "Application"
        Handler[Request Handler]
        Business[Business Logic]
        Data[Data Access]
    end

    Request --> RateLimit
    RateLimit --> Auth
    Auth --> CSRF
    CSRF --> Validation
    Validation --> Handler
    Handler --> Business
    Business --> Data
```

## Key Design Decisions

### 1. Monolithic Architecture
- Single Next.js application for simplicity
- API routes co-located with frontend
- Easy deployment to Vercel

### 2. SQLite Database
- Zero configuration required
- Easy migration to PostgreSQL later
- Perfect for development and small deployments

### 3. Server-Sent Events for AI Streaming
- Real-time token streaming
- Better UX than polling
- Efficient resource usage

### 4. Zustand for State Management
- Lightweight and simple
- No boilerplate
- TypeScript friendly

### 5. Monaco Editor Integration
- Full IDE experience
- Syntax highlighting for all languages
- Autocomplete support

## Performance Optimizations

1. **Code Splitting** - Dynamic imports for Monaco Editor
2. **Caching** - Redis for rate limiting, API responses
3. **Streaming** - SSE for AI responses
4. **Edge Caching** - Static assets on Vercel CDN
5. **Database Indexing** - Optimized queries with Prisma

## Scalability Considerations

1. **Horizontal Scaling** - Serverless architecture scales automatically
2. **Database** - Migrate to PostgreSQL + connection pooling
3. **Caching** - Add Redis for session storage
4. **CDN** - Static assets already cached
5. **Rate Limiting** - Per-user limits prevent abuse
