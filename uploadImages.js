require('dotenv').config();
const { create } = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');

// Configure Infura project credentials
const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// Create an IPFS client
const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

async function uploadImage(filePath) {
    try {
        const file = fs.readFileSync(filePath);
        const added = await ipfs.add(file);
        console.log('IPFS Hash:', added.path);
        return added.path; // This is the IPFS hash
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

const imagePath = path.join(__dirname, 'images/22.png');
uploadImage(imagePath).then((hash) => console.log(`Image uploaded: ${hash}`));
