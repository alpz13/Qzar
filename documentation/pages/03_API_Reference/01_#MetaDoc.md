:::sidecode
## How to create generator object

```javascript
var MetaDoc = require("../index.js");

try {
	
	var doc = MetaDoc({
		media:    "./my-media",
		pages:    "./my-pages",
		site:     "./my-site",
		template: "./my-template",
		assets:   "./my-template/assets",
		config:   "./my-config.json",
		cache:    "./my-cache.json"
	});

	doc.on("error", function(e){
		//Handler error
		console.error(e.toString());
	});

} catch(e) {
	logger.error(e.toString());
}
```
:::

## `MetaDoc(opts)` {.tag .func}

Constructor accepts configuration object with following properties.

| Property name | Type   | Description                                      | Default value     |
| ------------- | ------ | ------------------------------------------------ | ----------------- |
| media         | string | Path to source media directory.                  | ./media           |
| pages         | string | Path to source pages directory.                  | ./pages           |
| site          | string | Path to documentation output directory.          | ./site            |
| template      | string | Path to documentation template directory.        | ./template        |
| assets        | string | Path to documentation template assets directory. | ./template/assets |
| config        | string | Path to global configuration file.               | ./config.json     |
| cache         | string | Path to compiler cache file.                     | ./cache.json      |

:::clear :::