import React from "react";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-3 text-primary">📰 Newspaper</h2>
            <p className="text-sm leading-6">
              Get the latest headlines, breaking news, and in-depth reports
              from trusted sources.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">Home</a></li>
              <li><a href="#" className="hover:text-primary">World</a></li>
              <li><a href="#" className="hover:text-primary">Sports</a></li>
              <li><a href="#" className="hover:text-primary">Politics</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms</a></li>
              <li><a href="#" className="hover:text-primary">Advertise</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex space-x-4 mb-3">
              <a href="#" className="hover:text-primary"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" className="hover:text-primary"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" className="hover:text-primary"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="hover:text-primary"><i className="fa-brands fa-linkedin"></i></a>
            </div>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="input input-bordered w-full rounded-r-none"
              />
              <button className="btn btn-primary rounded-l-none">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="divider my-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Newspaper. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Developed by <span className="text-primary font-semibold">Towfik</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
