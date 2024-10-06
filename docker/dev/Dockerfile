FROM oven/bun:alpine

WORKDIR /workspace/discord

RUN apk add --no-cache git
COPY package.json ./package.json

RUN bun install

RUN rm ./package.json

CMD ["bun", "--watch", "./src/index.js"]