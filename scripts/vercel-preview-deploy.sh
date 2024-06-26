#!bin/bash

if [ -e .env.dev ]; then
    source .env.dev
fi

mkdir -p .vercel
touch .vercel/project.json
echo "{\"orgId\":\"$VERCEL_ORG_ID\",\"projectId\":\"$VERCEL_PROJECT_ID\"}" >.vercel/project.json

vercel . \
    -e MONGODB_URI=$MONGODB_URI \
    -e AUTH0_DOMAIN=$AUTH0_DOMAIN \
    -e AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID \
    -e APP_DOMAIN=$APP_DOMAIN \
    -e AUTH0_AUDIENCE=$AUTH0_AUDIENCE \
    -e AUTH0_BASE_URL=$AUTH0_BASE_URL \
    -e AUTH0_ISSUER_BASE_URL=$AUTH0_ISSUER_BASE_URL \
    -e AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET \
    -e AUTH0_SECRET=$AUTH0_SECRET \
    -t "$VERCEL_TOKEN"
