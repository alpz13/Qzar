## Directory structure

META Doc compiles HTML and Markdown files into pages and page sections. Learn how to structure your documentation.

### Pages

:::sidecode
Following files and directories:

```plain
./pages/Root_section_A.md
       /Root_section_B.md
       /Page_A/Page_section_1.md
              /Page_section_2.html
```

will result in:

```plain
- Root section A
- Root section B
+ Page A
  - Section 1
  - Section 2
```
:::

Directory `pages` is where your documentation source exists.

- Each **subdirectory** is parsed as a **Page**.
- Each **file** is parsed as page **Section**.

Look at example for better understanding.

Also take a look at following or continue reading.

- [Naming of sections and pages](#02_Naming)
- [How to create sections](#03_Sections)
- [Pages and it's configuration](#04_Pages)

:::clear :::

### Site

:::sidecode
```plain
./site/index.html
      /page-1/index.html
             /sub-page/index.html
      /page-2/index.html
      /page-3/index.html
```
:::

Directory `site` is where your documentation HTML is generated.

This directory is always cleared and content is re-generated.

**So do not modify it's content**.

:::clear :::

### Media

:::sidecode
```plain
./media/screenshot.png
       /my_icon.png
       /package.zip
       /...etc...
```

```markdown
Using constant in makrdown link:
[Some link]({!{media}}/media_file.png)
```
:::

Put your images and files into `media` directory.

This directory is directly copied into `site/media` directory.

You can reference to this site directory in your documentation files by using **`media`** constant. [Read more about constants](#15_Constants).

:::clear :::

### Template

:::sidecode
```plain
./template/default.jade
          /another_template.jade
          /assets/main.css
                 /header.png
                 /...etc...
```
:::

Directory `template` is optional.

If present then template in this directory is used. By default META Doc is using it's default template packed with module.

Templates are using [JADE templating engine](http://www.jade-lang.com/).

:::clear :::

### config.json

:::sidecode
```json
{
  "title": "My documentation",
  "header_title": "My documentation",
  "header_github": "https://github.com/metaplatform/meta-doc"
}
```
:::

File `config.json` contains global documentation configuration.

Configuration object is used mostly by templates.

See [Global configuration section](#14_Global_configuration) for more details.

:::clear :::

### Special files

Files and directories prefixed by underscore, eg.: `_hidden.md` are ignored and not compiled as sections.

One of these special files are `_excerpt.md` and `_excerpt.html`. See [Excerpt section](#05_Excerpt).