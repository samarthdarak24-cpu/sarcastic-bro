"""
ODOP AI Service Deployment Guide
Production-ready deployment instructions for multiple environments
"""

# ============================================================================
# ODOP AI SERVICE - DEPLOYMENT GUIDE
# ============================================================================

## Quick Reference

Service: ODOP AI Service v1.0.0
Location: apps/ai-service/
Technology: FastAPI + Python 3.9+
API Port: 8000 (configurable)

## Prerequisites

- Python 3.9 or higher
- pip or conda package manager
- Docker & Docker Compose (for containerized deployment)
- 2GB RAM minimum, 4GB recommended
- 500MB disk space

## Development Setup

```bash
cd apps/ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env

# Run development server
python main.py
```

Server will be available at: http://localhost:8000

## Testing

### Option 1: Run Integration Tests
```bash
python tests.py
```

### Option 2: Use Curl Examples
```bash
chmod +x test-api.sh
./test-api.sh
```

### Option 3: Use Interactive Documentation
- Visit: http://localhost:8000/docs (Swagger UI)
- Visit: http://localhost:8000/redoc (ReDoc)

## Local Docker Deployment

### Build Image
```bash
docker build -t odop-ai-service:1.0.0 .
```

### Run Container
```bash
docker run -d \
  --name odop-ai-service \
  -p 8000:8000 \
  -e SERVER_HOST=0.0.0.0 \
  -e SERVER_PORT=8000 \
  -e LOG_LEVEL=INFO \
  odop-ai-service:1.0.0
```

### Check Logs
```bash
docker logs odop-ai-service
docker logs -f odop-ai-service  # Follow logs
```

### Stop Container
```bash
docker stop odop-ai-service
docker rm odop-ai-service
```

## Docker Compose Deployment

### From Project Root
```bash
cd docker
docker-compose up ai-service
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs ai-service
docker-compose logs -f ai-service  # Follow
```

## Production Deployment on Linux

### 1. System Setup
```bash
sudo useradd -m -s /bin/bash ai-service
sudo mkdir -p /opt/odop-ai-service
sudo chown ai-service:ai-service /opt/odop-ai-service
```

### 2. Copy Application
```bash
sudo cp -r apps/ai-service/* /opt/odop-ai-service/
```

### 3. Install Dependencies
```bash
cd /opt/odop-ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Create Systemd Service
```bash
sudo tee /etc/systemd/system/odop-ai-service.service > /dev/null << EOF
[Unit]
Description=ODOP AI Service
After=network.target

[Service]
Type=notify
User=ai-service
WorkingDirectory=/opt/odop-ai-service
Environment="PATH=/opt/odop-ai-service/venv/bin"
ExecStart=/opt/odop-ai-service/venv/bin/gunicorn \\
    main:app \\
    --workers 4 \\
    --worker-class uvicorn.workers.UvicornWorker \\
    --bind 0.0.0.0:8000 \\
    --timeout 60 \\
    --access-logfile - \\
    --error-logfile -

Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

