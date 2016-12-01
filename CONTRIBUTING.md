# Contributing to sonar-web-frontend-reporters

## Installation

1. Clone repository
1. Install dependencies

```sh
$ npm install
```

## Running tests

Launch the `npm test` command.
All tests and coding styles should pass if you want your contribution to be taken account.

## Coding styles

This project uses **ESLint** to ensure code consistency.
You can launch linting with the following command:

```sh
npm run lint
```

## Writing a reporter

1. First of all, create a file under `reporters/` for your new reporter. It should match the following syntax: **new-reporter.reporter.js**.
1. The new reporter must extends the `Reporter` class and implement `defaultOptions` and `launch` methods
1. Add a new reporter type in the `reporter.enum.js` file

```js
const ReporterType = {
  NEWREPORTER: 'newreporter'
}
```
1. Register the reporter in the `ReporterFactory`

```js
switch (type) {
  case ReporterType.NEWREPORTER:
    opts = ReporterFactory.mergeOptions(options, NewReporter.defaultOptions());
    reporter = new NewReporter(opts, projectName);
    break;
}
```
1. Export the reporter so that anyone can use it (`index.js`)

```js
module.exports = {
  NewReporter: require('./reporters/new-reporter.reporter')
};
```
1. Update README
    * **Default options** section
    * **Available reporters** section

## Commit Message Format

There are very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking through the project history, but also allows us to generate the CHANGELOG.md.

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message should not be longer 100 characters, this allows the message to be easier to read on GitHub as well as in various git tools.

### Type

Must be one of the following:

```
feat:     A new feature
fix:      A bug fix
docs:     Documentation only changes
style:    Changes that do not affect the meaning of the code
          (white-space, formatting, missing semi-colons, etc)
refactor: A code change that neither fixes a bug or adds a feature
perf:     A code change that improves performance
test:     Adding missing tests
chore:    Changes to the build process or auxiliary tools
          and libraries such as documentation generation
```

### Scope

The scope could be anything specifying which part or aspect of the project changed. For example `logging`, `npm`, `readme`, `release`, `shell`, `shrinkpack`, `shrinkwrap`, `tests`, `workflow`, etc...

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".

The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.
