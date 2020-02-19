#include <HardwareSerial9Bit.h>
#include "IOExpander9Bit.h"
#include <avr/wdt.h>

#define MAX_BOARDS 1
#define MAX_RELAYS 128

void setup() {
  // put your setup code here, to run once:
  Serial9Bit.begin(115200);
  Serial9Bit1.begin(115200, SERIAL_9N1); // The IOExpander library is tweaked to use Serial1
  Serial9Bit1.write(0);// Set IO Expanders to 9-bit
//  wdt_enable(WDTO_8S);
  char setCmd[10];
  for (int board = 1; board <= MAX_BOARDS; board++) {
    sprintf(setCmd, "eb%d", MAX_RELAYS / 16);
    SerialCmdDone(board, setCmd);
  }
  Serial9Bit.println("READY"); // Our node app will await this before sending data
}

char ch;
char board;
String hex;
char cmd[40];

void loop() {
  if (Serial9Bit.available() > 1) {
    ch = Serial9Bit.read();
    if (ch == 'i') {
      board = Serial9Bit.parseInt();
      hex = Serial9Bit.readStringUntil('>');
      hex.toCharArray(cmd, 40);
//      Serial9Bit.println(cmd);
      SerialCmdDone(board, cmd);
    }
  }
//  wdt_reset();
}
