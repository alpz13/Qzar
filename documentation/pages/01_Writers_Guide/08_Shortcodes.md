## Shortcodes

Shortcodes adding extra formatting functionality. Shortcodes are enclosed in double brackets - see example codes.

### Icon

:::sidecode
```plain
\[[icon school /]]
\[[icon book-open /]]
\[[icon code-tags /]]
```
:::

```plain
\[[icon name /]]
```

Adds MDI icon.

Attribute `name` specifies icon name without `mdi-` prefix.

[[icon school /]] or [[icon book-open /]] or [[icon code-tags /]]

:::clear :::

### Link

:::sidecode
```plain
\[[link href=http://www.google.com ]]Link to google[[/link]]
\[[link href=http://www.google.com target=_blank ]]Link to google which opens in new window[[/link]]
```
:::

```plain
\[[link href=target_url target=link_target ]]Link label[[/link]]
```

Adds hyperlink with support of target attribute.

[[link href=http://www.google.com ]]Link to google[[/link]]  
[[link href=http://www.google.com target=_blank ]]Link to google which opens in new window[[/link]]

:::clear :::

### Call-to-action button

:::sidecode
```plain
\[[cta href=http://www.google.com/ target=_blank ]]Open google[[/link]]
\[[cta href='http://www.google.com/' ]]\[[icon arrow-right-bold-hexagon-outline /]]Open google[[/link]]
```
:::

```plain
\[[cta href=target_url target=link_target ]]Button label[[/link]]
```

Adds nice visual button with hyperlink.

[[cta href=http://www.google.com/ target=_blank]]Open google[[/cta]]

[[cta href='http://www.google.com/']][[icon arrow-right-bold-hexagon-outline /]]Open google[[/cta]]

:::clear :::

::: warning
**Markdown parser rewrites double-quotes to entities so if you need quotes in shortcode arguments you must use single `'...'` quotes.**
:::