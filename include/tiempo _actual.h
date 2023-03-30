#include <Arduino.h>
// Función que obtiene el tiempo de época actual

#include <_ansi.h>
#include <sys/_types.h>

unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
     Serial.println("Failed to obtain time");
     return(0);
  }
  time(&now);
  return now;
}