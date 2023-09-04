const listHelper = require('../utils/list_helper');
const testHelper = require('../helpers/test_helper');

describe('total likes', () => {
  test('test multiple blogs', () => {
    const result = listHelper.totalLikes(testHelper.blogs);
    expect(result).toBe(31);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(testHelper.listWithOneBlog);
    expect(result).toBe(5);
  });

  test('empty blogs return 0', () => {
    const blogs = [];
  
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });
});

describe('favorite blog', () => {
  test('multiple blogs', () => {
    const favorite = { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 };
    const result = listHelper.favoriteBlog(testHelper.blogs);
    expect(result).toEqual(favorite);
  });

  test('single blog', () => {
    const favorite = { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5 };
    const result = listHelper.favoriteBlog(testHelper.listWithOneBlog);
    expect(result).toEqual(favorite);
  });

  test('empty blogs', () => {
    expect(listHelper.favoriteBlog([])).toEqual({});
  });
});

describe('most blogs', () => {
  test('multiple blogs', () => {
    const most = { author: 'Robert C. Martin', blogs: 3 };
    const result = listHelper.mostBlogs(testHelper.blogs);
    expect(result).toEqual(most);
  });

  test('single blog', () => {
    const most = { author: 'Edsger W. Dijkstra', blogs: 1 };
    const result = listHelper.mostBlogs(testHelper.listWithOneBlog);
    expect(result).toEqual(most);
  });

  test('empty blogs', () => {
    expect(listHelper.mostBlogs([])).toEqual({});
  });
});

describe('most likes', () => {
  test('multiple blogs', () => {
    const most = { author: 'Edsger W. Dijkstra', likes: 12 };
    const result = listHelper.mostLikes(testHelper.blogs);
    expect(result).toEqual(most);
  });

  test('single blog', () => {
    const most = { author: 'Edsger W. Dijkstra', likes: 5 };
    const result = listHelper.mostLikes(testHelper.listWithOneBlog);
    expect(result).toEqual(most);
  });

  test('empty blogs', () => {
    expect(listHelper.mostLikes([])).toEqual({});
  });
});