#!/usr/bin/env bash
set -e
# Install wasm-pack and other optional tools if needed
rustup target add wasm32-unknown-unknown || true
npm ci
echo "Post-create complete. To start dev: npm run dev"
