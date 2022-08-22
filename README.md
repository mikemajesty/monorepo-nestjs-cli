# Nestjs CLI monorepo

### [Monorepo](https://github.com/mikemajesty/nestjs-monorepo) CLI

### install
  - 
    ```
    $ npm i -g @mikemajesty/monorepo-nestjs-cli
    ```
  ---
### Usage
  - 1 - type cli command
    ```bash
    $ monorepo-nestjs-cli
    ```
  - 2 - select template type [API, MODULE, TEST]
    [<img alt="mikemajesty" src="https://raw.githubusercontent.com/mikemajesty/monorepo-nestjs-cli/master/img/select-template.png">](https://github.com/mikemajesty)

  - 3 - type template name
    [<img alt="mikemajesty" src="https://raw.githubusercontent.com/mikemajesty/monorepo-nestjs-cli/master/img/template-name.png">](https://github.com/mikemajesty)
  - 4 - Select path template
    ```bash
    # API must be inside [apps] folder - nestjs-monorepo/apps/
    # MODULE must be inside [api] folder - nestjs-monorepo/apps/auth-api/src/modules/
    # TEST must be inside [modules] folder - nestjs-monorepo/apps/auth-api/src/modules/login/
    ```
  
---
### API skeleton
```
.
└── main-api
    ├── Dockerfile
    ├── jest.config.js
    ├── package.json
    ├── src
    │   ├── main.ts
    │   └── modules
    │       ├── health
    │       │   ├── adapter.ts
    │       │   ├── controller.ts
    │       │   ├── module.ts
    │       │   ├── service.ts
    │       │   ├── swagger.ts
    │       │   └── __tests__
    │       │       ├── controller.e2e.spec.ts
    │       │       ├── module.spec.ts
    │       │       └── service.spec.ts
    │       └── module.ts
    ├── tests
    │   └── initialization.js
    ├── tsconfig.build.json
    └── tsconfig.json
```

### MODULE skeleton
```
.
└── module
    ├── adapter.ts
    ├── controller.ts
    ├── module.ts
    ├── service.ts
    ├── swagger.ts
    └── __tests__
        ├── controller.e2e.spec.ts
        ├── module.spec.ts
        └── service.spec.ts
```
### TEST skeleton
```
.
└── __tests__
    ├── controller.e2e.spec.ts
    ├── module.spec.ts
    └── service.spec.ts
```
---
The following is a list of all the people that have contributed Nestjs monorepo CLI. Thanks for your contributions!

[<img alt="mikemajesty" src="https://avatars1.githubusercontent.com/u/11630212?s=460&v=4&s=117" width="117">](https://github.com/mikemajesty)

## License

It is available under the MIT license.
[License](https://opensource.org/licenses/mit-license.php)