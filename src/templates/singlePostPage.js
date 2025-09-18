import page from "./page.js";
import postFragment from "./postFragment.js";

// A page showing a single post
export default (post, key, posts) =>
  page({
    title: post.title,
    body: `
      ${postFragment(post, key)}
      <p>
        ${
          post.previousKey
            ? `
              <a class="previous" href="${post.previousKey}">
                Previous: ${posts[post.previousKey].title}
              </a>
              &nbsp;
            `
            : ""
        }
        ${
          post.nextKey
            ? `
                <a class="next" href="${post.nextKey}">
                  Next: ${posts[post.nextKey].title}
                </a>
              `
            : `
                <a class="next" href="/">
                  Back to home
                </a>
              `
        }
      </p>
    `,
  });
