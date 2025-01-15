# Stage 1: Build stage
FROM node:18 AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --include=optional

COPY . .

# Stage 2: Runtime stage
FROM node:18

# Install tzdata for timezone configuration
RUN apt-get update && apt-get install -y tzdata && \
    ln -sf /usr/share/zoneinfo/America/Mexico_City /etc/localtime && \
    echo "America/Mexico_City" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata

WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
RUN npm install --platform=linux --arch=arm64 sharp

CMD ["npm", "run", "setup:cp"]
CMD ["npm", "start"]
