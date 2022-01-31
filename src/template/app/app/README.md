#### Adding a new project to momnorepo

 - Add in apps folder

 - nest-cli.json
  ```json
  ...
  "projects": {
  ...
  "@app/your-api": {
        "type": "application",
        "root": "apps/your-api",
        "entryFile": "main",
        "sourceRoot": "apps/your-api/src",
        "compilerOptions": {
          "tsConfigPath": "apps/your-api/tsconfig.json"
        }
      }
  ```
 - .vscode/launch.json
  ```json
  ...
  {
        "name": "Debug: yourAPI",
        "type": "node",
        "request": "attach",
        "remoteRoot": "/src",
        "localRoot": "${workspaceFolder}",
        "protocol": "inspector",
        "port": 5880,
        "restart": true,
        "address": "0.0.0.0",
        "skipFiles": ["<node_internals>/**"]
      }
  ```
  - .env
  ```bash
  $ PORT_your_API=4000
  ```
  - apps/libs/modules/secrets/enum.ts
  ```ts
  ...
  export enum yourAPIEnvironment {
    PORT = 'PORT_your_API',
  }
  ```

  - apps/libs/modules/secrets/adapter.ts

  ```ts
    yourAPI: {
      PORT: yourAPIEnvironment | number;
    };
  ```

  - apps/libs/modules/secrets/service.ts
  ```ts
    yourAPI = {
      PORT: this.get<number>(yourAPIEnvironment.PORT),
    };
  ```
  - package.json
  ```json
   "start:your-api": "nest start @app/your-api --debug 0.0.0.0:5880 --watch",
  ```
  - docker-compose.yml

  ```yml
  ...
   your-api:
    container_name: monorepo-your-api
    build:
      context: .
      dockerfile: ./apps/your-api/Dockerfile
    ports:
      - "4000:4000" 
      - "5880:5880"
    volumes:
      - .:/src:cached

  ```

  - Add a file with your app name in test folder where it will be set the tests envs, exemple:

  ```├── tests - your-api.js```