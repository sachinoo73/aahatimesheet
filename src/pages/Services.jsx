const Services = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Video Production</h2>
          <p className="text-gray-600">Professional video production services for all your needs.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Photography</h2>
          <p className="text-gray-600">High-quality photography for events and commercial use.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Post Production</h2>
          <p className="text-gray-600">Expert editing and post-production services.</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
