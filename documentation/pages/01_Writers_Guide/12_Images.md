## Images

:::sidecode
```html
<img src="{{assets}}/my-image.png" />
```

or in Markdown

```markdown
![Alt text]($assets$/my-image.png)
```
:::

Images can be inserted using markdown-way or via HTML.

Maximal width of image is set via CSS to 100% of section width.

**So do not set image width and height properties or it will be deformed!**

:::clear :::

### Buil-in lightbox

:::sidecode
```markdown
#With image as a thumbnail
[![Directory screenshot][$media$/screenshot-directory.png]]($media$/screenshot-directory.png)

This [link to an image]($media$/screenshot-directory.png) will be opened in a lightbox.
This \[[link href=$media$/screenshot-directory.png target=_blank ]]link to an image[[/link]] will be opened in a new tab.
```
:::

If you create a link to an **`.jpg`** or **`.png`** image and link target is not `_blank` then image will be opened in a lightbox.

This [link to an image]($media$/screenshot-directory.png) will be opened in a lightbox.  
This [[link href=$media$/screenshot-directory.png target=_blank ]]link to an image[[/link]] will be opened in a new tab.