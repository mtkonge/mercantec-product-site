FROM node:16.18.1-alpine AS builder
COPY . /src
WORKDIR /src
RUN ["yarn", "install", "--frozen-lockfile"]
RUN ["yarn", "build"]

FROM node:16.18.1-alpine AS runner
RUN adduser -D runner
USER runner
COPY --chown=runner --from=builder /src/dist /home/runner/dist
COPY --chown=runner --from=builder /src/node_modules /home/runner/node_modules
COPY --chown=runner --from=builder /src/package.json /src/yarn.lock /home/runner/
WORKDIR /home/runner
CMD ["yarn", "start"]
