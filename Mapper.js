const { IO1, IO2, IO3, IO4, IO5, IO6 } = require('./constants');
const { pixelMap } = require('./pixelMap');

class Mapper {
  constructor() {
    this.IOArrays = {};
    this.IOArrays[IO1] = {
      data: new Array(128).fill(1),
      wasEmpty: false
    };
    this.IOArrays[IO2] = {
      data: new Array(128).fill(1),
      wasEmpty: false
    };
    this.IOArrays[IO3] = {
      data: new Array(128).fill(1),
      wasEmpty: false
    };
    this.IOArrays[IO4] = {
      data: new Array(128).fill(1),
      wasEmpty: false
    };
    this.IOArrays[IO5] = {
      data: new Array(128).fill(1),
      wasEmpty: false
    };
    this.IOArrays[IO6] = {
      data: new Array(128).fill(1),
      wasEmpty: false
    };

    this.randomPixels = true;
  }

  getIOArrays(frameData) {
    this.map(frameData);
    return this.IOArrays;
  }

  map(frameData) {
    if (frameData.length != pixelMap.length) {
      throw 'In Mapper.Map(): Frame data does not match PixelMap size';
    }
    let hasData = false;

    frameData.forEach((item, index) => {
      const pixel = pixelMap[index];

      if (pixel === null) return;

      // Pixel.index is 1 indexed
      this.IOArrays[pixel.io].data[pixel.index - 1] = item;

      if (!this.hasData && item == 0) {
        hasData = true;
      }
    });

    // Only set random pixels if we don't have any frame data
    if (this.randomPixels && !hasData) {
      this.setRandomPixels();
    }
  }

  setRandomPixels() {
    for (const arrayName in this.IOArrays) {
      const ioArray = this.IOArrays[arrayName];
      // 0 to 4 pixels
      const numPixels = this.getRandomInt(20);
      const probability = 1; // Higher is lower probability

      // set the number of pixels, with probability scalar
      for (let i = 0; i <= numPixels; i++) {
        const index = this.getRandomInt(ioArray.data.length * probability);
        if (index < ioArray.data.length) {
          ioArray.data[index] = 0;
        }
      }
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}

module.exports = new Mapper();
