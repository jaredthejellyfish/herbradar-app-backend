FROM oven/bun:1.1.29

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 8080
CMD ["bun", "run", "server.ts"]
