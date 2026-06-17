# J-Track

A microservices-based job tracking platform with async event-driven email notifications powered by Apache Kafka.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Clients                                    │
│                  (React Frontend :3000)                              │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTP
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        API Gateway / Load Balancer                   │
└─────┬──────────────────────┬──────────────────────┬──────────────────┘
      │                      │                      │
      ▼                      ▼                      ▼
┌──────────┐         ┌────────────┐         ┌────────────┐
│  Auth    │         │   Job      │         │   Utils    │
│  Service │         │  Service   │         │  Service   │
│  :6000   │         │  :7004     │         │  :6001     │
└────┬─────┘         └─────┬──────┘         └─────┬──────┘
     │                     │                      │
     │   ┌──────────────────────────────────────┐ │
     ├───┤            PostgreSQL                 ├─┘
     │   │         (Neon / Serverless)           │
     │   └──────────────────────────────────────┘ │
     │                     │                      │
     │   ┌──────────────────────────────────────┐ │
     ├───┤            Redis                     ├─┘
     │   │      (Upstash / Caching)             │
     │   └──────────────────────────────────────┘ │
     │                     │                      │
     │   ┌──────────────────────────────────────┐ │
     └───┤        Apache Kafka                  ├─┘
         │     (Async Event Bus)                │
         └──────────────────────────────────────┘
```

## Event-Driven Email Flow

```
                        ┌──────────────┐
  Forgot Password ──────►              │
  (Auth Service)         │   KAFKA     │
                         │             │
  Application Status ───►│  send-mail  ├────► Utils Service ────► Nodemailer ────► Email
  (Job Service)          │   topic     │      (Consumer)         (SMTP)
                         │             │
  Failed Messages ──────►│ send-mail-  │
  (DLQ)                  │   dlq       │
                        └──────────────┘
```

## Services

| Service | Port | Role | Kafka Role |
|---------|------|------|------------|
| **auth** | 6000 | User auth, password reset | Producer (`send-mail`) |
| **jobservice** | 7004 | Jobs, applications, companies | Producer (`send-mail`) |
| **user** | 7001 | Profile management | None |
| **utils** | 6001 | File upload, AI analysis, email dispatch | Consumer (`send-mail`) + DLQ producer |

## Kafka Configuration

All Kafka settings are environment-driven:

| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_BROKER` | `localhost:9092` | Comma-separated broker list |
| `KAFKA_SSL` | `false` | Enable TLS |
| `KAFKA_SASL_MECHANISM` | — | SASL mechanism (`plain`, `scram-sha-256`, `scram-sha-512`) |
| `KAFKA_SASL_USERNAME` | — | SASL username |
| `KAFKA_SASL_PASSWORD` | — | SASL password |
| `KAFKA_CONNECTION_TIMEOUT` | `10000` | Connection timeout (ms) |
| `KAFKA_AUTH_TIMEOUT` | `10000` | Auth timeout (ms) |
| `KAFKA_RETRY_COUNT` | `10` | KafkaJS retry count |
| `KAFKA_RETRY_INITIAL_TIME` | `300` | Retry backoff base (ms) |
| `KAFKA_CONNECT_RETRIES` | `5` | Producer connection retries |
| `KAFKA_TOPIC_PARTITIONS` | `3` | Partitions for auto-created topics |
| `KAFKA_TOPIC_REPLICATION_FACTOR` | `1` | Replication factor |
| `KAFKA_CONSUMER_GROUP` | `mail-service-group` | Consumer group ID |
| `KAFKA_MAIL_TOPIC` | `send-mail` | Mail topic name |
| `KAFKA_DLQ_TOPIC` | `send-mail-dlq` | Dead-letter queue topic |

## Production Features

### Kafka Producer (`packages/shared/src/kafka/producer.ts`)
- **Singleton registry**: One producer instance per `clientId` across the process
- **Exponential backoff**: Retries connection with `2^n` backoff (up to 15s)
- **Deduplicated concurrent connects**: Multiple `connect()` calls share the same pending promise
- **SASL/SSL**: Full support for authenticated, encrypted connections
- **Health check**: `healthCheck()` returns broker metadata and connection status
- **Graceful disconnect**: Clean shutdown via `disconnect()`

