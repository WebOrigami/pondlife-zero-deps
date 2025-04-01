// Page showing multiple posts
export const multiPostPage = (paginated) =>
  page({
    title: `#pondlife — Page ${paginated.pageNumber}`,
    area: paginated.pageNumber == 1 ? "home" : null,
    body: `
      <h1>#pondlife</h1>
      <p>Dispatches from off the grid</p>
      ${
        // List all the posts on this page
        Object.entries(paginated.items)
          .map(([key, value]) => postFragment(value, key))
          .join("\n")
      }
      <p>
        ${
          paginated.nextPage
            ? `
              <a class="next" href="/pages/${paginated.nextPage}.html">
                <strong>Older posts</strong>
              </a>
              &nbsp;
            `
            : ""
        }
        ${
          paginated.previousPage
            ? `
              <a class="previous" href="${
                paginated.previousPage == 1
                  ? "/"
                  : `/pages/${paginated.previousPage}.html`
              }">
                <strong>Newer posts</strong>
              </a>
            `
            : ""
        }
      </p>
      <footer>
        <a href="/feed.xml">RSS feed</a>
        <a href="/feed.json">JSON feed</a>
        <a href="https://github.com/WebOrigami/pondlife">View source</a>
      </footer>
    `,
  });

// Base page
export const page = (page) => `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="/assets/styles.css">
      <link rel="alternate" type="application/rss+xml" title="Dispatches from off the grid" href="/feed.xml">
      <link rel="alternate" type="application/json" title="Dispatches from off the grid" href="/feed.json">
      <title>${page.title}</title>
    </head>
    <body ${page.area ? `class="${page.area}"` : ""}>
      <header>
        <a href="/" class="home">#pondlife</a>
        <a href="/about.html" class="about">About</a>
      </header>
      <main>
        ${page.body}
      </main>
    </body>
  </html>
`;

// A single blog post in a list
export const postFragment = (post, key) => `
  <section>
    <a href="/posts/${key}">
      <h2>${post.title}</h2>
    </a>
    ${post.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
    ${post.body}
</section>
`;

// Post page
export const singlePostPage = (post, key) =>
  page({
    title: post.title,
    body: postFragment(post, key),
  });
