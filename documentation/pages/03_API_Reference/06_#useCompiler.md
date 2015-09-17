:::sidecode
## Registering custom compiler

```javascript
var fs = require("fs");

var myCompiler = function(opts, pagesTree, config){

	this.options = opts;
	this.pagesTree = pagesTree;
	this.config = config;
	
};

myCompiler.prototype.compile = function(){

	fs.writeFileSync(this.options.outputDir + "/test.random", Math.random());
	
};

doc.useCompiler(myCompiler);
```
:::

## `useCompiler(compiler)` {.tag .func}

Method registers new compiler.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| compiler | function | Constructor of compiler instance. |

### Compiler instance

Compiler instance must implement follwing methods:
- #constructor(opts, pagesTree, globalConfig)
- #compile(changedPages, changedFiles)

For more information look at source code of:
- `./lib/treeParser.js` (pagesTree instance)
- `./lib/compiler.js` (default compiler)
- `./index.js` (compile method)

:::clear :::