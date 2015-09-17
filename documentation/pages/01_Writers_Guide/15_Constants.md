## Constants

META Doc compiler rewrites few usefull constants.

Constants can be wrapped:
 - Into double brackets **`{{name}}`**
 - Between dollar signs **`$name$`**.

Two ways instead of one are provided because of different behaviour of JADE and Markdown languages.

### Constant list

:::sidecode
```plain
{!{base}}
{!{media}}
{!{assets}}
```

```plain
$!base$
$!media$
$!assets$
```
:::

| Name | Description |
| ---- | ----------- |
| base | URL path to generated site root. |
| media | URL path to media directory in generated site. |
| assets | URL path to template assets directory in generated site. |

### Escaping

If you need to display these constants in your documentation like in this section you have to write **`!`** character after first bracket of after first dolar sign.