# Change Log

## 1.3.0

- Upgraded dev dependencies to latest stable versions (ESLint 9, TypeScript 5.9, @typescript-eslint v8)
- Migrated ESLint configuration to flat config (`eslint.config.js`) and fixed rules incompatible with newer plugin

## 1.2.0

- Updated all dependencies to latest compatible versions
- Replaced deprecated `vscode` package with `@types/vscode`
- Removed deprecated `postinstall` script
- Updated VSCode engine requirement to ^1.74.0
- Removed deprecated `activationEvents` configuration
- Updated TypeScript to 5.3.3 with ES2020 target
- Updated ESLint and TypeScript ESLint packages to latest compatible versions
- Updated testing packages and Mocha to latest versions
- Pinned minimatch to compatible version for glob compatibility

## 1.1.0

- When creating new file with .cs extension you will get same options to create file
- Can now create new file from command pallette and insert file to current location
- Option to show or hide context menu on files

## 1.0.1

- New C# Class Template bug fix

## 1.0.0

- New templates
  - Old Class
  - Interface
  - Old Interface
- Settings added
  - Can toggle context menu
  - Toggle menu items
- Tested on windows and linux
- CI publish and linting

## 0.0.2

- Fixed bug where command fixNamespace was called before activated
- Added eslint and fixed lint issues
- Added tests

## 0.0.1

- Create new class
- Fill Namespace
- Fix Namespace
