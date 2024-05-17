const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.NFT_STORAGE_API_KEY;

async function main() {
  const client = new NFTStorage({ token: API_KEY });
  const imagesDir = path.join(__dirname, 'images');
  const imageFiles = fs.readdirSync(imagesDir).filter(file => file.endsWith('.png'));

  for (let i = 0; i < imageFiles.length; i++) {
    const imagePath = path.join(imagesDir, imageFiles[i]);
    const image = fs.readFileSync(imagePath);

    const metadata = await client.store({
      name: `PuffleNFT #${i + 1}`,
      description: 'This is a PuffleNFT',
      image: new File([image], imageFiles[i], { type: 'image/png' })
    });

    console.log(`Metadata URL for PuffleNFT #${i + 1}:`, metadata.url);
  }
}

main().catch(console.error);
