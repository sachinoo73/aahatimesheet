const Blog = () => {
  const blogPosts = [
    {
      title: "Latest Production Techniques",
      excerpt: "Discover the cutting-edge techniques we use in our video productions...",
      date: "March 15, 2024",
      author: "John Doe"
    },
    {
      title: "Behind the Scenes: Recent Project",
      excerpt: "Take a look at how we brought our client's vision to life...",
      date: "March 10, 2024",
      author: "Jane Smith"
    },
    {
      title: "Industry Insights: Future of Production",
      excerpt: "Our take on where the production industry is heading...",
      date: "March 5, 2024",
      author: "Mike Johnson"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="text-sm text-gray-500">
                <p>{post.date}</p>
                <p>By {post.author}</p>
              </div>
              <button className="mt-4 text-blue-600 hover:text-blue-800">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
