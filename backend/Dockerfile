FROM node:22-alpine

WORKDIR /app

# Force memory limit for NODE
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Copy root workspace config if needed, or local files
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

RUN npm install --network-timeout=100000 --prefer-offline || npm install
# Generate Prisma client types safely inside container
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . .

# Ensure linux shell script can run the entrypoint file
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

# Mount the entrypoint wrapper to catch container start loop
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "start"]