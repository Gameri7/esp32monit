#include <Arduino.h>//compatibilidad con arduino
#include <SPI.h>//Pantalla oled
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h> //
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <ZMPT101B.h>
#include "time.h"
// librerias personales include
#include "sensitivity_volt.h"
#include "wifi_ssid.h"
#include "firebase.h"
#include "autorized.h"
#include "API_KEY.h"
#include "tiempo _actual.h"