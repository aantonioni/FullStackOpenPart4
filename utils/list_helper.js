const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const favorite = blogs.reduce((prev, current) => current.likes > prev.likes ? current : prev , blogs[0]);
  return { title: favorite.title, author: favorite.author, likes: favorite.likes };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  let blogCounts = blogs.reduce((ret, blog) => {
    ret[blog.author] = ret[blog.author] !== undefined ? ret[blog.author] + 1 : 1;
    return ret;
  }, {});

  return Object.keys(blogCounts).reduce((ret, author) => {
    if (ret.blogs === undefined || ret.blogs < blogCounts[author]) {
      ret.author = author;
      ret.blogs = blogCounts[author];
    }
    return ret;
  }, {});
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  let likeCounts = blogs.reduce((ret, blog) => {
    ret[blog.author] = ret[blog.author] !== undefined ? ret[blog.author] + blog.likes : blog.likes;
    return ret;
  }, {});

  return Object.keys(likeCounts).reduce((ret, author) => {
    if (ret.likes === undefined || ret.likes < likeCounts[author]) {
      ret.author = author;
      ret.likes = likeCounts[author];
    }
    return ret;
  }, {});
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};