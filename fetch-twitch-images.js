const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the draft state data
const draftState = JSON.parse(fs.readFileSync('./data/draft-state.json', 'utf8'));

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function fetchTwitchImages() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set user agent to avoid being blocked
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  const updatedPlayers = [];
  
  for (const player of draftState.players) {
    try {
      console.log(`Fetching image for ${player.twitchName}...`);
      
      // Navigate to the Twitch profile page
      await page.goto(player.twitchLink, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Try the first selector
      let imageUrl = null;
      try {
        await page.waitForSelector('.home-header-sticky .tw-image', { timeout: 10000 });
        imageUrl = await page.$eval('.home-header-sticky .tw-image', img => img.getAttribute('src'));
      } catch (e) {
        console.log(`First selector failed for ${player.twitchName}, trying second selector...`);
        try {
          await page.waitForSelector('#live-channel-stream-information .tw-image', { timeout: 10000 });
          imageUrl = await page.$eval('#live-channel-stream-information .tw-image', img => img.getAttribute('src'));
        } catch (e2) {
          console.log(`Second selector also failed for ${player.twitchName}`);
        }
      }
      
      if (imageUrl) {
        // Create filename from twitch name
        const filename = `${player.twitchName.toLowerCase().replace(/[^a-z0-9]/g, '')}.webp`;
        const filepath = path.join('./public', filename);
        
        // Download the image
        await downloadImage(imageUrl, filepath);
        
        // Update the player data
        player.twitchImage = `/${filename}`;
        
        console.log(`✓ Downloaded image for ${player.twitchName}: ${filename}`);
      } else {
        console.log(`✗ No image found for ${player.twitchName}`);
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error fetching image for ${player.twitchName}:`, error.message);
      // Keep the placeholder image if there's an error
    }
    
    updatedPlayers.push(player);
  }
  
  await browser.close();
  
  // Update the draft state with new image paths
  draftState.players = updatedPlayers;
  
  // Write the updated data back to the file
  fs.writeFileSync('./data/draft-state.json', JSON.stringify(draftState, null, 2));
  
  console.log('✓ Updated draft-state.json with new image paths');
}

// Run the script
fetchTwitchImages().catch(console.error); 