#include <HardwareSerial9Bit.h>
#include "IOExpander9Bit.h"
#include <avr/wdt.h>

#define MAX_BOARDS 3
#define MAX_RELAYS 128

void setup() {
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

const byte numChars = 35;
char receivedChars[numChars];
boolean newData = false;
boolean finishedResponse = false;


void loop() {
  receiveCommand();
  sendCommand();
}

void receiveCommand() {
  static boolean recvInProgress = false;
  static byte index = 0;
  char startMarker = '[';
  char endMarker = ']';
  char rc;
  
  while (newData == false) {
    if (Serial9Bit.available() > 0) {
      rc = Serial9Bit.read();
//      Serial9Bit.print(rc);
          
      if (recvInProgress == true) {
        if (rc != endMarker) {
          receivedChars[index] = rc;
          index++;
          if (index >= numChars) {
            index = numChars - 1;
          }
        }
        else {
          recvInProgress = false;
          index = 0;
          newData = true;
        }
      }
      
      else if (rc == startMarker) {
        recvInProgress = true;
      }
    }
  }
//  Serial9Bit.println();
}

void sendCommand() {
  unsigned char board;
  char cmd[34];
  if (newData == true) {
    board = receivedChars[0] - 48; // Convert from ascii to true index
    sprintf(cmd, "%.34s", &receivedChars[1]);
//    Serial9Bit.println(board);
//    Serial9Bit.println(cmd);
    Serial9Bit1.address(board);
    Serial9Bit1.println(cmd);
//    readResponse();
    newData = false;
  }
}

void readResponse() {
  static char rc;
  finishedResponse = false;
  
  while (finishedResponse == false) {
    if (Serial9Bit1.available() > 0) {
      rc = Serial9Bit1.read();
//      Serial9Bit.print(rc);
      if (rc == '>') {
//        Serial9Bit.println();
        finishedResponse = true;
        Serial9Bit.println("%");     
      }
    }
  }
}
