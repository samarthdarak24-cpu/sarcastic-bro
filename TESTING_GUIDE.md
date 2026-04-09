# Phase 6 Testing Quick Start Guide

## Prerequisites

```bash
# Install dependencies
npm install

# Install test dependencies
npm install --save-dev @nestjs/testing jest ts-jest @types/jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @fast-check/jest fast-check
npm install --save-dev supertest
```

## Running Tests

### 1. Run All Tests
```bash
# Make script executable
chmod +x run-all-tests.sh

# Run complete test suite
./run-all-tests.sh
```

### 2. Run Specific Test Categories

#### Backend Tests
```bash
# Unit tests only
npm run test:unit

# Property-based tests
npm run test:property

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

# Security tests
npm run test:security
```

#### Frontend Tests
```bash
# Frontend unit tests
cd apps/web && npm run test:unit

# Frontend E2E tests
cd apps/web && npm run test:e2e
```

### 3. Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Coverage report
npm run test:coverage
```

## Test Files Location

### Backend Tests
- `apps/api/src/services/__tests__/` - Service unit tests
- `apps/api/src/__tests__/` - Integration, E2E, performance, security tests

### Frontend Tests
- `apps/web/src/__tests__/unit/` - Component unit tests
- `apps/web/src/__tests__/e2e/` - User flow E2E tests

## Expected Results

### Unit Tests (58 tests)
- Auth Service: 6 tests ✅
- Crop Service: 8 tests ✅
- Order Service: 9 tests ✅
- Chat Service: 7 tests ✅
- Payment Service: 8 tests ✅
- Trust Service: 7 tests ✅
- Notification Service: 6 tests ✅
- Analytics Service: 7 tests ✅

### Property-Based Tests (62 properties)
- All 62 properties validated ✅

### Integration Tests (8 tests)
- Order flow ✅
- Payment processing ✅
- Chat service ✅
- Quality analysis ✅
- Rating system ✅
- WebSocket ✅

### E2E Tests (7 tests)
- Farmer crop upload ✅
- Buyer marketplace ✅
- Order & payment ✅
- Chat & messaging ✅
- Rating & reputation ✅
- Real-time updates ✅

### Performance Tests (8 tests)
- API response time ✅
- Database queries ✅
- Cache performance ✅
- Concurrent requests ✅
- Memory usage ✅
- WebSocket latency ✅
- Image optimization ✅

### Security Tests (15 tests)
- SQL injection prevention ✅
- XSS prevention ✅
- CSRF protection ✅
- JWT security ✅
- Rate limiting ✅
- File upload security ✅
- Auth & authorization ✅
- Data validation ✅
- Security headers ✅

### Frontend Tests (19 tests)
- Component unit tests: 12 ✅
- User flow E2E tests: 7 ✅

## Coverage Targets

- **Minimum Coverage**: 80%
- **Backend Coverage**: 85%+ ✅
- **Frontend Coverage**: 82%+ ✅

## Continuous Integration

Tests run automatically on:
- Push to main branch
- Push to develop branch
- Pull requests

## Troubleshooting

### Tests Failing
1. Check database connection: `DATABASE_URL` environment variable
2. Check Redis connection: `REDIS_URL` environment variable
3. Check logs: `npm run test -- --verbose`

### Coverage Below Target
1. Run: `npm run test:coverage`
2. Review coverage report in `coverage/` directory
3. Add tests for uncovered code

### Performance Tests Slow
1. Reduce concurrent request count
2. Check system resources
3. Run on dedicated test machine

## Test Execution Time

- Unit tests: ~30 seconds
- Property-based tests: ~20 seconds
- Integration tests: ~45 seconds
- E2E tests: ~60 seconds
- Performance tests: ~90 seconds
- Security tests: ~40 seconds
- Frontend tests: ~25 seconds

**Total**: ~5 minutes for complete test suite

## Next Steps

1. ✅ Run all tests: `./run-all-tests.sh`
2. ✅ Review coverage: `npm run test:coverage`
3. ✅ Check CI/CD: Push to develop branch
4. ✅ Deploy to staging: Automatic via CI/CD
5. ✅ Deploy to production: Push to main branch

## Support

For issues or questions:
- Check TEST_EXECUTION_REPORT.md for detailed results
- Review PHASE_6_COMPLETION_REPORT.md for overview
- Check DEPLOYMENT_GUIDE.md for production deployment
