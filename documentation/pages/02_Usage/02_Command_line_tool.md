## Using as command line tool

```plain
Usage: meta-doc [-h] [-v] [--pages-dir PAGES] [--media-dir MEDIA]
                [--site-dir SITE] [--template TEMPLATE] [--assets-dir ASSETS]
                [--config CONFIG] [--cache CACHE] [-i] [-w] [-s] [--port PORT]
                [--verbose {log,debug,info,warn,error}]
                [directory [directory ...]]

Positional arguments:
  directory             Documentation directory

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  --pages-dir PAGES     Pages dir
  --media-dir MEDIA     Media dir
  --site-dir SITE       Site dir
  --template TEMPLATE   Template dir
  --assets-dir ASSETS   Assets dir
  --config CONFIG       Config JSON filename
  --cache CACHE         Cache filename
  -i                    Copy skeleton to selected directory
  -w                    Dynamically watch for changes and recompile
  -s                    Start express server
  --port PORT           Server port
  --verbose {log,debug,info,warn,error}
                        Logging verbose level
```

### Generating documentation once

Following example generates documentation in current directory to site dir.

```bash
meta-doc
```

### Creating new documentation
Following example will create new documentation to current directory using default skeleton.
```bash
meta-doc -i
```

### Running local server
Following example will start local server and will watch for changes. When something change the documentation will be recompiled.

Server listens by default on port `8080` so it is accessable at [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

```bash
meta-doc -s -w
```

::: success
**Auto-reload** {.title}

Special script is injected when running local server. When something has change then page in your browser is automatically reloaded.
:::