// The posts in JSON Feed format
export default (posts) => ({
  version: "https://jsonfeed.org/version/1.1",
  title: "#pondlife",
  description: "Dispatches from off the grid",
  feed_url: `https://pondlife.netlify.app/feed.json`,
  home_page_url: "https://pondlife.netlify.app",

  // Map the post data to JSON Feed items
  items: Object.entries(posts).map(([slug, post]) => ({
    content_html: post.body,
    date_published: post.date,
    id: `https://pondlife.netlify.app/posts/${slug}`,
    title: post.title,
    url: `https://pondlife.netlify.app/posts/${slug}`,
  })),
});
