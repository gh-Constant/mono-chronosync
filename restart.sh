#!/bin/bash

# Display colorful banner
echo -e "\e[1;34m"
echo "====================================================="
echo "  ChronoSync Service Restart and Connectivity Check  "
echo "====================================================="
echo -e "\e[0m"

echo -e "\e[1;33mStopping existing containers...\e[0m"
docker-compose down

echo -e "\e[1;33mRemoving any dangling containers to ensure clean restart...\e[0m"
docker system prune -f

echo -e "\e[1;33mBuilding and starting services...\e[0m"
docker-compose up --build -d

echo -e "\e[1;33mWaiting for services to initialize (15 seconds)...\e[0m"
sleep 15

echo -e "\e[1;33mChecking backend health...\e[0m"
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/api/health || echo "Failed")

if [ "$BACKEND_HEALTH" = "200" ]; then
  echo -e "\e[1;32mBackend health check: Success!\e[0m"
else
  echo -e "\e[1;31mBackend health check: Failed with status $BACKEND_HEALTH\e[0m"
  echo "Checking backend logs for errors:"
  docker-compose logs backend --tail 50
fi

echo -e "\e[1;33mChecking Traefik routes...\e[0m"
TRAEFIK_ROUTES=$(curl -s -o /dev/null -w "%{http_code}" http://app.chronosync.local/api/health || echo "Failed")

if [ "$TRAEFIK_ROUTES" = "200" ]; then
  echo -e "\e[1;32mTraefik routing check: Success!\e[0m"
else
  echo -e "\e[1;31mTraefik routing check: Failed with status $TRAEFIK_ROUTES\e[0m"
  
  # Check hosts file configuration
  echo -e "\e[1;33mChecking hosts file configuration...\e[0m"
  if grep -q "app.chronosync.local" /etc/hosts; then
    echo -e "\e[1;32mHosts file has app.chronosync.local entry\e[0m"
  else
    echo -e "\e[1;31mWARNING: app.chronosync.local not found in hosts file!\e[0m"
    echo "Please add the following to your /etc/hosts file:"
    echo "127.0.0.1 app.chronosync.local api.chronosync.local"
  fi
fi

echo -e "\e[1;33mChecking frontend service...\e[0m"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4173 || echo "Failed")

if [ "$FRONTEND_STATUS" = "200" ]; then
  echo -e "\e[1;32mFrontend service check: Success!\e[0m"
else
  echo -e "\e[1;31mFrontend service check: Failed with status $FRONTEND_STATUS\e[0m"
  echo "Checking frontend logs for errors:"
  docker-compose logs frontend --tail 20
fi

echo -e "\e[1;34m"
echo "====================================================="
echo "  Service Status Summary  "
echo "====================================================="
echo -e "\e[0m"

echo -e "Frontend:       \e[1;$([ "$FRONTEND_STATUS" = "200" ] && echo "32m✓" || echo "31m✗")\e[0m"
echo -e "Backend:        \e[1;$([ "$BACKEND_HEALTH" = "200" ] && echo "32m✓" || echo "31m✗")\e[0m"
echo -e "Traefik Routes: \e[1;$([ "$TRAEFIK_ROUTES" = "200" ] && echo "32m✓" || echo "31m✗")\e[0m"

echo -e "\e[1;34m"
echo "====================================================="
echo -e "\e[0m"

echo -e "\e[1;32mAccess the application at:\e[0m"
echo "- Frontend: http://localhost:4173"
echo "- Backend API: http://localhost:3005/api"
echo "- Combined (with Traefik): http://app.chronosync.local"

if [ "$BACKEND_HEALTH" != "200" ] || [ "$TRAEFIK_ROUTES" != "200" ] || [ "$FRONTEND_STATUS" != "200" ]; then
  echo -e "\e[1;31m"
  echo "Some services failed to start or are not properly configured."
  echo "Check the logs above for more details and troubleshooting steps."
  echo -e "\e[0m"
  
  # Print docker-compose ps output for debugging
  echo -e "\e[1;33mCurrent service status:\e[0m"
  docker-compose ps
fi 