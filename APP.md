### Adding a new API

##### after ```monorepo-nestjs-cli --app --name=client```

 - Associating the API with the monorepo
  ```ts
    ...
    //nest-cli.json
    "@app/client-api": {
      "type": "application",
      "root": "apps/client-api",
      "entryFile": "main",
      "sourceRoot": "apps/client-api/src",
      "compilerOptions": {
        "tsConfigPath": "apps/client-api/tsconfig.json"
      }
    }
    ...
  ```
  - Creating API envs
  ```ts
   ...
   //.env
   PORT_CLIENT_API=5000
   CLIENT_API_URL=http://0.0.0.0:5000
   ...
  ```

  - Creating API enum envs
  ```ts
    ...
    //libs/modules/global/secrets/enum.ts
    export enum ClientAPIEnvironment {
      PORT = 'PORT_CLIENT_API',
      URL = 'CLIENT_API_URL',
    }
    ...
  ```
  - Creating API secrets contract
  ```ts
    ...
    //libs/modules/global/secrets/adapter.ts
    clientAPI: {
      port: ClientAPIEnvironment | number;
      url: ClientAPIEnvironment | string;
    };
    ...
  ```
  - Creating API secrets implementaion
  ```ts
    clientAPI = {
      ...
      //libs/modules/global/secrets/service.ts
      port: this.get<number>(ClientAPIEnvironment.PORT),
      url: this.get<string>(ClientAPIEnvironment.URL),
      ...
    };
  ```
  - Creating API execution
  ```ts
   ...
   //package.json
   "scripts": {
      "start:client-api:dev": "nest start @app/client-api --debug --watch",
      "start:client-api:prd": "node dist/apps/client-api/main.js"
    }
   ...
  ```
  - Adding API install commmand to 'monorepo:install'
  ```ts
   ...
   //package.json
   "scripts": {
      "monorepo:install": "...... && yarn workspace @app/client.api install"
    }
   ...
  ```
