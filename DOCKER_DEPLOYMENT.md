# TechConnect Docker Deployment Guide

## Architecture Overview

This multi-container Docker setup includes:

- **PostgreSQL Database** (port 5432) - Shared database for all services
- **Discovery Server** (port 8761) - Eureka service registry
- **Opportunity Service** (port 8081) - Microservice for managing opportunities
- **API Gateway** (port 8080) - Spring Cloud Gateway with service discovery
- **Web Application** (port 80) - React frontend served by nginx

## Service Communication Flow

```
User → Web (nginx:80) → API Gateway (8080) → Opportunity Service (8081) → PostgreSQL (5432)
                                   ↓
                            Discovery Server (8761)
```

## Prerequisites

- Docker and Docker Compose installed
- All four repositories cloned in the same parent directory:
  ```
  parent-directory/
  ├── TechConnect-Web-Application/
  ├── TechConnect-API-Gateway/
  ├── TechConnect-Discovery-Server/
  └── TechConnect-Opportunity-Service/
  ```

## Quick Start

1. Navigate to the Web Application directory:
   ```bash
   cd TechConnect-Web-Application
   ```

2. Start all services:
   ```bash
   docker-compose up -d
   ```

3. Monitor startup (wait for all services to be healthy):
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

4. Access the services:
   - **Web Application**: http://localhost
   - **API Gateway**: http://localhost:8080
   - **Discovery Server**: http://localhost:8761
   - **Opportunity Service**: http://localhost:8081

## Service Startup Order

The docker-compose configuration ensures proper startup order with health checks:

1. PostgreSQL starts first
2. Discovery Server starts and registers
3. Opportunity Service starts, connects to DB and registers with Eureka
4. API Gateway starts and discovers services via Eureka
5. Web frontend starts and proxies API calls to the gateway

## Key Configuration Changes Made

### 1. Service Discovery
- API Gateway now uses Eureka for service discovery (`lb://opportunity-service`)
- All microservices register with Eureka discovery server
- Services use service names instead of hardcoded URLs

### 2. Frontend API Routing
- Nginx proxies `/api/*` requests to the API Gateway
- Frontend makes relative API calls (e.g., `/api/v1/opportunities`)
- No CORS issues as everything is served from the same origin

### 3. Database Configuration
- PostgreSQL container with persistent volume
- Database credentials passed via environment variables
- Connection URL: `jdbc:postgresql://db:5432/techconnect`

### 4. Network Configuration
- All services on the same Docker bridge network (`techconnect-network`)
- Services communicate using container names as hostnames
- Ports exposed to host for direct access during development

## Environment Variables

You can customize the following environment variables in docker-compose.yml:

```yaml
# Database
POSTGRES_DB: techconnect
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres

# Eureka
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/

# Database connection
SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/techconnect
```

## Useful Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f opportunity-service

# Rebuild and restart a specific service
docker-compose up -d --build api-gateway

# Check service health
docker-compose ps

# Remove all containers and volumes
docker-compose down -v
```

## Troubleshooting

### Service not connecting to database
- Check if PostgreSQL container is healthy: `docker-compose ps`
- Verify database credentials in application.yml files
- Check logs: `docker-compose logs db`

### Service not registering with Eureka
- Verify discovery server is running: http://localhost:8761
- Check service logs for connection errors
- Ensure EUREKA_CLIENT_SERVICEURL_DEFAULTZONE is correct

### Frontend can't reach API
- Check nginx.conf proxy configuration
- Verify API Gateway is running and healthy
- Check browser console for errors
- Test API directly: `curl http://localhost:8080/actuator/health`

### Services starting in wrong order
- Docker Compose health checks should handle this
- If issues persist, manually start in order:
  ```bash
  docker-compose up -d db
  docker-compose up -d discovery-server
  docker-compose up -d opportunity-service
  docker-compose up -d api-gateway
  docker-compose up -d web
  ```

## Development Mode

For local development without Docker:

1. Start PostgreSQL locally or use Docker:
   ```bash
   docker run -d -p 5432:5432 -e POSTGRES_DB=techconnect -e POSTGRES_PASSWORD=postgres postgres:15-alpine
   ```

2. Update application.yml files to use `localhost` instead of `db`

3. Start services in order:
   - Discovery Server (port 8761)
   - Opportunity Service (port 8081)
   - API Gateway (port 8080)
   - Web Application (port 5173 for dev server)

## Production Considerations

Before deploying to production:

1. **Security**:
   - Change database passwords
   - Update JWT secret in API Gateway
   - Use environment-specific configuration files
   - Enable HTTPS/TLS

2. **Performance**:
   - Increase JVM heap size for Java services
   - Configure connection pooling
   - Set up database indexes
   - Enable caching where appropriate

3. **Monitoring**:
   - Configure centralized logging
   - Set up health check monitoring
   - Enable metrics collection
   - Configure alerts

4. **Scaling**:
   - Use Docker Swarm or Kubernetes for orchestration
   - Configure multiple replicas for services
   - Set up load balancing
   - Use managed database service
