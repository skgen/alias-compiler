# @patriarche/alias-compiler

## Installation

```bash
yarn add @patriarche/alias-compiler
```

## Example build file

```javascript
const path = require('path');
const compiler = require('@patriarche/alias-compiler');

compiler.build({
  root: path.resolve(__dirname, '..'),
  entry: 'src',
  output: 'dist',
  // dry: true,
  aliases: [
    {
      find: '@src',
      replacement: 'src',
    },
  ],
});

```