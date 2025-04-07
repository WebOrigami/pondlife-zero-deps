import siteInfo from "../siteInfo.js";
import page from "./page.js";
import postFragment from "./postFragment.js";

// A page showing multiple posts
export default (paginated) => {
  const { items, nextPage, previousPage } = paginated;
  const postFragments = Object.entries(items).map(([key, post]) =>
    postFragment(post, key)
  );
  return page({
    title: siteInfo.title,
    area: "home",
    body: `
      <h1>${siteInfo.title}</h1>
      <p>${siteInfo.description}</p>
      ${postFragments.join("\n")}
      <p>
        ${
          nextPage
            ? `
              <a class="next" href="/pages/${nextPage}.html"><strong>Older posts</strong></a>
              <span>&nbsp;</span>
            `
            : ""
        }
        ${
          previousPage
            ? `
              <a class="previous" href="${
                previousPage == 1 ? "/" : `/pages/${previousPage}.html`
              }"><strong>Newer posts</strong></a>
            `
            : ""
        }
      </p>
      <footer>
        <a href="/feed.xml">RSS feed</a>
        <a href="/feed.json">JSON feed</a>
        <a href="https://github.com/WebOrigami/origami-blog-start">View source</a>
      </footer>
    `,
  });
};
