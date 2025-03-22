#!/bin/bash

# Check if script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo:"
  echo "sudo $0"
  exit 1
fi

echo "Setting up hosts file entries for ChronoSync development..."

# Check if entries already exist
if grep -q "app.chronosync.local" /etc/hosts && grep -q "api.chronosync.local" /etc/hosts; then
  echo "Hosts file entries already exist. No changes needed."
else
  # Backup hosts file
  cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d%H%M%S)
  
  # Add entries to hosts file
  echo "" >> /etc/hosts
  echo "# ChronoSync development hosts" >> /etc/hosts
  echo "127.0.0.1 app.chronosync.local" >> /etc/hosts
  echo "127.0.0.1 api.chronosync.local" >> /etc/hosts
  
  echo "Hosts file entries added successfully!"
fi

echo "Testing DNS resolution..."
ping -c 1 app.chronosync.local > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ app.chronosync.local resolves correctly"
else
  echo "❌ app.chronosync.local resolution failed"
fi

ping -c 1 api.chronosync.local > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ api.chronosync.local resolves correctly"
else
  echo "❌ api.chronosync.local resolution failed"
fi

echo ""
echo "Setup complete! You can now access ChronoSync at:"
echo "- Frontend: http://app.chronosync.local"
echo "- API: http://api.chronosync.local"
echo ""
echo "Run ./restart.sh to rebuild and restart the services" 