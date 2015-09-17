## Redirects

META Doc comes with second `rewrite` compiler which generates rewrite rules for apache `.htaccess` and built-in testing server.

:::sidecode
### Sample structure
```plain
./pages/_404/config.json
            /_excerpt.md
            /content.md
```

### Sample `config.json`
```json
{
	"icon": "alert-octagon",
	"hidden": true
}
```
:::

### 404 Error page

If directory `_404` exists in `<pages>` then this page will be served as 404 response.

::: warning
Don't forget that `_404` is regular page and will be in navigation tree by default.

To correct this behavour you should create `config.json` file in `_404` directory and set property `hidden` to `true`.
:::

Documentation skeleton already contains Error 404 page.

:::clear :::

:::sidecode
### Redirect examples
```json
{
	"^beginners-guide/$": "writers-guide/",
	"^contact/$": "support/#contact"
}
```
:::

### Custom redirects

You can specify custom redirect rules in [Global configuration](#14_Global_configuration) file `config.json`.

Rules are written as an object where key is pattern and value is new URL.

::: warning
Due to compatibility with .htaccess **old and new urls should NOT be starting with slash**.
:::

### Where to go next?

[[cta href=../usage/ ]][[icon console /]] Usage[[/cta]] [[cta href=../api-reference/ ]][[icon code-tags /]] API Reference[[/cta]]