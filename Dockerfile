# Install dependencies and build app
FROM node:24-alpine AS build
WORKDIR /app
COPY . /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ARG NEXT_PUBLIC_CLOUDFLARE_CHALLENGE_SITE_KEY
ENV NEXT_PUBLIC_CLOUDFLARE_CHALLENGE_SITE_KEY=$NEXT_PUBLIC_CLOUDFLARE_CHALLENGE_SITE_KEY
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
RUN npm ci && npm run build

# Clean app
FROM build
RUN rm -rf src/ jest.config.ts next-env.d.ts package-lock.json testEnvironment.ts tsconfig.json
RUN npm prune --omit=dev
RUN npm install typescript --no-save

EXPOSE 3000
CMD ["npm", "start"]