### Kafka Consumer (`services/utils/src/consumer.ts`)
- **Dead-letter queue**: Failed messages are published to `send-mail-dlq` with failure reason and timestamp
- **Message validation**: Missing fields are caught and routed to DLQ
- **Retry with backoff**: Email sending retries up to `MAIL_SEND_RETRIES` times with 1s × attempt delay
- **Graceful shutdown**: `stop()` drains in-flight messages before disconnecting
- **Configurable SMTP**: All mail transport settings are env-configurable

### Topic Provisioning (`packages/shared/src/kafka/topic.ts`)
Topics are explicitly provisioned at service startup (not auto-created on first produce):
- `send-mail` — 3 partitions (configurable via `KAFKA_TOPIC_PARTITIONS`)
- `send-mail-dlq` — Dead-letter queue for failed mail deliveries

### Health Checks
Each service exposes `GET /health` returning:
```json
{
  "service": "auth-service",
  "status": "healthy",
  "kafka": {
    "connected": true,
    "clientId": "auth-service",
    "metadata": { "brokers": 1, "topics": ["send-mail"] }
  },
  "database": "connected",
  "redis": "connected"
}
```

### Graceful Shutdown
All services handle `SIGTERM`/`SIGINT`:
1. Stop accepting new requests
2. Disconnect Kafka producer/consumer
3. Quit Redis connection
4. Close database pool
5. Exit

## Project Structure

```
j-track/
├── pnpm-workspace.yaml          # pnpm workspace definition
├── package.json                  # Root scripts (build, dev, test)
├── .npmrc                        # pnpm configuration
├── packages/
│   └── shared/                   # @jtrack/shared — shared library
├── services/
│   ├── auth/                     # Authentication service
│   ├── jobservice/               # Job management service
│   ├── user/                     # User profile service
│   └── utils/                    # Utility service (AI, upload, email)
└── frontend/                     # React SPA (separate)
```

## pnpm Workspace

This monorepo uses [pnpm workspaces](https://pnpm.io/workspaces). The `@jtrack/shared` package is symlinked into each service via the `workspace:*` protocol — no more `file:../../` relative path hacks.

Key benefits:
- **Single `pnpm install`** from root installs every service + shared package
- **Shared dependency deduplication** — one copy of each package in pnpm's store
- **Strict `node_modules`** — only declared dependencies are accessible
- **Workspace protocol** — `"@jtrack/shared": "workspace:*"` links to local source

## Getting Started

### Prerequisites
- **Node.js** 20+
- **pnpm** 9+ (`npm install -g pnpm`)
- **Apache Kafka** 3.x (e.g., `docker run -d -p 9092:9092 apache/kafka:latest`)
- **PostgreSQL** 15+ (or [Neon](https://neon.tech))
- **Redis** 7+ (or [Upstash](https://upstash.com))

### Install

```bash
# Install all dependencies (all services + shared package)
pnpm install

# Build the shared package first
pnpm build:shared
```

### Run (Development)

Start each service in a separate terminal:

```bash
pnpm dev:auth       # Auth service → :6000
pnpm dev:job        # Job service  → :7004
pnpm dev:user       # User service → :7001
pnpm dev:utils      # Utils service → :6001
```

Or run all services in parallel:

```bash
pnpm dev
```

### Run (Production)

```bash
# Build everything
pnpm build

# Start individual services
pnpm --filter auth start
pnpm --filter jobservice start
pnpm --filter user start
pnpm --filter utils start
```

### Type Checking

```bash
pnpm -r typecheck       # Check all services
pnpm -r exec tsc --noEmit  # Alternative
```

### Testing

```bash
pnpm test               # Run all tests across workspace
pnpm --filter utils test  # Test a specific service only
```

### Environment Variables

Each service has a `.env` file. Key variables:

```
# Kafka (all services)
KAFKA_BROKER=localhost:9092

# Auth service
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_RESET_SECRET=...

# Utils service (email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```
