/* IO Expander
 *
 * Relay Bonnaza with IO Expanders!
 *
 */

#include <SoftwareSerial.h>
#include <HardwareSerial9Bit.h>
#include "IOExpander9Bit.h"
#include <avr/wdt.h>

#define MAX_BOARDS 3
#define MAX_RELAYS 128
#define DELAY 100


char cmd[16][68];

void setup()
{
  
  Serial9Bit.begin(115200);
  Serial9Bit1.begin(115200, SERIAL_9N1);
  Serial9Bit1.write(0);                     // Set IO Expanders to 9-bit
  wdt_enable(WDTO_8S);
  char setCmd[10];
  for (int board = 1; board <= MAX_BOARDS; board++) {
    sprintf(setCmd, "eb%d", MAX_RELAYS / 16);
    SerialCmdDone(board, setCmd);
  }

  sprintf(cmd[0], "es1be1b99c725b9f319cc6ad8df4b586d0");
  sprintf(cmd[1], "es7024c0d8387f0e7a59787560902059f5");
  sprintf(cmd[2], "es40bb0f017ca73db34099b7bbaadf5228");
  sprintf(cmd[3], "es159dffc8a577b78a7f8cc022b4646134");
  sprintf(cmd[4], "es8c7145a4811366e9b6ccb3d53bd75d64");
  sprintf(cmd[5], "esaa0322e7fc7dc36bbdc18ddf2cee6083");
  sprintf(cmd[6], "esc108fbf5d64001d2454b26fe0a666945");
  sprintf(cmd[7], "eseb831381ae2558719b6254ee82a52c97");
  sprintf(cmd[8], "esaa0322e7fc7dc36bbdc18ddf2cee6083");
  sprintf(cmd[9], "es3f09d846cc82f004cb2d87a1340be798");
  sprintf(cmd[10], "esf6b3c4217757c78ff703a75599b62d55");
  sprintf(cmd[11], "esa326810b84b03f52ec2f5b6acc43ad91");
  sprintf(cmd[12], "es52060b8fdb0d40a46e7a998ff96c06c5");
  sprintf(cmd[13], "esecbcd2c48c94b6eeb6937663566396ca");
  sprintf(cmd[14], "es6f12dc9ccb6be13be2efb38f12f5d441");
  sprintf(cmd[15], "esef677e98bd11f5950f852f6e0b15cc1f");
}

void loop()
{
  static int board = 1;
  static int flash = 0;

  SerialCmdDone(board, cmd[flash]);
  Serial9Bit1.address(board);
  Serial9Bit1.println("eg");
  readOutput();
  wdt_reset();
  delay(DELAY);

  if (++board > MAX_BOARDS) board = 1;
  if (++flash > 15) flash = 0;
}

char ch;
void readOutput() {
  while(true) {
    if (Serial9Bit1.available() > 0) {
      ch = Serial9Bit1.read();
      if (ch == '>') break;
      Serial9Bit.print(ch);
    }
  }
  Serial9Bit.println();
}
