## Pages

Each directory is compiled to a page and it's files are compiled as page sections.

But you can modify some behaviour using **page configuration file**.

### Page configuration

To configure a page just create **`config.json`** file into page directory. This also aplies to root directory.

Following configuration properties are available for this default template:

:::sidecode
### Sample page configuration
./pages/My_Page/config.json
```json
{
	"icon": "school",
	"slug": "getting-started",
	"hidden": false,
	"template": "my-template"
}
```
:::

| Property name | Description |
| ------------- | ----------- |
| icon | Specifies MDI icon name without `mdi-` prefix. |
| slug | Specifies custom URL slug for page that will be used instead of generated one. |
| hidden | Boolean value. If true page is then excluded from navigation tree but can be accessed directly by URL. |
| template | Specifies alternative template name - without `.jade` file extension. |