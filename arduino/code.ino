void setup() {
  Serial.begin(9600); // Start serial communication at 9600 baud rate
}

void loop() {
  Serial.println("Sensor1:" + String(analogRead(A0)));
  Serial.println("Sensor2:" + String(analogRead(A1)));
  Serial.println("Sensor3:" + String(analogRead(A2)));
  Serial.println("Sensor4:" + String(analogRead(A3)));
  Serial.println("Sensor5:" + String(analogRead(A4)));
  delay(50); // Wait
}
