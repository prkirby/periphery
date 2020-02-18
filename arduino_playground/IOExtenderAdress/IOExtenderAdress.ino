/* IO Expander
// *
// * Set Board Address
// *
// */

#define BOARD_ADDRESS 1
char cmd[10];

// Set up for the Mega
void setup()
{
  Serial.begin(115200);
  Serial1.begin(115200);

  Serial.println("---- start ----");
 
  sprintf(cmd, "#b%d", BOARD_ADDRESS);
  Serial1.println(cmd);
  Serial.println(Serial1.readStringUntil('>'));
  Serial.println("---- finish ----");
}

void loop() {
  
}
