"use strict";
const { performance } = require("perf_hooks");
const rs2 = require("/Users/paul/WebDev/librealsense/wrappers/nodejs/index.js");
const FrameProcessor = require("./FrameProcessor.js");
const { printFrame, timer } = require("./Utilities.js");

const pipeline = new rs2.Pipeline();
const delay = 100;
const minDistance = 800;
const maxDistance = 2000;
const Processor = new FrameProcessor(48, 28);

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

const loop = async () => {
  while (true) {
    const frameset = pipeline.pollForFrames();
    if (frameset) {
      let depthFrame = frameset.depthFrame;
      // const t0 = performance.now();
      depthFrame = Processor.decimate(depthFrame);
      depthFrame = Processor.downsample(depthFrame);
      depthFrame = Processor.mirror(depthFrame);
      // const t1 = performance.now();
      // console.log(`Processing took: ${t1 - t0} millis`);

      printFrame(depthFrame, minDistance, maxDistance);
      // console.log(downsampledFrame.data.length);
      // break;
    }
    await timer(delay);
  }
  return;
};

loop();

process.on("SIGINT", function() {
  console.log("Caught interrupt signal");
  pipeline.stop();
  rs2.cleanup();
  process.exit();
});
