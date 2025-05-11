# 🧠 Text Analyzer API

A NestJS-based text analysis microservice with Redis caching, MongoDB storage, JWT authentication, and ELK integration for logging and observability. Deployable via Docker Compose or Kubernetes.

---

## 🚀 Features

- Text analysis API
- JWT-based authentication
- MongoDB for persistence
- Redis for caching
- ELK stack logging (Logstash, Elasticsearch, Kibana)
- TDD with Jest
- Containerized with Docker & Docker Compose
- Kubernetes-ready

---

## 🛠️ Requirements

- Node.js 18+
- Docker + Docker Compose
- kubectl
- (Optional) Minikube or a K8s cluster
- Helm (optional)

---

## 📦 Installation (Development)

```bash
npm install
cp .env.example .env
````

---

## 🧪 Run with Hot Reload (Dev Mode)

```bash
npm run start:dev
```

---

## 🧪 Run Tests

```bash
npm run test
# For test coverage
npm run test:cov
```

---

## 🐳 Docker Compose Setup

To run MongoDB, Redis, ELK, Kibana, and your app locally:

```bash
docker-compose up --build
```

If you wanna run locally:
```
docker compose up -d elasticsearch logstash kibana filebeat mongodb redis
```

Access:

* App: `http://localhost:3000`
* Kibana: `http://localhost:5601`
* MongoDB: `localhost:27017`
* Redis: `localhost:6379`

---

## 📄 API Endpoints

All secured endpoints require a JWT token in the `Authorization` header like so:
`Authorization: Bearer <token>`

### 🔐 Auth

| Method | Endpoint       | Description                      |
| ------ | -------------- | -------------------------------- |
| POST   | `/auth/login`  | Login with username and password |
| POST   | `/user/signup` | Register a new user              |

---

### 🧠 Text Analysis

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/texts`                   | Submit text for analysis |
| GET    | `/texts/:id/characters`    | Get character count      |
| GET    | `/texts/:id/words`         | Get word count           |
| GET    | `/texts/:id/sentences`     | Get sentence count       |
| GET    | `/texts/:id/paragraphs`    | Get paragraph count      |
| GET    | `/texts/:id/longest-words` | Get longest words list   |

> Replace `:id` with the actual text ID returned from the POST `/texts` endpoint.


## 📊 Log Visualization with Kibana

This project uses the **ELK stack (Elasticsearch, Logstash, and Kibana)** to collect, process, and visualize logs from the `text-analyzer` service.

### ✅ Prerequisites

Make sure the containers are up and running:

```bash
docker-compose up --build
```

### 🔍 Accessing Logs via Kibana

Once the stack is running, you can view and explore logs in **Kibana**:

* **Kibana URL**: [http://localhost:5601](http://localhost:5601)

### 🚦 How It Works

* `Filebeat` monitors the logs directory (`./logs`) and Docker container logs.
* Logs are forwarded to `Logstash` for parsing and enrichment.
* `Logstash` sends the processed logs to `Elasticsearch`.
* `Kibana` visualizes the logs stored in `Elasticsearch`.

### 📁 Log Storage Location

Logs from the `text-analyzer` service are mounted locally in:

```bash
./logs
```

Ensure your application writes logs to this directory or to stdout/stderr (which Filebeat is also configured to capture).

### 📈 Creating a Log Dashboard

1. Open Kibana at [http://localhost:5601](http://localhost:5601).
2. Navigate to **Discover**.
3. Select or create an index pattern (e.g., `filebeat-*`).
4. You can now filter, search, and view real-time logs.

### 🛠️ Troubleshooting

* If you don’t see any logs in Kibana, ensure:

  * The `./logs` directory exists and contains files.
  * Filebeat and Logstash services are running.
  * Your app is writing logs to the correct location.

---

## ☸️ Kubernetes Deployment

### Step 1: Build & Push Image

```bash
docker build -t your-dockerhub-username/text-analyzer:latest .
docker push your-dockerhub-username/text-analyzer:latest
```

### Step 2: Create Secrets

```bash
kubectl create namespace text-analyzer

kubectl create secret generic mongo-secret \
  --from-literal=MONGO_USER=mongoUser \
  --from-literal=MONGO_PASS=secretPass \
  -n text-analyzer

kubectl create secret generic redis-secret \
  --from-literal=REDIS_HOST=redis \
  --from-literal=REDIS_PORT=6379 \
  -n text-analyzer
```

### Step 3: Deploy App + Dependencies

```bash
kubectl apply -f k8s/deploy.yaml
```

You can use Helm or Kustomize for advanced deployment configuration (optional).

---

## 📂 Project Structure

```
src/
├── application/       # Business logic
├── core/              # Domain entities and services
├── infrastructure/    # MongoDB, Redis, etc.
├── presentation/      # Controllers, modules
├── shared/            # Config, logger, etc.
└── main.ts            # Entry point
```

---

## ✅ To-Do

* [x] JWT Auth
* [x] User Service
* [x] ELK Logging
* [x] Redis Cache
* [x] MongoDB Store
* [x] Kubernetes Deployment
* [x] Rate limiting / throttling
* [ ] CI/CD Integration (GitHub Actions)
