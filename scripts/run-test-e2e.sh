#!bin/bash

mkdir -p playwright/.auth
touch playwright/.auth/user.json
echo "{}" >playwright/.auth/user.json

npx playwright test
