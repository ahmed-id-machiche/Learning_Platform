const fs = require('fs');
const path = require('path');

const src1 = "C:\\Users\\aadmin\\.gemini\\antigravity\\brain\\fe54bcd2-2f88-4651-be6e-3fdbd20efe6f\\ofppt_oujda_tsge_hero_1788379217797.jpg";
const dest1 = path.join(__dirname, "../public/ofppt-tsge-hero.jpg");

const src2 = "C:\\Users\\aadmin\\.gemini\\antigravity\\brain\\fe54bcd2-2f88-4651-be6e-3fdbd20efe6f\\ofppt_oujda_login_banner_1788379234807.jpg";
const dest2 = path.join(__dirname, "../public/ofppt-tsge-login.jpg");

try {
  if (fs.existsSync(src1)) {
    fs.copyFileSync(src1, dest1);
    console.log("Successfully copied TSGE Hero Image to public/ofppt-tsge-hero.jpg");
  }
  if (fs.existsSync(src2)) {
    fs.copyFileSync(src2, dest2);
    console.log("Successfully copied TSGE Login Image to public/ofppt-tsge-login.jpg");
  }
} catch (e) {
  console.error("Copy error:", e);
}
