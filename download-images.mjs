import fs from 'fs';
import path from 'path';

const urls = [
  { name: 'cobalt.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chevrolet_Cobalt_1.5.jpg/1200px-Chevrolet_Cobalt_1.5.jpg' },
  { name: 'tracker.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/2021_Chevrolet_Tracker_325T_%28China%29_front_view.jpg/1200px-2021_Chevrolet_Tracker_325T_%28China%29_front_view.jpg' },
  { name: 'malibu.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/2016_Chevrolet_Malibu_LT_in_Autumn_Bronze_Metallic%2C_Front_Left%2C_10-21-2022.jpg/1200px-2016_Chevrolet_Malibu_LT_in_Autumn_Bronze_Metallic%2C_Front_Left%2C_10-21-2022.jpg' },
  { name: 'equinox.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/2020_Chevrolet_Equinox_Premier_AWD_front_11.2.19.jpg/1200px-2020_Chevrolet_Equinox_Premier_AWD_front_11.2.19.jpg' },
  { name: 'onix.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Chevrolet_Onix_1.0_Turbo_Premier_2020.jpg/1200px-Chevrolet_Onix_1.0_Turbo_Premier_2020.jpg' },
  { name: 'tahoe.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/2021_Chevrolet_Tahoe_LT.jpg/1200px-2021_Chevrolet_Tahoe_LT.jpg' },
  { name: 'k5.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/2021_Kia_K5_EX_in_Everlasting_Silver%2C_front_left.jpg/1200px-2021_Kia_K5_EX_in_Everlasting_Silver%2C_front_left.jpg' }
];

async function download() {
  if (!fs.existsSync('public/cars')) {
    fs.mkdirSync('public/cars', { recursive: true });
  }
  for (const file of urls) {
    console.log(`Downloading ${file.name}...`);
    try {
      const response = await fetch(file.url, {
        headers: {
          'User-Agent': 'carbooking-bot/1.0 (https://carbooking.uz)'
        }
      });
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(path.join('public/cars', file.name), Buffer.from(buffer));
        console.log(`Saved ${file.name}`);
      } else {
        console.error(`Failed ${file.name}: ${response.status} ${response.statusText}`);
      }
    } catch(e) {
      console.error(e);
    }
  }
}

download();
