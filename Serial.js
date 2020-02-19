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
}

module.exports = new Serial();
