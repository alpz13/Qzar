:::sidecode
## Registering custom shortcode

```javascript
doc.addShortcode("contact", function(opts, content){
	
	if(!opts.first_name || !opts.last_name) return "[Invalid arguments]";
	return '<h2>' + opts.first_name + " " + opts.last_name + '</h2>\n<p class="job-title">' + opts.join(", ") + '</p>\n<p class="about">' + contents + '</p>';

});
```

Using custom shortcode:

```plain
\[[contact first_name=John last_name=Doe CEO Founder]]Lorem ipsum...[[/contact]]
```

Results in:

```html
<h2>John Doe</h2>
<p class="job-title">CEO, Founder</p>
<p class="about">Lorem ipsum...</p>
```
:::

## `addShortcode(name, handlerFn)` {.tag .func}

Method registers new shortcode.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| name | string | Shortcode tag name. |
| handlerFn | function | Function which is called when processing shortcode. Function returns replacement string. |

META Doc is using [meta-shortcodes](https://github.com/metaplatform/meta-shortcodes) library and uses it's API. Look at it's documentation for more information.

:::clear :::