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
#define DELAY 80

char cmd[10];
char ch;
bool turnOn = true;

void setup()
{
  
  Serial9Bit.begin(115200);
  Serial9Bit1.begin(115200, SERIAL_9N1);
  Serial9Bit1.write(0);                     // Set IO Expanders to 9-bit
  wdt_enable(WDTO_8S);

  Serial9Bit.println("---- start ----");

  for (int board = 1; board <= MAX_BOARDS; board++) {
    sprintf(cmd, "eb%d", MAX_RELAYS / 16);
    SerialCmdDone(board, cmd);
  }
  
  Serial9Bit.println("after");
}

void loop()
{
   for (int board = 1; board <= MAX_BOARDS; board++) {
    Serial9Bit.println(board);
    for (int relay = 1; relay <= MAX_RELAYS; relay++) {
      if (turnOn) {
        sprintf(cmd, "e%do", relay);
      } else {
        sprintf(cmd, "e%df", relay);
      }
     
      SerialCmdDone(board, cmd);
      wdt_reset();
      delay(DELAY);
    }
   }
   turnOn = !turnOn;
}
