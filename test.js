"use strict";
require("dotenv").config();
const iohook = require("iohook");
const Mapper = require("./Mapper");
const Serial = require("./Serial");
const { timer } = require("./Utilities");
const { pixelMap } = require("./pixelMap");

const delay = 1000;
const gridWidth = 48;
const gridHeight = 28;
let forward = true;
let running = true;
let index = 0;
const frame = new Array(gridWidth * gridHeight).fill(0);

const keypress = require("keypress");

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on("keypress", function(ch, key) {
  if (!key) return;

  switch (key.name) {
    case "space":
      running = !running;
      break;
    case "backspace":
      forward = !forward;
      break;
    case "right":
      indexForward();
      break;
    case "left":
      indexBackward();
      break;
    case "o":
      allOn();
      break;
    case "f":
      allOff();
      break;
    case "c":
      if (key.ctrl) {
        process.stdin.pause();
        process.exit();
      }
      break;
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

const indexForward = () => {
  if (index >= frame.length) {
    index = 0;
  } else {
    index++;
  }
  setPixel();
};

const indexBackward = () => {
  if (index <= 0) {
    index = frame.length - 1;
  } else {
    index--;
  }
  setPixel();
};

const setPixel = () => {
  frame.fill(0);
  frame[index] = 1;
  pixel = pixelMap[index];
  const row = Math.ceiling((index + 1) / 48);

  if (pixel) {
    console.log(``);
  } else {
  }
  Serial.output(Mapper.getIOArrays(frame));
};

const allOn = () => {
  running = false;
  frame.fill(1);
  console.log("all on");
  Serial.output(Mapper.getIOArrays(frame));
};

const allOff = () => {
  running = false;
  frame.fill(0);
  console.log("all off");
  Serial.output(Mapper.getIOArrays(frame));
};

// Main Loop
const loop = async () => {
  // Setup serial connection
  await Serial.init();

  while (true) {
    if (running) {
      if (forward) {
        indexForward();
      } else {
        indexBackward();
      }
      await timer(delay);
    }
  }
};

loop();
