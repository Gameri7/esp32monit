#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/adc.h"

#define A4 ADC1_CHANNEL_6
#define samples 64

//Sensitivity = (Arduino  Ac input peakvolts)/(VAC input peak)
//= 1.8/170 = 0.01059               //1.8 valor 1 binario  //170 valor maximo de la onda 
// 1.8/245 = 0.00735
// 1.8/240= 0.0075;           //primero poner en 1, copilar, luego ese valor en este caso =6.7; dividirlo para el voltaje medido con multimetro =125 ==0.0536 ingresar nuevamente este valor y copilar de nuevo

float sensitivity = 0.01059;           //primero poner en 1, copilar, luego ese valor en este caso =6.7; dividirlo para el voltaje medido con multimetro =125 ==0.0536 ingresar nuevamente este valor y copilar de nuevo
//float ADCScale = 1023.0;          //resolución del arduino
float ADCScale = 4095.0;          //resolución del Esp wroom 32 (12 bits equivale a 4096)
float Vref = 3.3;

