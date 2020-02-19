const rs2 = require('/Users/paul/WebDev/librealsense/wrappers/nodejs/index.js');
const { performance } = require('perf_hooks');

class FrameProcessor {
  constructor(width, height, minDistance, maxDistance) {
    this.decimationFilter = new rs2.DecimationFilter();
    this.gridWidth = width;
    this.gridHeight = height;
    this.minDistance = minDistance;
    this.maxDistance = maxDistance;
  }

  decimate(frame) {
    frame = this.decimationFilter.process(frame);
    frame = this.decimationFilter.process(frame);
    frame = this.decimationFilter.process(frame);
    return frame;
  }

  downsample(frame) {
    const width = frame.width;
    const height = frame.height;
    const data = frame.data;
    const widthDif = width - this.gridWidth;
    const heightDif = height - this.gridHeight;
    const widthOffset = widthDif % 2;
    const heightOffset = heightDif % 2;

    const downsampledFrameData = data.filter((item, index) => {
      const onedIndex = index + 1;
      // If we are in a row thats not getting used, return
      if (
        onedIndex <= width * Math.floor(heightDif / 2) ||
        onedIndex >
          data.length - width * (Math.floor(heightDif / 2) + heightOffset)
      )
        return false;

      // If we are at a column thats not used, return
      const column = onedIndex % width || width;
      if (
        column <= Math.floor(widthDif / 2) ||
        column > width - Math.floor(widthDif / 2) - widthOffset
      )
        return false;

      return true;
    });

    // Mock RS2 Frame object
    const downsampledFrame = {
      data: downsampledFrameData,
      width: this.gridWidth,
      height: this.gridHeight
    };

    return downsampledFrame;
  }

  mirror(frame) {
    const width = frame.width;
    const data = frame.data;
    let output = new Array();
    let temp = new Array();

    data.forEach((item, index) => {
      temp.push(item);

      if ((index + 1) % width === 0) {
        temp.reverse();
        output = output.concat(temp);
        temp = new Array();
      }
    });

    frame.data = output;

    return frame;
  }

  convertToBinary(frame) {
    const data = frame.data;
    const output = new Array();

    data.forEach(item => {
      if (item > this.maxDistance || item < this.minDistance) {
        output.push(0);
      } else output.push(1);
    });

    frame.data = output;

    return frame;
  }
}

module.exports = FrameProcessor;
