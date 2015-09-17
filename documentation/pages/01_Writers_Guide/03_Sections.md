## Sections

Sections are visualy separated parts of page with anchors. So you can easily navigate between them.

Sections can be written using **Makrdown** or **HTML**.

::: sidecode
#### Sample Makrdown section
Section.md
```markdown
# Heading 1
Some paragraph

- List item
- List item
```
:::

### Using Markdown

To create Markdown section just created a new file with **`.md`** extension.

Using Markdown is recommended because it suports easy content editing and most of additional formatting functions.

Take a look at this [[link href=https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet target=_blank ]]Markdown cheatsheet[[/link]].

If you will use HTML files then you must use template CSS classes directly.

::: sidecode
#### Sample HTML section
Section.html
```html
<h1>Heading 1</h1>
<p>Some paragraph</p>
<ul>
	<li>List item</li>
	<li>List item</li>
</ul>
```
:::

### Using HTML

To create HTML section just created a file with **`.html`** extension.

Contents of HTML file is directly rendered by template.

### Constants and shortcodes

You can use constants and shortcodes both in Markdown and HTML sections.

Look at [Constants](#15_Constants) and [Shortcodes](#08_Shortcodes) sections.