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

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/auth/login`   | Login and get token |
| POST   | `/users/signup` | Create new user     |
| POST   | `/text/analyze` | Analyze input text  |

> All protected routes require JWT in `Authorization: Bearer <token>`

---

## 🧾 Logs

Logs are piped to Logstash and visualized in Kibana.

To view logs in the container:

```bash
docker logs -f <container-name>
```

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
