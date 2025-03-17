import { useEffect, useState } from "react";
import "./App.css";
import ShortenText from "./components/ShortenText";

interface ImageData {
  name: string;
  url: string;
}

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/images.json")
      .then((res) => res.json())
      .then((data) => {
        const formattedImages = data.images.map((image: string) => ({
          name: image.split("/").pop(), // Extract filename
          url: `/images${image}`, // Convert to full URL
        }));
        setImages(formattedImages);
      })
      .catch((err) => console.error("Error loading images:", err));
  }, []);

  // Filter images based on search query
  const filteredImages = images.filter(
    (img) =>
      img.name.toLowerCase().includes(search.toLowerCase()) ||
      img.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Image Gallery</h1>
      <input
        type="text"
        placeholder="Search by name or URL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid">
        {filteredImages.length > 0 ? (
          filteredImages.map((img, index) => (
            <div key={index} className="card">
              <img src={img.url} alt={img.name} className="image" />
              <p>
                <ShortenText text={img.name} maxLength={12} />
              </p>
              <a href={img.url} target="_blank" rel="noopener noreferrer">
                <ShortenText text={img.url} maxLength={12} />
              </a>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
