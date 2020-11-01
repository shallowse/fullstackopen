const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const numLikes = blogs.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.likes;
  }, 0);
  return numLikes;
};

const favoriteBlog = (blogs) => {
  // https://stackoverflow.com/q/33248579
  const favorite = blogs.reduce((a, b) => { return a.likes >= b.likes ? a : b; }, 0);
  return favorite;
};

// Helper function to calculate blog stats
// used by mostBlogs() and mostLikes()
const blogStats = (blogs) => {
  let entityArray = [
    {
      author: blogs[0].author,
      blogs: 0,
      likes: blogs[0].likes,
    },
  ];

  for (let i = 0; i < blogs.length; i++) {
    let found = false;
    for (let j = 0; j < entityArray.length; j++) {
      if (blogs[i].author === entityArray[j].author) {
        entityArray[j].blogs += 1;
        entityArray[j].likes += blogs[i].likes;
        found = true;
        break;
      }
    }
    if (!found) {
      entityArray = entityArray.concat({
        author: blogs[i].author,
        blogs: 1,
        likes: blogs[i].likes,
      });
    }
  }

  return entityArray;
};

const mostBlogs = (blogs) => {
  const entityArray = blogStats(blogs);
  //console.log(entityArray);

  const maxEntity = entityArray.reduce((a, b) => { return a.blogs >= b.blogs ? a : b; }, 0);

  //console.log(maxEntity);
  return { author: maxEntity.author, blogs: maxEntity.blogs };
};

const mostLikes = (blogs) => {
  const entityArray = blogStats(blogs);
  const maxLikes = entityArray.reduce((a, b) => { return a.likes >= b.likes ? a : b; }, 0);
  //console.log(maxLikes);
  return { author: maxLikes.author, likes: maxLikes.likes };
};


// Used for testing functionality
/*
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type 1',
    author: 'Testaaja',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type 2',
    author: 'Testaaja',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type 3',
    author: 'Testaaja',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 10,
    __v: 0
  },
];

mostBlogs(blogs);
mostLikes(blogs);
*/

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
