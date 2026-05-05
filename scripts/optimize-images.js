import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminWebp from 'imagemin-webp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir, copyFile, unlink } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', 'public');

const imageExtensions = ['.png', '.jpg', '.jpeg'];
const webpExtensions = ['.webp'];

async function getFiles(dir, extensions = imageExtensions) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await getFiles(fullPath, extensions);
      results.push(...subFiles);
    } else if (extensions.includes(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  
  return results;
}

async function optimizeImages() {
  console.log('🚀 Starting image optimization...\n');
  
  // Get all images
  const images = await getFiles(rootDir);
  console.log(`Found ${images.length} images to optimize\n`);
  
  for (const image of images) {
    try {
      console.log(`Optimizing: ${image.replace(rootDir, '')}`);
      
      // Compress original image
      await imagemin([image], {
        destination: dirname(image),
        plugins: [
          imageminPngquant({ quality: [0.65, 0.9] }),
          imageminMozjpeg({ quality: 75, progressive: true }),
        ],
      });
      
      // Generate WebP version
      const webpPath = image.replace(/\.[^.]+$/, '.webp');
      await imagemin([image], {
        destination: dirname(webpPath),
        plugins: [
          imageminWebp({ quality: 75, lossless: false }),
        ],
      });
      
      console.log(`  ✅ Optimized + WebP created`);
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n✨ Image optimization complete!');
}

optimizeImages().catch(console.error);
