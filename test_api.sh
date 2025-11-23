#!/bin/bash

echo "Testing /api/chat..."
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "resume": "Experienced React Developer",
    "role": "Software Engineer"
  }' \
  --fail --silent --show-error

echo -e "\n\nTesting /api/speak..."
curl -X POST http://localhost:3000/api/speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}' \
  --fail --silent --show-error --output /dev/null --write-out "Response Code: %{http_code}\n"
