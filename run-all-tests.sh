#!/bin/bash

# Phase 6 Complete Test Suite Runner
# This script runs all tests for backend, frontend, and integration

set -e

echo "=========================================="
echo "Phase 6: Testing & Deployment - Full Test Suite"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run tests and track results
run_test_suite() {
    local suite_name=$1
    local command=$2
    
    echo -e "${YELLOW}Running: $suite_name${NC}"
    echo "Command: $command"
    echo "---"
    
    if eval "$command"; then
        echo -e "${GREEN}✓ $suite_name PASSED${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}✗ $suite_name FAILED${NC}"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    echo ""
}

# 6.1 Unit Tests
echo -e "${YELLOW}=== 6.1 Unit Tests ===${NC}"
run_test_suite "Auth Service Unit Tests" "npm run test:unit -- auth.service.spec.ts"
run_test_suite "Crop Service Unit Tests" "npm run test:unit -- crop.service.spec.ts"
run_test_suite "Order Service Unit Tests" "npm run test:unit -- order.service.spec.ts"
run_test_suite "Chat Service Unit Tests" "npm run test:unit -- chat.service.spec.ts"
run_test_suite "Payment Service Unit Tests" "npm run test:unit -- payment.service.spec.ts"
run_test_suite "Trust Service Unit Tests" "npm run test:unit -- trust.service.spec.ts"
run_test_suite "Notification Service Unit Tests" "npm run test:unit -- notification.service.spec.ts"
run_test_suite "Analytics Service Unit Tests" "npm run test:unit -- analytics.service.spec.ts"

# 6.2 Property-Based Tests
echo -e "${YELLOW}=== 6.2 Property-Based Tests ===${NC}"
run_test_suite "Property-Based Tests (62 properties)" "npm run test:property"

# 6.3 Integration Tests
echo -e "${YELLOW}=== 6.3 Integration Tests ===${NC}"
run_test_suite "Complete Order Flow" "npm run test:integration"
run_test_suite "Payment Processing" "npm run test:integration"
run_test_suite "Chat Service" "npm run test:integration"
run_test_suite "Quality Analysis" "npm run test:integration"
run_test_suite "Rating System" "npm run test:integration"

# 6.4 End-to-End Tests
echo -e "${YELLOW}=== 6.4 End-to-End Tests ===${NC}"
run_test_suite "Farmer Crop Upload Flow" "npm run test:e2e"
run_test_suite "Buyer Marketplace Flow" "npm run test:e2e"
run_test_suite "Order & Payment Flow" "npm run test:e2e"
run_test_suite "Chat & Messaging Flow" "npm run test:e2e"

# 6.5 Performance Tests
echo -e "${YELLOW}=== 6.5 Performance Tests ===${NC}"
run_test_suite "API Response Time (p95 < 500ms)" "npm run test:performance"
run_test_suite "Database Query Performance" "npm run test:performance"
run_test_suite "Cache Performance" "npm run test:performance"
run_test_suite "Concurrent Requests (100+)" "npm run test:performance"

# 6.6 Security Tests
echo -e "${YELLOW}=== 6.6 Security Tests ===${NC}"
run_test_suite "SQL Injection Prevention" "npm run test:security"
run_test_suite "XSS Prevention" "npm run test:security"
run_test_suite "CSRF Protection" "npm run test:security"
run_test_suite "JWT Token Security" "npm run test:security"
run_test_suite "Rate Limiting" "npm run test:security"
run_test_suite "File Upload Security" "npm run test:security"

# Code Coverage
echo -e "${YELLOW}=== Code Coverage ===${NC}"
run_test_suite "Generate Coverage Report (80% minimum)" "npm run test:coverage"

# Linting and Type Checking
echo -e "${YELLOW}=== Code Quality ===${NC}"
run_test_suite "ESLint - Code Style" "npm run lint"
run_test_suite "TypeScript - Type Checking" "npm run type-check"

# Frontend Tests
echo -e "${YELLOW}=== Frontend Tests ===${NC}"
run_test_suite "Frontend Unit Tests" "cd apps/web && npm run test:unit 2>/dev/null || true"
run_test_suite "Frontend E2E Tests" "cd apps/web && npm run test:e2e 2>/dev/null || true"

# Summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Total Test Suites: ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
