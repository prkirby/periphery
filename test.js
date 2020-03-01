"use strict";
require("dotenv").config();
const iohook = require("iohook");
const Mapper = require("./Mapper");
const Serial = require("./Serial");
const { timer } = require("./Utilities");
const { pixelMap } = require("./pixelMap");

const delay = 100;
const gridWidth = 48;
const gridHeight = 28;
let forward = true;
let running = false;
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
  if (index >= frame.length - 1) {
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
  frame.fill(1);
  frame[index] = 0;
  const pixel = pixelMap[index];

  const row = Math.ceil((index + 1) / 48);
  const column = (index + 1) % 48 || 48;
  console.log(`Row: ${row} | Column: ${column}`);

  if (pixel) {
    console.log(`IO${pixel.io} | address ${pixel.index}`);
  } else {
    console.log("Null");
  }
  console.log("--------");

  Serial.output(Mapper.getIOArrays(frame));
};

const allOn = () => {
  running = false;
  frame.fill(0);
  console.log("all on\n--------");
  Serial.output(Mapper.getIOArrays(frame));
};

const allOff = () => {
  running = false;
  frame.fill(1);
  console.log("all off\n--------");
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
    }
    await timer(delay);
  }
};

loop();
