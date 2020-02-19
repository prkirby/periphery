"use strict";
require("dotenv").config();
const { performance } = require("perf_hooks");
const rs2 = require("/Users/paul/WebDev/librealsense/wrappers/nodejs/index.js");
const FrameProcessor = require("./FrameProcessor");
const Mapper = require("./Mapper");
const Serial = require("./Serial");
const { printFrame, timer } = require("./Utilities");

const pipeline = new rs2.Pipeline();
const delay = 1000;
const gridWidth = 8;
const gridHeight = 16;
const minDistance = 800;
const maxDistance = 2000;
const Processor = new FrameProcessor(
  gridWidth,
  gridHeight,
  minDistance,
  maxDistance
);

// Serial.list();

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
pipeline.start(config);

// Main Loop
const loop = async () => {
  // Setup serial connection
  await Serial.init();

  while (true) {
    const frameset = pipeline.pollForFrames();
    if (frameset) {
      // let depthFrame = frameset.depthFrame;
      // const t0 = performance.now();
      // depthFrame = Processor.decimate(depthFrame);
      // depthFrame = Processor.downsample(depthFrame);
      // depthFrame = Processor.convertToBinary(depthFrame);
      // depthFrame = Processor.mirror(depthFrame);
      //
      // const ioArrays = Mapper.getIOArrays(depthFrame.data);
      //
      // const t1 = performance.now();
      // console.log(`Processing took: ${t1 - t0} millis`);

      // printFrame(depthFrame, minDistance, maxDistance);
      // break;
      Serial.write("Hello!\n");
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
