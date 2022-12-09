FROM node:16.18.1-alpine AS builder
COPY . /src
WORKDIR /src
RUN ["yarn", "install", "--frozen-lockfile"]
RUN ["yarn", "build"]

FROM busybox:1.34.1-musl AS runner
RUN adduser -D runner
USER runner
WORKDIR /home/runner
RUN mkdir -p /home/runner/static
COPY --chown=runner --from=builder /src/public /home/runner/static
CMD ["busybox", "httpd", "-f", "-p", "8000", "-h", "/home/runner/static"]
