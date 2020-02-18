"use strict";
const { performance } = require("perf_hooks");
const rs2 = require("/Users/paul/WebDev/librealsense/wrappers/nodejs/index.js");

const pipeline = new rs2.Pipeline();
const delay = 200;
const minDistance = 1800;

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

const processFrame = frameProcessor();

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function loop() {
  while (true) {
    const frameset = pipeline.pollForFrames();
    if (frameset) {
      const depthFrame = frameset.getFrame(rs2.stream.STREAM_DEPTH, 0);
      const processedFrame = processFrame(depthFrame);
      printFrame(processedFrame);
    }
    await timer(delay);
  }
}

loop();

function frameProcessor() {
  const decimationFilter = new rs2.DecimationFilter();
  return frame => {
    frame = decimationFilter.process(frame);
    frame = decimationFilter.process(frame);
    frame = decimationFilter.process(frame);
    return frame;
  };
}

function printFrame(frame) {
  const width = frame.width;
  const data = frame.getData();
  let output = "";
  data.map((item, index) => {
    if ((width - index) % width === 0) output += "\n";

    if (item > minDistance) {
      output += 1;
    } else output += 0;
  });
  console.log(output);
}

process.on("SIGINT", function() {
  console.log("Caught interrupt signal");
  pipeline.stop();
  rs2.cleanup();
  process.exit();
});
