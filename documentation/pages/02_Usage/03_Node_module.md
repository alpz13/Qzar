## Using as NodeJS module

You can also use META Doc as NodeJS module but you have to perform configuration and various actions manually.

:::sidecode-h3
```javascript
var MetaDoc = require("../index.js");

try {
	
	var doc = MetaDoc();

	doc.on("error", function(e){
		console.error(e.toString());
	});

	//Init
	doc.useDefaultShortcodes();
	doc.useDefaultHelpers();
	doc.cleanSite();
	doc.copyMedia();
	doc.copyAssets();
	doc.compile();

} catch(e) {
	logger.error(e.toString());
}
```
:::

### Compiling

To compile documentation you have to:

- Require `meta-doc` module
- Load default shortcodes
- Load default helpers
- Create DOC instance
- Clean site directory
- Copy neccesary files
- Compile documentation

::: info
This configuration will use current working directory as documentation root. You can specify each directory path by passing options object to `MetaDoc` constructor.
:::

:::clear :::

### Registering shortcodes

:::sidecode
```javascript
doc.addShortcode("upper", function(opts, content){
	return content.toUpperCase();
});
```
:::

Shortcodes can be registered using `addShortcode(name, handler)` method.

Default shortcodes can be registered by calling `useDefaultShortcodes()` method.

:::clear :::

### Registering helpers

:::sidecode
```javascript
doc.addHelper([
	require('markdown-it-container'),
	"message"
]);
```
:::

Markdown compiler helpers can be registered using `addHelper(args)` method.

Default helpers can be registered by calling `useDefaultHelpers()` method.

For available helpers take a look at [NPM index](https://www.npmjs.com/browse/keyword/markdown-it-plugin).

:::clear :::

### Watching for changes

:::sidecode
```javascript
doc.watch();
```
:::

To watch changes and automatically recompile site call `watch()` method.

:::clear :::

:::sidecode-h3
Example logger configuration:

```javascript
logger.toConsole({
    level: args.loglevel,
    timestamp: true,
    colorize: true
});
```
:::

### Logging

META Doc is using `meta-logger` module for console logging.

Visit [meta-logger](https://github.com/metaplatform/meta-logger) GitHub page for more information about logging configuration.