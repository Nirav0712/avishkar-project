import type { Metadata } from "next";
import "./global.css";
import WhatsappButton from "./components/WhatsappButton";
import CallingButton from "./components/CallingButton";

export const metadata: Metadata = {
  title: "Avishkar - Find Your Dream Property",
  description: "Discover premium properties across India. VeerRealEstate offers villas, apartments, and commercial spaces in Mumbai, Bangalore, Gurgaon, and more.",
  keywords: ["real estate India", "property for sale", "apartments Mumbai", "villas Bangalore", "buy property India", "VeerRealEstate"],
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="antialiased">
        {children}
        <WhatsappButton phoneNumber="+917041395595" />
        {/* <CallingButton phoneNumber="+919876543210" /> */}
      </body>
    </html>
  );
}
