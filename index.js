"use strict";
require("dotenv").config();
const { performance } = require("perf_hooks");
const rs2 = require("/Users/paul/WebDev/librealsense/wrappers/nodejs/index.js");
const FrameProcessor = require("./FrameProcessor");
const Mapper = require("./Mapper");
const Serial = require("./Serial");
const { printFrame, timer } = require("./Utilities");

const pipeline = new rs2.Pipeline();
const delay = 90;
const gridWidth = 48;
const gridHeight = 28;
const minDistance = 1000;
const maxDistance = 3000;
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

// Main Loop
const loop = async () => {
  // Setup serial connection
  await Serial.init();

  while (true) {
    const frameset = pipeline.pollForFrames();
    if (frameset) {
      // console.log("made it here");
      let depthFrame = frameset.depthFrame;
      // const t0 = performance.now();
      depthFrame = Processor.fillHoles(depthFrame);
      // depthFrame = Processor.spatialize(depthFrame);
      // depthFrame = Processor.temporalize(depthFrame);
      // depthFrame = Processor.temporalize(depthFrame);
      depthFrame = Processor.decimate(depthFrame);
      depthFrame = Processor.downsample(depthFrame);
      // depthFrame = Processor.mirror(depthFrame);
      depthFrame = Processor.convertToBinary(depthFrame);
      printFrame(depthFrame);

      // const ioArrays = Mapper.getIOArrays(depthFrame.data);
      //
      // await Serial.output(ioArrays);

      // const t1 = performance.now();
      // console.log(`Processing took: ${t1 - t0} millis`);

      // break;
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
