:::sidecode
## Registering custom helpers

```javascript
doc.addHelper([ require('markdown-it-attrs') ]);

doc.addHelper([ require('markdown-it-highlightjs') ]);

doc.addHelper([
	require('markdown-it-container'),
	"message"
]);
```
:::

## `addHelper(args)` {.tag .func}

Method registers new compiler helper.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| args | array | Array of arguments passed to `makrkdown-it` module method `use`. |

META Doc is using [makrkdown-it](https://www.npmjs.com/package/markdown-it) module. Look at it's documentation for more information.

You can also browse [NPM index](https://www.npmjs.com/browse/keyword/markdown-it-plugin) for various `markdown-it` plugins.

:::clear :::