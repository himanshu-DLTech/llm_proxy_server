#!/bin/bash

set -e

echo "Checking for Node.js and npm..."

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed: $(node -v)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm not found. Installing npm..."
    sudo apt-get install -y npm
else
    echo "npm is already installed: $(npm -v)"
fi

# Initialize npm project if package.json does not exist
if [ ! -f package.json ]; then
    echo "Creating package.json..."
    npm init -y
fi

# Install required packages
echo "Installing dependencies: express, dotenv, cors, axios..."
npm install express dotenv cors axios

echo "Installation complete!"
