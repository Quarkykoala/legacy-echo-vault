#!/bin/bash
# security-scan.sh - Security scanning automation for LegacyChain
# Run this script to perform security checks on the codebase

set -e
echo "🔒 Running LegacyChain Security Scanner"
echo "========================================"

# Check for environment variables
echo "📋 Checking for exposed environment variables..."
if git grep -l "process.env" --not-match "process.env.NODE_ENV" -- "*.js" "*.ts" "*.tsx"; then
  echo "⚠️  WARNING: Found potential hardcoded environment variables in code"
  echo "     Consider using a configuration service instead"
else
  echo "✅ No exposed environment variables found"
fi

# Check for secrets in code
echo "🔑 Scanning for potential secrets in code..."
PATTERNS=("password" "secret" "token" "key" "credential" "api_key" "apikey" "auth")
for pattern in "${PATTERNS[@]}"; do
  if git grep -i "$pattern.*=.*['\"]" -- "*.js" "*.ts" "*.tsx" "*.py" "*.json" | grep -v "example\|template"; then
    echo "⚠️  WARNING: Found potential hardcoded secrets matching '$pattern'"
  fi
done

# Check package vulnerabilities
echo "📦 Checking package vulnerabilities..."
if command -v npm > /dev/null; then
  echo "Running npm audit..."
  npm audit --production || echo "⚠️  Vulnerabilities found in npm packages"
else
  echo "⚠️  npm not found, skipping package vulnerability check"
fi

# Check Python package vulnerabilities
if command -v pip > /dev/null; then
  echo "Checking Python packages..."
  if command -v safety > /dev/null; then
    pip freeze | safety check --stdin || echo "⚠️  Vulnerabilities found in Python packages"
  else
    echo "⚠️  safety not found, consider installing: pip install safety"
  fi
fi

# Check for GDPR compliance in models
echo "🔐 Checking for potential PII fields..."
if grep -r --include="*.py" "email\|phone\|address\|name\|birth\|ssn\|social" backend/models.py; then
  echo "⚠️  WARNING: Found potential PII fields. Ensure proper encryption and GDPR compliance"
fi

# Check permissions
echo "🛡️  Checking file permissions..."
find . -type f -name "*.sh" ! -perm -u=x -exec echo "⚠️  WARNING: Shell script without executable permission: {}" \;

echo "========================================"
echo "✅ Security scan complete"
echo "Please review any warnings and take appropriate action" 