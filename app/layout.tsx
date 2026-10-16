import type { Metadata } from "next";
import "./global.css";
import WhatsappButton from "./components/WhatsappButton";

export const metadata: Metadata = {
  title: "Avishkar Realty — Luxury Real Estate & Premium Living in Ahmedabad",
  description: "Discover prestigious residential apartments, luxury villas, and prime commercial developments across Ahmedabad with Avishkar Realty. RERA-verified projects and dedicated property consultation.",
  keywords: [
    "Avishkar Realty",
    "real estate Ahmedabad",
    "luxury apartments Ahmedabad",
    "SG Highway flats",
    "Zundal projects",
    "Gota 3BHK",
    "Vaishnodevi Circle property",
    "commercial real estate Gujarat",
    "buy property Ahmedabad"
  ],
  authors: [{ name: "Avishkar Realty" }],
  openGraph: {
    title: "Avishkar Realty — Luxury Real Estate in Ahmedabad",
    description: "Your trusted partner for luxury homes, commercial spaces, and high-growth property investments in Ahmedabad.",
    url: "https://avishkarrealty.in",
    siteName: "Avishkar Realty",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
        {children}
        <WhatsappButton phoneNumber="+917041395595" />
      </body>
    </html>
  );
}
