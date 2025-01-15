# backoffice/Dockerfile

FROM node:18
# Install tzdata for timezone configuration
RUN apt-get update && apt-get install -y tzdata && \
    ln -sf /usr/share/zoneinfo/America/Mexico_City /etc/localtime && \
    echo "America/Mexico_City" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm i --force

# Copia el resto del código
COPY . .

EXPOSE 3001

CMD ["npm", "run","dev"]
