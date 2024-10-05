FROM oven/bun:alpine

COPY . .
RUN bun install
RUN bun install git -g

CMD ["bun","./index.js"]