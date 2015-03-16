#!/bin/bash
while getopts ":d" opt; do
  case $opt in
    d)
      dev="true"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

if [ "$dev" = "true" ]; then
  echo "Running Init with -d option:"
  cp /data/tmpconf/default.development /etc/nginx/sites-available/default #copy nginx development config and restart
  service nginx start 
  cd server && npm install bcrypt && sails lift
else
  echo "Running Init in production mode:"
  service nginx start
  cd server && sails lift
fi
