import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#16243E] text-white pt-16">

      <div className="max-w-7xl mx-auto px-6">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1 - About */}
          <div>
            <img src="/logo.png" alt="logo" className="w-56 mb-6" />

            <p className="text-white/70 leading-relaxed mb-6">
              Building modern, sustainable, and customer-focused real estate
              solutions that turn dreams into addresses.
            </p>

            <div className="flex gap-4 mt-6">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition">
                <i className="fab fa-facebook-f text-sm"></i>
              </div>
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition">
                <i className="fab fa-instagram text-sm"></i>
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Link</h4>

            <ul className="space-y-3 text-white/70">
              {["Home","About", "Properties", "New Projects", "Blog", "Contact"].map(
                (item, i) => (
                  <li key={i} className="flex items-center gap-2 hover:text-orange-500 transition">
                    <span className="text-orange-500 text-sm">»</span>
                    <Link href="#">{item}</Link>
                  </li>
                )
              )}
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
                <li key={i} className="flex items-center gap-2 hover:text-orange-500 transition">
                  <span className="text-orange-500 text-sm">»</span>
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
                "photo-1549880338-65ddcdfd017b",
                "photo-1493809842364-78817add7ffb",
                "photo-1491553895911-0055eca6402d",
                "photo-1505761671935-60b3a7427bad",
              ].map((id, i) => (
                <div key={i} className="overflow-hidden rounded hover:text-orange-500">
                  <img
                    src={`https://images.unsplash.com/${id}`}
                    alt="gallery"
                    className="w-full h-70px object-cover hover:scale-110 transition duration-300 hover:text-orange-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Orange Bar */}
        <div className="mt-16 mb-6">
          <div className="bg-[#E4572E] text-white rounded-full px-8 py-4 flex flex-col md:flex-row justify-between items-center text-sm">

            <p>
              © 2025 Copyrights by Avishkar. Developed by TDC
            </p>

            <div className="flex gap-6 mt-2 md:mt-0">
              <Link href="#" className="hover:underline">
                Terms & Conditions
              </Link>
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}

