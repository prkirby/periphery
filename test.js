"use strict";
require("dotenv").config();
const keypress = require("keypress");
const Mapper = require("./Mapper");
const Serial = require("./Serial");
const { timer } = require("./Utilities");
const { pixelMap } = require("./pixelMap");

const delay = process.env.TEST_DELAY;
const gridWidth = process.env.GRID_WIDTH;
const gridHeight = process.env.GRID_HEIGHT;
let forward = true;
let running = false;
let initialized = false;
let index = 0;
const frame = new Array(gridWidth * gridHeight).fill(0);


// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on("keypress", async function(ch, key) {
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
    case "up":
      indexBackward(true);
      break;
    case "down":
      indexForward(true);
      break;
    case "o":
      allOn();
      break;
    case "f":
      allOff();
      break;
    case "l":
      await Serial.list();
      break;
    case "s":
      await Serial.init();
      initialized = true;
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

const indexForward = (moveRow = false) => {
  if (moveRow) {
    let newIndex = index + gridWidth;
    if (newIndex >= frame.length - 1) {
      newIndex = newIndex = frame.length - 1;
    }
    index = newIndex;
  } else {
    if (index >= frame.length - 1) {
      index = 0;
    } else {
      index++;
    }
  }
  setPixel();
};

const indexBackward = (moveRow = false) => {
  if (moveRow) {
    let newIndex = index - gridWidth;
    if (newIndex < 0) {
      newIndex = frame.length - 1 + newIndex;
    }
    index = newIndex;
  } else {
    if (index <= 0) {
      index = frame.length - 1;
    } else {
      index--;
    }
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
  while (true) {
    if (!initialized) {
      console.log('not initialized yet');
    }
    if (running && initialized) {
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