### 5. Enable and Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable odop-ai-service
sudo systemctl start odop-ai-service
```

### 6. Verify Status
```bash
sudo systemctl status odop-ai-service
curl http://localhost:8000/health
```

### 7. View Logs
```bash
sudo journalctl -u odop-ai-service -f
```

## Nginx Reverse Proxy Configuration

```nginx
upstream ai_service {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name ai-service.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ai-service.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/ai-service.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ai-service.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types application/json text/plain;

    # Proxy configuration
    location / {
        proxy_pass http://ai_service;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```

## Kubernetes Deployment

### 1. Build and Push Image
```bash
docker build -t registry.example.com/odop-ai-service:1.0.0 .
docker push registry.example.com/odop-ai-service:1.0.0
```

### 2. Create Kubernetes Deployment YAML
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: odop-ai-service
  labels:
    app: odop-ai-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: odop-ai-service
  template:
    metadata:
      labels:
        app: odop-ai-service
    spec:
      containers:
      - name: api
        image: registry.example.com/odop-ai-service:1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: SERVER_HOST
          value: "0.0.0.0"
        - name: SERVER_PORT
          value: "8000"
        - name: LOG_LEVEL
          value: "INFO"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: odop-ai-service
spec:
  selector:
    app: odop-ai-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

### 3. Deploy to Kubernetes
```bash
kubectl apply -f deployment.yaml
```

### 4. Monitor Deployment
```bash
kubectl get pods
kubectl logs -f deployment/odop-ai-service
kubectl describe service odop-ai-service
```

## Environment Variables

Key variables to configure:

- `SERVER_HOST` - Bind address (0.0.0.0 for all interfaces)
- `SERVER_PORT` - Listen port (default: 8000)
- `LOG_LEVEL` - Logging level (DEBUG, INFO, WARNING, ERROR)
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)
- `APP_ENV` - Environment (development, staging, production)
- `USE_MOCK_DATA` - Use mock data vs real ML (true/false)

## Performance Tuning

### Single Server (Gunicorn)
```bash
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --worker-connections 1000 \
  --keepalive 5
```

### Multiple Servers (Load Balanced)
- Deploy multiple instances behind Nginx
- Use health checks for failover
- Share state in database if needed

### Monitoring Commands
```bash
# Check service status
curl http://localhost:8000/health

# Monitor performance
top
free -h
df -h

# View logs
tail -f /var/log/odop-ai-service.log
```

## Troubleshooting

### Port Already in Use
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

### High Memory Usage
```bash
# Reduce workers
gunicorn --workers 2 main:app

# Monitor memory
watch -n 1 'free -h'
```

### Slow Responses
```bash
# Check CPU usage
top

# Monitor requests
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/health
```

### Service Won't Start
```bash
# Check logs for errors
journalctl -u odop-ai-service -n 50

# Verify configuration
python -m py_compile main.py models.py

# Test import
python -c "from main import app; print('Imports OK')"
```

## Scaling Guidelines

| Load | Recommended Setup |
|------|------------------|
| Development | Single server, 1 worker |
| Staging | Single server, 2-4 workers |
| Production (< 100 req/s) | 1-2 servers, 4 workers each |
| Production (100-500 req/s) | 3-5 servers, 4 workers each + LB |
| Production (> 500 req/s) | 5-10 servers, Kubernetes, autoscale |

## Monitoring & Alerts

### Health Checks
```bash
# Every 10 seconds
*/10 * * * * curl -s http://localhost:8000/health || alert
```

### Log Aggregation
- Use ELK Stack (Elasticsearch, Logstash, Kibana)
- Or use Datadog, New Relic, etc.

### Metrics Collection
- Enable metrics in .env
- Use Prometheus for collection
- Grafana for visualization

## Backup & Disaster Recovery

### Database (if applicable)
```bash
# Regular backup schedule
0 2 * * * mysqldump -u root -p database > /backup/db_$(date +%Y%m%d).sql
```

### Configuration
```bash
# Backup .env and configs
0 3 * * * tar -czf /backup/config_$(date +%Y%m%d).tar.gz /opt/odop-ai-service/.env
```

## Maintenance

### Regular Tasks
- Check logs for errors
- Monitor disk space
- Update dependencies quarterly
- Review performance metrics
- Perform security updates

### Update Process
```bash
# Stop service
sudo systemctl stop odop-ai-service

# Pull latest code
cd /opt/odop-ai-service
git pull origin main

# Install new dependencies
source venv/bin/activate
pip install -r requirements.txt

# Start service
sudo systemctl start odop-ai-service

# Verify
curl http://localhost:8000/health
```

## Support & Escalation

For issues contact:
- Documentation: README.md
- Logs: Check systemd journal or app logs
- Code: Review main.py and services/
- API: http://localhost:8000/docs

---

**Last Updated**: 2024-04-03
**Version**: 1.0.0
