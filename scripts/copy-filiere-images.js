const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\aadmin\\.gemini\\antigravity\\brain\\fe54bcd2-2f88-4651-be6e-3fdbd20efe6f';
const targetDir = path.join(process.cwd(), 'public', 'images', 'filiere-courses');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(brainDir);

const mappings = {
  'tsge_cf_card': 'tsge-cf.jpg',
  'tsge_cm_card': 'tsge-cm.jpg',
  'tsge_om_card': 'tsge-om.jpg',
  'tsge_rh_card': 'tsge-rh.jpg',
  'taa_comptabilite_card': 'taa-comptabilite.jpg',
  'taa_gestion_card': 'taa-gestion.jpg',
  'tsge_1ere_annee_card': 'tsge-1ere-annee.jpg',
  'taa_1ere_annee_card': 'taa-1ere-annee.jpg',
};

Object.entries(mappings).forEach(([key, destName]) => {
  const matchingFile = files.find(f => f.startsWith(key) && f.endsWith('.jpg'));
  if (matchingFile) {
    const srcPath = path.join(brainDir, matchingFile);
    const destPath = path.join(targetDir, destName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${matchingFile} -> public/images/filiere-courses/${destName}`);
  } else {
    console.error(`Warning: Could not find image matching key: ${key}`);
  }
});

console.log('All filiere course cover images copied successfully!');
