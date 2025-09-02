
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <h1 className="text-3xl font-bold text-white tracking-wider">
          <span className="text-indigo-400">VEO-3</span> Video Generator
        </h1>
        <p className="text-gray-400 mt-1">Bring your ideas to life with generative video</p>
      </div>
    </header>
  );
};

export default Header;
