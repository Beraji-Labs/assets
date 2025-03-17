import { readdir, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDir = join(__dirname, "./public/images");
const outputFile = join(__dirname, "./public/images.json");

// Recursively scan all subdirectories and get image files
async function getAllImages(dir) {
  let imageFiles = [];

  try {
    const items = await readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = join(dir, item.name);
      if (item.isDirectory()) {
        // If it's a directory, scan recursively
        const nestedFiles = await getAllImages(fullPath);
        imageFiles = imageFiles.concat(nestedFiles);
      } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)) {
        // If it's an image file, add it to the list
        imageFiles.push(fullPath.replace(imagesDir, "").replace(/\\/g, "/")); // Keep relative paths
      }
    }
  } catch (err) {
    console.error(`❌ Error reading directory ${dir}:`, err);
  }

  return imageFiles;
}

async function generateImagesJson() {
  try {
    // Ensure the directory exists
    await mkdir(imagesDir, { recursive: true });

    // Get all image files inside the directory (including subfolders)
    const imageFiles = await getAllImages(imagesDir);

    console.log("📂 Found images:", imageFiles);

    // Write to images.json
    await writeFile(
      outputFile,
      JSON.stringify({ images: imageFiles }, null, 2)
    );

    console.log("✅ Successfully generated images.json");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

generateImagesJson();
