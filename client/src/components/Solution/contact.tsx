import React from 'react';
import { FaFacebook, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // Import Facebook icon
import Image from 'next/image'; // Import the Image component from Next.js
import contact from "@/assets/contact.webp"; // Make sure this path is correct

function Contact() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-stretch bg-cream min-h-screen p-10 space-x-4">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 relative">
        <div className="relative h-full"> {/* Ensure this div takes the full height */}
          <Image
            src={contact}
            alt="Contact Image"
            className="rounded-lg object-cover"
            layout="fill" // Fill the parent container
            objectFit="cover" // Maintain the aspect ratio and cover the entire area
          />
          
        </div>
      </div>

      {/* Right Contact Form */}
      <div className="w-full md:w-1/2 p-8 rounded-lg shadow-md flex flex-col justify-between"> {/* Added flex and justify-between */}
        <div>
          <h3 className="text-2xl font-bold mb-2 text-center">Message Us</h3>
          <p className="text-center text-gray-500 mb-6">Get in Touch with us ✨</p>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Email"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Name"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Your Message
              </label>
              <textarea
                id="message"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Your Message"
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Send ➤
            </button>
          </form>
        </div>

        {/* Add icons in the bottom right */}
        <div className="flex justify-end mt-4 space-x-4">
          <a href="#whatsapp" className="text-red-500 text-xl">
            <FaPhoneAlt />
          </a>
          <a href="#scroll-top" className="text-red-500 text-xl">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
