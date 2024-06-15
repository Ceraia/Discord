FROM node:alpine

COPY . .
RUN npm i --omit=dev --no-package-lock
USER node

CMD ["node","./index.js"]