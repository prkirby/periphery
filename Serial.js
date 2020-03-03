const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const Ready = require("@serialport/parser-ready");
const Delimiter = require("@serialport/parser-delimiter");
var NanoTimer = require("nanotimer");
const { timer } = require("./Utilities");
const { performance } = require("perf_hooks");

class Serial {
  constructor() {
    this.port = null;
    this.reader = null;
    this.readyChar = "%";
    this.readyForWrite = false;
    this.timer = new NanoTimer();
  }

  init() {
    return new Promise(resolve => {
      // Setup the serial port
      this.port = new SerialPort(process.env.SERIAL_PORT, {
        baudRate: Number(process.env.BAUD_RATE)
      });

      let ready = false;
      const readyParser = this.port.pipe(new Ready({ delimiter: "READY" }));
      readyParser.on("ready", () => {
        ready = true;
      });

      this.reader = this.port.pipe(new Readline({ delimiter: "\r\n" }));
      this.reader.on("data", data => {
        if (data != this.readyChar) {
          console.log(data);
        } else {
          // console.log(data);
          this.readyForWrite = true;
        }
      });

      const check = setInterval(() => {
        if (ready) {
          clearInterval(check);
          resolve(true);
        }
      }, 1);
    });
  }

  async list() {
    const list = await SerialPort.list();
    console.log(list);
  }

  write(string) {
    this.port.write(string);
  }

  // Expects formatted list of IO Arrays, from Mapper
  output(ioArrays) {
    const delay = 7;
    return new Promise(async resolve => {
      for (const arrayName in ioArrays) {
        const ioArray = ioArrays[arrayName];
        let data = ioArray.data;

        if (ioArray.wasEmpty && data.every(item => item == 1)) {
          await timer(delay);
          continue;
        }

        data = data.reverse();
        const hex = this.convertToHex(data.join(""));
        let cmd = `[${arrayName}es${hex}]`;
        await this.writeAndDrain(cmd);
        await timer(delay);

        if (data.every(item => item == 1)) {
          ioArray.wasEmpty = true;
        } else {
          ioArray.wasEmpty = false;
        }
      }

      resolve();
    });
  }

  convertToHex(binary) {
    let output = "";
    let buffer = "";
    [...binary].forEach((item, index) => {
      buffer += item;
      if ((index + 1) % 4 === 0) {
        output += parseInt(buffer, 2).toString(16);
        buffer = "";
      }
    });
    return output;
  }

  writeAndDrain(data) {
    return new Promise(resolve => {
      const t0 = performance.now();
      this.port.write(data);
      this.port.drain(() => {
        resolve();
      });
    });
  }
}

module.exports = new Serial();
