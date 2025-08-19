# imports-prefix-vite-plugin

A Vite plugin that adds a prefix to local import paths in JavaScript and TypeScript files.

## Installation

```bash
# npm
npm install imports-prefix-vite-plugin --save-dev

# yarn
yarn add imports-prefix-vite-plugin --dev

# pnpm
pnpm add imports-prefix-vite-plugin -D
```

## Usage

Add the plugin to your `vite.config.js` or `vite.config.ts`:

```js
import { defineConfig } from 'vite';
import { addImportPrefix } from 'imports-prefix-vite-plugin';

export default defineConfig({
  plugins: [
    addImportPrefix({
      prefix: '/your-prefix/',
      // Optional: customize which files to process
      // fileRegex: /\.(js|ts|jsx|tsx)$/,
    }),
  ],
});
```

## How It Works

This plugin modifies import paths in your bundled files by adding a prefix to relative imports. It works with three types of import statements:

1. Regular imports with `from` statements:
   ```js
   // Before
   import { something } from './relative-path';
   // After
   import { something } from '/your-prefix/relative-path';
   ```

2. Side-effect imports:
   ```js
   // Before
   import './relative-path';
   // After
   import '/your-prefix/relative-path';
   ```

3. Dynamic imports:
   ```js
   // Before
   const module = import('./relative-path');
   // After
   const module = import('/your-prefix/relative-path');
   ```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prefix` | `string` | (required) | The prefix to add to import paths |
| `fileRegex` | `RegExp` | `/\.(js\|ts\|jsx\|tsx)$/` | Pattern to match files that should be processed |

## Examples

### Basic Usage

```js
addImportPrefix({
  prefix: '/my-app/',
})
```

### Custom File Matching

Process only js files:

```js
addImportPrefix({
  prefix: '/assets/',
  fileRegex: /\.js$/,
})
```

### Real-world Example

This plugin is particularly useful for scenarios where your deployment environment serves files from a different base path than your development environment.

```js
addImportPrefix({
  prefix: process.env.NODE_ENV === 'production' 
    ? '/deployed-app-path/' 
    : '/',
})
```

## License

MIT
