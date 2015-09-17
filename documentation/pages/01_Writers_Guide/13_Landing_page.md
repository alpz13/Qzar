:::sidecode
```plain
./pages/01_Page_1/...
./pages/02_Page_2/...
./pages/03_Page_3/...
./pages/04_Page_4/...
./pages/_excerpt.md
./pages/config.json
```

config.json:

```json
{
	"template": "landing"
}
```
:::

## Landing page template

Default documentation template comes with landing page sub-template.

Landing page template is default homepage for this sample docs.

It has no sidebar navigation and no sidecode. Page contents is full-width and excerpt acts as a header. We recommend to group pages at first to create nice and usable navigation.

To use landing page just set **`template`** property in page config to **`landing`** as code example shows.