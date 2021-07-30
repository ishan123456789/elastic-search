## Development

1. Run `yarn` or `npm install`
2. Copy `.env-example` to `.env` making sure you update the values as per your environment.
3. Run `yarn dev` or `npm run dev`

### Running Tests

Run `yarn test` or `npm test` to run jest on all the test files in src folder.
To run on specific one run like this:
`yarn test elasticSearch.controller.test.ts`

### Linting and formatting

This project run lint and prettier format in pre commit hook to do it manually

-   You can run `yarn lint` or `npm run lint` to fix eslint issues globally

-   You can run `yarn prettier` or `npm run prettier` to fix formatting issues globally

## Routes

Currently `/` `/es` `/healthz` are exposed without authorization and can be accessed

## Setup

### Prettier setup for good development experience

For allowing format on save option make sure you have this plugin installed in you VSCode

```
Name: Prettier - Code formatter
Id: esbenp.prettier-vscode
Description: Code formatter using prettier
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
```

## Configurations

TypeScript v4.3 [default tsconfig](https://github.com/microsoft/TypeScript-Node-Starter/blob/master/tsconfig.json)

[GitIgnore](https://github.com/github/gitignore/blob/master/Node.gitignore)
