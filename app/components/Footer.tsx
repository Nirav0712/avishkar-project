import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#16243E] text-white pt-16">

      <div className="max-w-7xl mx-auto px-6">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1 - About */}
          <div>
            <img src="/images/logo.png" alt="logo" className="w-66 mb-6" />

            <p className="text-white/70 leading-relaxed mb-6">
              Building modern, sustainable, and customer-focused real estate
              solutions that turn dreams into addresses.
            </p>

            <div className="flex gap-3">

              {/* Facebook */}
              <a
                href="https://www.facebook.com/avishkar.realty.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877F2] text-white rounded-lg flex items-center justify-center hover:scale-110 transition"
              >
                <i className="fab fa-facebook-f text-lg"></i>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/ajay_prajapati_1709"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-linear-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-lg flex items-center justify-center hover:scale-110 transition"
              >
                <i className="fab fa-instagram text-lg"></i>
              </a>

            </div>

          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Link</h4>

            {/* <ul className="space-y-3 text-white/70">
              {["Home", "About", "Properties", "New Projects", "Blog", "Contact"].map(
                (item, i) => (
                  <li key={i} className="flex items-center gap-2 hover:text-orange-500 transition">
                    <span className="text-orange-500 text-sm">»</span>
                    <Link href="#">{item}</Link>
                  </li>
                )
              )}
            </ul> */}

            <ul className="space-y-3 text-white/70">
              {[
                { name: "Home", url: "/" },
                { name: "About", url: "/about-us" },
                { name: "Properties", url: "/properties" },
                { name: "New Projects", url: "/new-projects" },
                { name: "Blog", url: "/blog" },
                { name: "Contact", url: "/contact" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 hover:text-[#e4c272] transition-colors duration-300"
                >
                  <span className="text-[#e4c272] text-sm">»</span>
                  <Link href={item.url} className="hover:text-[#e4c272]">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>

            <ul className="space-y-3 text-white/70">
              {[
                "Retail Space Leasing",
                "Property Management",
                "Interior Design",
                "Consultancy & Research",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 hover:text-[#e4c272] transition">
                  <span className="text-[#e4c272] text-sm">»</span>
                  <Link href="#">{item}</Link>
                </li>
              ))}
            </ul>


          </div>

          {/* Column 4 - Gallery */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Gallery</h4>

            <div className="grid grid-cols-3 gap-3  w-300px ">
              {[
                "photo-1505761671935-60b3a7427bad",
                "photo-1501183638710-841dd1904471",
                "photo-1512917774080-9991f1c4c750",
                "photo-1493809842364-78817add7ffb",
                "photo-1570129477492-45c003edd2be",
                "photo-1505761671935-60b3a7427bad",
              ].map((id, i) => (
                <div key={i} className="overflow-hidden rounded hover:text-[#e4c272]">
                  <img
                    src={`https://images.unsplash.com/${id}`}
                    alt="gallery"
                    className="w-full h-70px object-cover hover:scale-110 transition duration-300 hover:text-[#e4c272] group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Orange Bar */}
        <div className="mt-16 mb-6">
          <div className="bg-[#fafafa66] text-[#0f1e3d] rounded-full px-8 py-4 flex flex-col md:flex-row justify-between items-center text-sm">

            <p>
              © 2025 Copyrights by Avishkar. Developed by <span>
                <a href="https://thedigitalconnect.in/" className="hover:underline text-[#0f1e3d] hover:text-[#e4c272] transition">
                  The Digital Connect
                </a></span>
            </p>

            {/* <div className="flex gap-6 mt-2 md:mt-0">
              <Link href="#" className="hover:underline">
                Terms & Conditions
              </Link>
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
            </div> */}

            <div className="flex gap-6 mt-2 md:mt-0">

              <a href="/terms" className="hover:underline text-[#0f1e3d] hover:text-[#e4c272] transition">
                Terms & Conditions
              </a>

              <a href="/privacy" className="hover:underline text-[#0f1e3d] hover:text-[#e4c272] transition">
                Privacy Policy
              </a>

            </div>


          </div>
        </div>

      </div>
    </footer>
  );
}

