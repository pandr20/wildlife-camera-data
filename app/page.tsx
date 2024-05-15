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
      try {
        const res = await fetch("/api/images");
        if (!res.ok) {
          throw new Error("Failed to fetch images");
        }
        const imagesList: string[] = await res.json();
        setImages(imagesList);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleImageClick = async (imagePath: string) => {
    const [date, filename] = imagePath.split("/");
    try {
      const res = await fetch(`/api/metadata/${date}/${filename}`);
      if (!res.ok) {
        throw new Error("Failed to fetch metadata");
      }
      const metadata: ImageMetadata = await res.json();
      console.log("Fetched metadata:", metadata); // Debugging log
      setSelectedImage(`${process.env.NEXT_PUBLIC_PHOTO_DIR_URL}/${imagePath}`);
      setMetadata(metadata);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-2xl font-bold my-4">
        Wildlife Camera Images
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(images) &&
          images.map((imagePath) => (
            <div key={imagePath} className="text-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_PHOTO_DIR_URL}/${imagePath}`}
                alt={imagePath}
                width={150}
                height={150}
                className="mx-auto"
              />
              <button
                className="mt-2 bg-blue-700 text-white py-1 px-2 rounded-xl"
                onClick={() => handleImageClick(imagePath)}
              >
                View Metadata
              </button>
            </div>
          ))}
      </div>
      {selectedImage && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Selected Image</h2>
          <div className="flex justify-center">
            <Image
              src={selectedImage}
              alt="Selected"
              width={600}
              height={400}
            />
          </div>
          <pre className="bg-white p-4 border border-gray-300 mt-4 max-w-md mx-auto whitespace-pre-wrap break-words">
            {metadata
              ? JSON.stringify(metadata, null, 2)
              : "Loading metadata..."}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Home;
