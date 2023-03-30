#include <Arduino.h>
#include <unity.h>

void setUp() {
  // Configurar el hardware necesario para la prueba
}

void tearDown() {
  // Limpiar cualquier cosa que se haya utilizado durante la prueba
}

void test_ejemplo() {
  int resultado = 2 + 2;
  TEST_ASSERT_EQUAL_INT(4, resultado);
}

void setup() {
  UNITY_BEGIN(); // Inicializar el framework de pruebas unitarias
  RUN_TEST(test_ejemplo);
  UNITY_END(); // Finalizar la ejecución de las pruebas unitarias
}

void loop() {
  // No se hace nada en el loop para las pruebas unitarias
}
