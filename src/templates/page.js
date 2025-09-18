import siteInfo from "../siteInfo.js";

// Base page template for all pages
export default (page) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="/assets/styles.css">
    <link rel="alternate" type="application/rss+xml" title="${
      siteInfo.description
    }" href="/feed.xml">
    <link rel="alternate" type="application/json" title="${
      siteInfo.description
    }" href="/feed.json">
    <title>${page.title}</title>
  </head>
  <body ${page.area ? `class="${page.area}"` : ""}>
    <header>
      <a href="/" class="home">${siteInfo.title}</a>
      <a href="/about.html" class="about">About</a>
    </header>
    <main>    
${page.body}
    </main>
  </body>
</html>
`;
