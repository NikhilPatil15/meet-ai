import React from 'react';

 function Review() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="flex justify-center items-center mt-20 md:mt-40 font-bold max-w-4xl text-center">
        <h1 className="text-white text-3xl md:text-5xl">
          What people are saying about Room apps and how to feel it
        </h1>
      </div>

      <div className="text-gray-300 text-lg md:text-xl mt-4 md:mt-6 max-w-4xl text-center">
        Find out what people have to say about Room Apps and experience it for yourself.
        See how it's making a positive impact on users and take it for a spin to feel the difference.
      </div>

      {/* Uncomment and adjust the elements below as needed */}
      {/* <div className="flex flex-col md:flex-row justify-center items-center mt-4">
        <a
          href="#"
          className="border border-solid py-1.5 px-3 rounded-md m-2 md:m-4 bg-pr-button text-white font-semibold shadow-md hover:bg-blue-500"
        >
          Download Now
        </a>
        <input
          className="search-input w-64 md:w-96 h-9 bg-slate-700 text-white placeholder-white px-4 mt-2 md:mt-0"
          placeholder="Search..."
        />
      </div> */}
    </div>
  );
}
export default Review;