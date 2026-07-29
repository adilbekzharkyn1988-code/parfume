"use client";

import dynamic from "next/dynamic";

const HeroDragGallery = dynamic(() => import("@/components/HeroDragGallery"), {
  ssr: false,
});

export default HeroDragGallery;
