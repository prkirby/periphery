// Index in this array corresponds to index of depth frame array.
// IE: Row one of frame is index 0 - 47, row two 48 - 95, etc.
// See the pixel_placement_data.xls spreadsheet for a visual representation of this

let pixelMap = [];

for (let i = 1; i <= 28; i++) {
  const row = require(`./row${i}`);
  pixelMap = pixelMap.concat(row);
}

module.exports = {
  pixelMap
};
