"use strict";
require("dotenv").config();
const { performance } = require("perf_hooks");
const rs2 = require(process.env.REALSENSE_NODE);
const FrameProcessor = require("./FrameProcessor");
const Mapper = require("./Mapper");
const Serial = require("./Serial");
const { printFrame, timer } = require("./Utilities");

const pipeline = new rs2.Pipeline();
const delay = process.env.DELAY;
const gridWidth = process.env.GRID_WIDTH;
const gridHeight = process.env.GRID_HEIGHT;
const minDistance = process.env.MIN_DISTANCE;
const maxDistance = process.env.MAX_DISTANCE;
const shouldPrintFrame = process.env.PRINT_FRAME;
const Processor = new FrameProcessor(
  gridWidth,
  gridHeight,
  minDistance,
  maxDistance
);

// Setup stream and pipeline
const config = new rs2.Config();
config.disableAllStreams();
config.enableStream(
  rs2.stream.STREAM_DEPTH,
  -1,
  480,
  270,
  rs2.format.FORMAT_ANY,
  0
);

// Start the camera
pipeline.start();

console.log(process.env.DELAY);
console.log(process.env.PRINT_FRAME);

// Main Loop
const loop = async () => {
  // Setup serial connection
  await Serial.init();

  while (true) {
    const frameset = pipeline.pollForFrames();
    if (frameset) {
      let depthFrame = frameset.depthFrame;
      // const t0 = performance.now();
      depthFrame = Processor.decimate(depthFrame);
      depthFrame = Processor.downsample(depthFrame);
      depthFrame = Processor.mirror(depthFrame);
      depthFrame = Processor.convertToBinary(depthFrame);
      if (shouldPrintFrame === "true") {
        printFrame(depthFrame);
      }

      const ioArrays = Mapper.getIOArrays(depthFrame.data);

      await Serial.output(ioArrays);
      // const t1 = performance.now();
      // console.log(`Processing took: ${t1 - t0} millis`);
    }
    await timer(delay);
  }
};

loop();

process.on("SIGINT", function() {
  console.log("Caught interrupt signal");
  pipeline.stop();
  rs2.cleanup();
  Serial.port.close();
  process.exit();
});
