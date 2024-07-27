import React from 'react';

 function Footer() {
  return (
    <div className="flex flex-col md:flex-row ml-10 mr-10 text-white justify-evenly bg-gray-900 p-6 md:p-10 w-vw ">
      
      <div className="flex flex-col text-gray-300 mb-6 md:mb-0">
        <h3 className="font-bold my-5">MeetAi</h3>
      </div>

      <div className="flex flex-col text-gray-300 mb-6 md:mb-0">
        <h3 className="font-bold my-5">Company</h3>
        <a href="#" className="mb-2">Home</a>
        <a href="#" className="mb-2">About Us</a>
        <a href="#" className="mb-2">FAQ</a>
        <a href="#" className="mb-2">Pricing</a>
      </div>

      <div className="flex flex-col text-gray-300 mb-6 md:mb-0">
        <h3 className="font-bold my-5">Product</h3>
        <a href="#" className="mb-2">Meetings</a>
        <a href="#" className="mb-2">Meeting Notes <br /> Booking Page</a>
      </div>

      <div className="flex flex-col text-gray-300">
        <h3 className="font-bold my-5">Contact</h3>
        <a href="#" className="mb-2">Help Center</a>
        <a href="#" className="mb-2">Feedback</a>
        <a href="#" className="mb-2">Sales</a>
      </div>
      
    </div>
  );
}
export default Footer;