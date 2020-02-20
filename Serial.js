const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const Ready = require("@serialport/parser-ready");

class Serial {
  constructor() {
    this.port = null;
  }

  init() {
    return new Promise(resolve => {
      // Setup the serial port
      this.port = new SerialPort(process.env.SERIAL_PORT, {
        baudRate: Number(process.env.BAUD_RATE)
      });

      let ready = false;
      const parser = this.port.pipe(new Ready({ delimiter: "READY" }));
      parser.on("ready", () => {
        ready = true;
      });

      const reader = this.port.pipe(new Readline({ delimiter: "\r\n" }));
      reader.on("data", console.log);

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
  async output(ioArrays) {
    for (const arrayName in ioArrays) {
      let data = ioArrays[arrayName];
      data = data.reverse();
      const hex = this.convertToHex(data.join(""));
      let cmd = `[${arrayName}es${hex}]`;
      await this.writeAndDrain(cmd);
      cmd = `[2es${hex}]`;
      await this.writeAndDrain(cmd);
      cmd = `[3es${hex}]`;
      await this.writeAndDrain(cmd);
    }
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
      this.port.write(data);
      this.port.drain(() => {
        resolve();
      });
    });
  }
}

module.exports = new Serial();
