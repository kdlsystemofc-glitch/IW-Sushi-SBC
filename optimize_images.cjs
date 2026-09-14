const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'imagens');
const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

(async () => {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = path.join(imgDir, file);
    const outputPath = path.join(imgDir, file.replace(/\.(jpg|jpeg|png)$/, '.webp'));
    const statBefore = fs.statSync(inputPath);
    totalBefore += statBefore.size;

    await sharp(inputPath)
      .webp({ quality: 88, effort: 6 })
      .toFile(outputPath);

    const statAfter = fs.statSync(outputPath);
    totalAfter += statAfter.size;
    console.log(`Optimized ${file}: ${(statBefore.size / 1024).toFixed(1)}KB -> ${(statAfter.size / 1024).toFixed(1)}KB WebP (-${(100 - (statAfter.size / statBefore.size) * 100).toFixed(0)}%)`);
  }

  console.log(`Total payload: ${(totalBefore / 1024).toFixed(1)}KB -> ${(totalAfter / 1024).toFixed(1)}KB (-${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}%)`);
})();
