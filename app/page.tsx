"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";


export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchStatus, setSearchStatus] = useState<string>("For Sale");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <Header />



      <Footer />
    </>
  );
}
