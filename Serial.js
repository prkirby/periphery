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
    return new Promise(async resolve => {
      for (const arrayName in ioArrays) {
        let data = ioArrays[arrayName];
        data = data.reverse();
        const hex = this.convertToHex(data.join(""));
        let cmd = `[${arrayName}es${hex}]`;
        // console.log("starting to write");
        await this.writeAndDrain(cmd);
        // console.log("ending write");
        await timer(3);
        cmd = `[2es${hex}]`;
        await this.writeAndDrain(cmd);
        await timer(3);
        cmd = `[3es${hex}]`;
        await this.writeAndDrain(cmd);
        // await timer(50);
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
        // const check = this.timer.setInterval(
        //   () => {
        //     // Check for Timeout
        //     const t1 = performance.now();
        //     if (t1 - t0 > 20) {
        //       this.readyForWrite = true;
        //     }
        //
        //     if (this.readyForWrite) {
        //       this.timer.clearInterval(check);
        //       this.readyForWrite = false;
        //
        //       resolve(true);
        //     }
        //   },
        //   "",
        //   "1m"
        // );
      });
    });
  }
}

module.exports = new Serial();
