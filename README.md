# Para desplegar la aplicación:

1.  Navega al directorio `alfred-app`
2.  Ejecuta el comando de acuerdo al ambiente:

    `docker-compose -f docker-compose.dev.yml up --build`

3.  Accede por navegador a la aplicación en http://alfred.localhost

## FIle Structure

```/alfred-app
|-- /backend
| |-- Dockerfile
| |-- app.js
| |-- routes.js
| |-- /models
| | |-- Prospect.js
| |-- /config
| |-- db.js
|
|-- /backoffice
| |-- Dockerfile
| |-- package.json
| |-- /src
| |-- App.js
| |-- index.js
| |-- /components
| |-- ProspectForm.js
| |-- EditProspect.js
| |-- Config.js
| |-- /styles
| |-- App.css
|
|-- docker-compose.yml
```

## Localhost setup

1. Verifica el Archivo hosts
   Agrega el dominio alfred.localhost al archivo hosts de tu sistema operativo para que apunte a `127.0.0.1`

   - En Windows: Abre el bloc de notas como administrador.
     Edita el archivo C:\Windows\System32\drivers\etc\hosts.
     Agrega la siguiente línea:
     `127.0.0.1 alfred.localhost`
     Guarda el archivo.

   - En macOS/Linux: Edita el archivo /etc/hosts usando un editor de texto con privilegios de administrador:
     `sudo nano /etc/hosts`
     Agrega la siguiente línea:
     `127.0.0.1 alfred.localhost`
     Guarda y cierra el archivo.

2. Verifica que los Contenedores Estén Corriendo
   Asegúrate de que los contenedores de Docker estén corriendo correctamente:

```
docker-compose ps
```

Deberías ver algo como esto:

```
Name Command State Ports

---

alfred-app_backend_1 docker-entrypoint.sh node Up 0.0.0.0:5000->5000/tcp
alfred-app_backoffice_1 docker-entrypoint.sh npm Up 0.0.0.0:5001->5001/tcp
alfred-app_mongo_1 docker-entrypoint.sh mongod Up 0.0.0.0:27017->27017/tcp
```

3. Verifica los Logs del Contenedor de backoffice
   Revisa los logs del contenedor de backoffice para ver si hay errores que impidan que la aplicación se inicie:

```
docker-compose logs backoffice
```

4. Verifica que el backoffice está Sirviendo el Contenido Correctamente

Intenta acceder al backoffice a través de http://localhost/ para ver si el problema es con el dominio o con el servicio en sí.

5. Limpieza de Caché y Reinicio de Docker

Si todo parece estar en orden, intenta limpiar los contenedores y reconstruir el proyecto:

```
docker-compose down && docker system prune -a --volumes && docker-compose up --build
```

6. Reinicia Docker y Tu Máquina
   A veces, reiniciar Docker y/o tu máquina puede resolver problemas de red o caché.

7. Considerar Docker Desktop DNS Configurations (Windows/MacOS)

En Windows y macOS, Docker Desktop gestiona su propia red, y a veces el DNS interno no resuelve correctamente. Si esto ocurre, prueba con http://localhost en lugar de http://alfred.localhost.

Si después de estos pasos sigues sin poder acceder a http://alfred.localhost/, proporciona más detalles sobre los errores o problemas que estés experimentando para poder ayudarte mejor.

## Add a user for login

```
curl --location 'http://localhost:5000/api/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Gregorio",
    "secondName": "Daniel",
    "lastName": "Ayar",
    "secondLastName": "López",
    "email": "admin@admin.com",
    "password": "password",
    "state": "Jalisco",
    "country": "México",
    "position": "Software Engineer",
    "description": "A skilled and versatile Software Engineer with a strong foundation in front-end and back-end development. Proficient in modern web technologies, including HTML, CSS, JavaScript, and frameworks like React, Vue, and Angular, as well as server-side languages such as Node.js and Python. Experienced in building responsive, user-centered applications and optimizing website performance for seamless user experiences.",
    "role": 0
}'
```

## Test login user

```
curl --location 'http://localhost:5000/api/login/' \
--header 'Content-Type: application/json' \
--data-raw '{"email": "admin@admin.com", "password": "password"}'
```

**Access HashiCorp Vault**: - Once `docker-compose` has completed, open your browser and navigate to `http://localhost:8200`. - Log in using the token defined in the `docker-compose.yml` file, which in our case it myroot.

### Configuring HashiCorp Vault

1. **Add a New Secret**:
   - In the Vault UI, navigate to the 'Secrets' section.
   - Add a new KV secret named `demo_api`.
     ![img.png](img.png)
   - Within this secret, add a key for the MongoDB connection string named `DB_CONNECTION_STRING`.
   - Add the following value for the connection string:
     ```
     mongodb://mongo:27017
     ```
     ![img_1.png](img_1.png)

### Add environment variables

In order to start working with the API, you need to add the following environment variables to your `.env` file:

```
VAULT_TOKEN=myroot
VAULT_ADDRESS=http://localhost:8200
VAULT_PREFIX_PATH=secret/data/demo_api
```

In case of changing values, you may also need to update the docker-compose.yml file.
