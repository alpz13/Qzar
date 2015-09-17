## Naming

:::sidecode
```plain
Section.md        -> Section
Section.html      -> Section
1_Section.md      -> Section
01_Section.md     -> Section
001_Section.md    -> Section
My_section.md     -> My section
Another_file.html -> Another file
```
:::

Labels of pages and sections are generated from filename by following rules.

- Underscores are replaced with spaces
- Number at beginning is stripped out
- File extension is stripped out

:::clear :::

### Ordering

:::sidecode
```plain
01_First_section.md    -> First section
02_Second_section.md   -> Section section
03_Third_section.md    -> Third section
Another_section.md     -> Another section
```
:::

Pages and sections are ordered ascending by their filenames.

To order it just prefix filename by a number. It will be stripped out.

Look at example for better understanding.