import siteInfo from "./siteInfo.js";

// The posts in JSON Feed format
export default (posts) => ({
  version: "https://jsonfeed.org/version/1.1",
  title: siteInfo.title,
  description: siteInfo.description,
  feed_url: `${siteInfo.url}/feed.json`,
  home_page_url: siteInfo.url,

  // Map the post data to JSON Feed items
  items: Object.entries(posts).map(([slug, post]) => ({
    // Patch image URLs to be absolute
    content_html: post.body.replace(/src="\//g, `src="${siteInfo.url}/`),
    date_published: post.date,
    id: `${siteInfo.url}/posts/${slug}`,
    title: post.title,
    url: `${siteInfo.url}/posts/${slug}`,
  })),
});
