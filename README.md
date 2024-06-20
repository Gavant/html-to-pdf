### HTML to PDF (Using puppeteer)

Gavant package that handles requests to load an html page and return a pdf using s3.

To run this package locally - `LOCAL_CHROME_PATH` must be provided in the command line i.e.

```
LOCAL_CHROME_PATH="/PATH_TO_ADDON/html-to-pdf/node_modules/puppeteer/.local-chromium/mac-1011831/chrome-mac/Chromium.app/Contents/MacOS/Chromium" yarn test
```

Releases are handled by `release-it` and changelog is automatically generated using `auto-changelog`.

## API

A header and footer can be added to each pdf page by adding elements with IDs of `#header` and `#footer` respectively.
