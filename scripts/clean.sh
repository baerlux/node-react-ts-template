#!/bin/bash

echo "cleaning..."
rm -r frontend/public/ 2> /dev/null
rm -r backend/dist/ 2> /dev/null
rm -r logs/ 2> /dev/null