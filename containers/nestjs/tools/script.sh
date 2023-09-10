#!/bin/bash

cd  /home/back-end
npm cache clean --force
npm install --legacy-peer-deps

npm i -g prisma
npm run unify

npm run build
npm run start
# npm run start:dev


