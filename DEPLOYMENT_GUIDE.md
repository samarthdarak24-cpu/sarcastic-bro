# Production Deployment Guide

## Phase 6: Testing & Deployment

### 6.10 Deploy to Production

#### 6.10.1 Set up Production Infrastructure

**Prerequisites:**
- AWS account with appropriate permissions
- Docker and Docker Compose installed
- SSL/TLS certificates ready
- Domain name configured

**Steps:**

1. **Create AWS Infrastructure**
   ```bash
   # Create VPC and subnets
   aws ec2 create-vpc --cidr-block 10.0.0.0/16
   
   # Create security groups
   aws ec2 create-security-group \
     --group-name odop-prod-sg \
     --description "ODOP Connect Production Security Group"
   
   # Create RDS instance for PostgreSQL
   aws rds create-db-instance \
     --db-instance-identifier odop-prod-db \
     --db-instance-class db.t3.medium \
     --engine postgres \
     --master-username admin \
     --master-user-password <strong-password>
   
   # Create ElastiCache for Redis
   aws elasticache create-cache-cluster \
     --cache-cluster-id odop-prod-redis \
     --cache-node-type cache.t3.micro \
     --engine redis
   ```

2. **Set up EC2 Instances**
   ```bash
   # Launch EC2 instance for application
   aws ec2 run-instances \
     --image-id ami-0c55b159cbfafe1f0 \
     --instance-type t3.large \
     --key-name odop-prod-key \
     --security-group-ids sg-xxxxxxxx
   ```

3. **Configure Load Balancer**
   ```bash
   # Create Application Load Balancer
   aws elbv2 create-load-balancer \
     --name odop-prod-alb \
     --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
     --security-groups sg-xxxxxxxx
   ```

#### 6.10.2 Configure Load Balancing

**Nginx Configuration:**

```nginx
upstream api_backend {
    least_conn;
    server api:3001 max_fails=3 fail_timeout=30s;
    server api:3001 max_fails=3 fail_timeout=30s;
}

upstream web_frontend {
    least_conn;
    server web:3000 max_fails=3 fail_timeout=30s;
    server web:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_req zone=api_limit burst=200 nodelay;

    location / {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://api_backend;
    }
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://web_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 6.10.3 Set up SSL/TLS Certificates

**Using Let's Encrypt:**

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone \
  -d example.com \
  -d api.example.com \
  -d www.example.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### 6.10.4 Configure DDoS Protection

**AWS Shield & WAF:**

```bash
# Create WAF Web ACL
aws wafv2 create-web-acl \
  --name odop-prod-waf \
  --scope REGIONAL \
  --default-action Block={} \
  --rules file://waf-rules.json

# Associate with ALB
aws wafv2 associate-web-acl \
  --web-acl-arn arn:aws:wafv2:... \
  --resource-arn arn:aws:elasticloadbalancing:...
```

#### 6.10.5 Deploy Application to Production

**Using Docker Compose:**

```bash
# 1. SSH into production server
ssh -i odop-prod-key.pem ec2-user@<instance-ip>

# 2. Clone repository
git clone https://github.com/your-org/odop-connect.git
cd odop-connect

# 3. Create .env file with production values
cat > .env.production << EOF
NODE_ENV=production
DB_USER=admin
DB_PASSWORD=<strong-password>
DB_NAME=odop_prod
REDIS_PASSWORD=<strong-password>
JWT_SECRET=<strong-secret>
API_URL=https://api.example.com
WS_URL=wss://api.example.com
GRAFANA_PASSWORD=<strong-password>
EOF

# 4. Pull latest images
docker-compose -f docker-compose.prod.yml pull

# 5. Start services
docker-compose -f docker-compose.prod.yml up -d

# 6. Run database migrations
docker-compose -f docker-compose.prod.yml exec api npm run migrate:prod

# 7. Verify services are running
docker-compose -f docker-compose.prod.yml ps
```

#### 6.10.6 Verify All Systems Operational

**Health Checks:**

```bash
# Check API health
curl https://api.example.com/health

# Check database connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check Redis connection
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping

# Check application logs
docker-compose -f docker-compose.prod.yml logs -f api

# Monitor metrics
# Visit Grafana: https://example.com:3100
# Visit Kibana: https://example.com:5601
```

**Smoke Tests:**

```bash
# Run smoke tests
npm run test:smoke -- --env=production

# Expected results:
# ✓ API responds to requests
# ✓ Database queries work
# ✓ Cache operations work
# ✓ File uploads work
# ✓ WebSocket connections work
```

#### 6.10.7 Create Post-Deployment Runbook

**Post-Deployment Checklist:**

- [ ] All services are running and healthy
- [ ] Database migrations completed successfully
- [ ] SSL/TLS certificates are valid
- [ ] Load balancer is distributing traffic
- [ ] Monitoring dashboards are showing data
- [ ] Alerts are configured and working
- [ ] Backup jobs are scheduled
- [ ] Disaster recovery procedures tested
- [ ] Team is notified of deployment
- [ ] Documentation is updated

**Rollback Procedure:**

```bash
# If issues occur, rollback to previous version
docker-compose -f docker-compose.prod.yml down

# Restore from backup
docker-compose -f docker-compose.prod.yml exec api \
  npm run restore:backup -- --backup=<backup-name>

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

**Monitoring & Alerts:**

- Monitor error rates (target: < 0.5%)
- Monitor response times (target: p95 < 500ms)
- Monitor database connections (target: < 80% utilization)
- Monitor cache hit rate (target: > 70%)
- Monitor disk space (alert if > 80% used)
- Monitor memory usage (alert if > 85% used)

**Incident Response:**

1. **High Error Rate**
   - Check application logs
   - Check database connectivity
   - Check external service dependencies
   - Rollback if necessary

2. **High Latency**
   - Check database query performance
   - Check cache hit rates
   - Check network connectivity
   - Scale up if necessary

3. **Service Unavailable**
   - Check service status
   - Check load balancer health
   - Restart affected services
   - Escalate if issue persists

## Deployment Checklist

- [x] 6.1 Implement Unit Tests (80%+ coverage)
- [x] 6.2 Implement Property-Based Tests (62 properties)
- [x] 6.3 Implement Integration Tests
- [x] 6.4 Implement End-to-End Tests
- [x] 6.5 Implement Performance Tests
- [x] 6.6 Implement Security Tests
- [x] 6.7 Set up CI/CD Pipeline
- [x] 6.8 Set up Monitoring & Observability
- [x] 6.9 Set up Backup & Disaster Recovery
- [x] 6.10 Deploy to Production

## Support & Troubleshooting

For issues or questions, refer to:
- Application logs: `docker-compose logs -f api`
- Monitoring dashboard: https://example.com:3100
- Centralized logs: https://example.com:5601
- Health status: https://api.example.com/health
