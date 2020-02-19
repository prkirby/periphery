const { IO1, pixelMap } = require('./pixelMap');

class Mapper {
  constructor() {
    this.IOArrays = {};
    this.IOArrays[IO1] = new Array(128);
  }

  getIOArrays(frameData) {
    this.map(frameData);
    return this.IOArrays;
  }

  map(frameData) {
    if (frameData.length != pixelMap.length) {
      throw 'In Mapper.Map(): Frame data does not match PixelMap size';
    }

    frameData.forEach((item, index) => {
      const pixel = pixelMap[index];

      if (pixel === null) return;

      // Pixel.index is 1 indexed
      this.IOArrays[pixel.io][pixel.index - 1] = item;
    });
  }
}

module.exports = new Mapper();
