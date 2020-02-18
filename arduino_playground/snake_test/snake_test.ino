/* IO Expander
 *
 * Relay Bonnaza with IO Expanders!
 *
 */

//#include <HardwareSerial9Bit.h>
//#include "IOExpander9Bit.h"
#include <avr/wdt.h>

#define MAX_BOARDS 1
#define MAX_RELAYS 128
#define DELAY 100

char cmd[10];

void setup()
{
//  Serial9Bit.begin(115200, SERIAL_9N1);
//  Serial9Bit.write(0);                     // Set IO Expanders to 9-bit
//  wdt_enable(WDTO_8S);
//  for (int board = 1; board <= MAX_BOARDS; board++) {
//    sprintf(cmd, "eb%d", MAX_RELAYS / 16);
//    SerialCmdDone(board, cmd);
//  }
  Serial.begin(115200);
}

void loop()
{
//  static int board = 1;
//  static int relay = 1;
//
//  sprintf(cmd, "e%df", relay);
//  SerialCmdDone(board, cmd);
//  if (++relay > MAX_RELAYS) {
//    relay = 1;
//    if (++board > MAX_BOARDS) board = 1;
//  }
//  sprintf(cmd, "e%do", relay);
//  SerialCmdDone(board, cmd);
//
//  delay(DELAY);
//  wdt_reset();
}


///* IO Expander
// *
// * Control 64 Relays
// *
// */
//
//#include <SoftwareSerial.h>
//#include "IOExpander.h"
//#include <avr/wdt.h>
//
////#define SERIAL_DEBUG
//#define MAX_RELAYS 64
//
//#ifdef SERIAL_DEBUG
//SoftwareSerial swSerial(8,7);
//#endif
//
//char cmd[10];
//
//void setup()
//{
//  Serial.begin(115200);
//#ifdef SERIAL_DEBUG
//  swSerial.begin(115200);
//  swSerialEcho = &swSerial;
//#endif
//  wdt_enable(WDTO_8S);
//  sprintf(cmd, "eb%d", MAX_RELAYS / 16);
//  SerialCmdDone(cmd);
//}
//
//void loop()
//{
//  static int i = 1;
//
//  sprintf(cmd, "e%df", i);
//  SerialCmdDone(cmd);
//  if (i++ >= MAX_RELAYS) i = 1;
//  sprintf(cmd, "e%do", i);
//  SerialCmdDone(cmd);
//
//  delay(100);
//  wdt_reset();
//}
