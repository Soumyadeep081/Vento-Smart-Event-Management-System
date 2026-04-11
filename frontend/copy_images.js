import fs from 'fs';

fs.copyFileSync(
    "C:\\Users\\91620\\.gemini\\antigravity\\brain\\71ef62f9-af94-4987-a327-1f7235f95594\\recommendations_bg_1775909388490.png",
    "c:\\Users\\91620\\vento\\frontend\\public\\recommendations_bg.png"
);
fs.copyFileSync(
    "C:\\Users\\91620\\.gemini\\antigravity\\brain\\71ef62f9-af94-4987-a327-1f7235f95594\\compare_bg_1775909410485.png",
    "c:\\Users\\91620\\vento\\frontend\\public\\compare_bg.png"
);
console.log("Images copied");
