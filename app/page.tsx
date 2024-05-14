"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImageMetadata } from "../lib/types";

const Home: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/images");
      const imagesList: string[] = await res.json();
      setImages(imagesList);
    };
    fetchImages();
  }, []);

  const handleImageClick = async (imagePath: string) => {
    const [date, filename] = imagePath.split("/");
    const res = await fetch(`/api/metadata/${date}/${filename}`);
    const metadata: ImageMetadata = await res.json();
    setSelectedImage(`/photos/${imagePath}`);
    setMetadata(metadata);
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-4">
        Wildlife Camera Images
      </h1>
      <div className="flex flex-wrap justify-center">
        {images.map((imagePath) => (
          <div
            key={imagePath}
            className="m-4 cursor-pointer"
            onClick={() => handleImageClick(imagePath)}
          >
            <Image
              src={`/photos/${imagePath}`}
              alt={imagePath}
              width={150}
              height={150}
              className="border-2 border-gray-300 transition-transform duration-200 hover:scale-105 hover:border-gray-500"
            />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Selected Image</h2>
          <Image src={selectedImage} alt="Selected" width={600} height={400} />
          <pre className="bg-white p-4 border border-gray-300 mt-4 max-w-md mx-auto">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Home;
