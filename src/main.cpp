
#include "main2.h"

WiFiServer server(80);
int contconexion = 0;
String header; // Variable para guardar el HTTP request
ZMPT101B voltageSensor (34);// se declara el PIN 
unsigned int dcOffsetSamples= 0;//Offset sensorZMPT101B

#define OLED_RESET 4
Adafruit_SSD1306 display(OLED_RESET);
#if (SSD1306_LCDHEIGHT != 32)
#error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif
//---------------------------SETUP FIREBASE--------------------------------
#include "addons/TokenHelper.h"//proceso de generación del token.
#include "addons/RTDBHelper.h"//carga útil de RTDB y otras funciones auxiliares.
FirebaseData fbdo;// Definir objetos de Firebase
FirebaseAuth auth;
FirebaseConfig config;
String uid;// Variable a guardar USER UID
String voltPath = "/volt";// Nodos secundarios de la base de datos
String timePath = "/timestamp";
String parentPath;// Nodo principal (que se actualizará en cada ciclo)
int timestamp;
FirebaseJson json;
const char* ntpServer = "pool.ntp.org";   //servidor de marca de tiempo
FirebaseData firebaseData;//Objeto de datos de Firebase
String databasePath;// Variables para guardar las rutas de la base de datos
// Temporizador de variables (envía nuevas lecturas cada tres minutos)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 180000;//3min=180000 miliseconds
                                  //2min= 120000 milisegundos.....1min=60000 ms
void setup() {
  int smooth_val =0; // calibración ADC
        for(int i=0; i < samples; i++){
        smooth_val = adc1_get_raw(A4);
        }
        smooth_val /= samples;
        if(smooth_val > 4095){smooth_val = 4095;}//
  Serial.begin(9600);//número de símbolos por segundo(baudios)
  Serial.println("Removing DC Offset...");
  Serial.println("");

  unsigned int accum = 0; // valores del sensor muestreados
  for(int i=0; i<100; i++)
  {
  accum += analogRead(34),
  delayMicroseconds(1000); //intervalo de tiempo de lecturas
  }
  dcOffsetSamples = accum/100;//cada 100 lecturas
  float dcOffsetVolts = dcOffsetSamples * Vref/ADCScale;
  voltageSensor.setZeroPoint(dcOffsetSamples);
  voltageSensor.setSensitivity((sensitivity));
  //Serial.println(String("DC offset = ") + dcOffsetVolts + "Volts");
  printf("DC offset = %f Volts\n", dcOffsetVolts);
  // Conexión WIFI
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectado al wifi");
  //Cuenta hasta 50 si no se puede conectar lo cancela
  while (WiFi.status() != WL_CONNECTED and contconexion <50){ 
    ++contconexion;
    delay(500);
    Serial.print(".");
   }
    if (contconexion <50) {
      Serial.println("");
      Serial.println("WiFi conectado");
      Serial.println(WiFi.localIP());
     server.begin(); // iniciamos el servidor
    }
     else { 
        Serial.println("");
        Serial.println("Error de conexion");
      }
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  //Inicializa OLED I2C 0x3C (para 128x64)
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  
  display.clearDisplay(); //limpia el Buffer
  display.display();
  configTime(0, 0, ntpServer); //servidor de marca de tiempo

  config.api_key = API_KEY;// Asigne la clave api (obligatorio)
  // Asigne las credenciales de inicio de sesión del usuario
  auth.user.email = USER_EMAIL1, USER_EMAIL2;
  auth.user.password = USER_PASSWORD1, USER_PASSWORD2;
  config.database_url = DATABASE_URL; // Asigne la URL de RTDB (obligatorio)
  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);
  // Asigne la función de devolución de llamada para la tarea de generación de tokens de ejecución prolongada
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  // Asigne el reintento máximo de generación de tokens
  config.max_token_generation_retry = 5;
  // Inicialice la biblioteca con la autenticación y configuración de Firebase
  Firebase.begin(&config, &auth);
  // Obtener el UID del usuario puede tardar unos segundos
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);//tiempo de espera
  }
  uid = auth.token.uid.c_str();// Imprime user UID
  Serial.print("User UID: ");
  Serial.println(uid);
  // Actualizar la ruta de la base de datos
  databasePath = "/UsersData/" + uid + "/volt"; 
}
void loop() {
adc1_config_channel_atten(A4, ADC_ATTEN_DB_11); //ESTA INSTRUCCIÓN SE REFIERE A LA ATENUACIÓN 
adc1_config_width(ADC_WIDTH_BIT_12);	//ESTA INSTRUCCIÓN SE REFIERE A LA RESOLUCIÓN
// Enviar nuevas lecturas a la base de datos
  if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();

    timestamp = getTime();
    Serial.print ("time: ");
    Serial.println (timestamp);
    parentPath= databasePath + "/" + String(timestamp);
    json.set(voltPath.c_str(), String((voltageSensor.getVoltageAC(60))));
    json.set(timePath, String(timestamp));
    Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, parentPath.c_str(), &json) ? "ok" : fbdo.errorReason().c_str());
  }
  WiFiClient client = server.available();   // Escucha a los clientes entrantes
  if (client) {                             // Si se conecta un nuevo cliente
    Serial.println("New Client.");          // 
    String currentLine = "";                //
    while (client.connected()) {            // loop mientras el cliente está conectado
      if (client.available()) {             // si hay bytes para leer desde el cliente
        char c = client.read();             // lee un byte
        Serial.write(c);                    // imprime ese byte en el monitor serial
        header += c;
        if (c == '\n') {                    // si el byte es un caracter de salto de linea
          // si la nueva linea está en blanco significa que es el fin del 
          // HTTP request del cliente, entonces respondemos:
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            client.println();// la respuesta HTTP temina con una linea en blanco
            break;
          } else { // si tenemos una nueva linea limpiamos currentLine
            currentLine = "";
            }
        } else if (c != '\r') {  // si C es distinto al caracter de retorno de carro
          currentLine += c;      // lo agrega al final de currentLine
          }
      } 
    }  
      header = "";// Limpiamos la variable header
      client.stop();// Cerramos la conexión
      Serial.println("Client disconnected.");
      Serial.println("");
  }
  //pantalla oled IP
  display.clearDisplay(); // Clear the buffer.
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(30,0);
  display.print(WiFi.localIP() );
  display.print(" IP");
  display.display();
  //pantalla oled Voltaje 
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(5,15);
  display.print(voltageSensor.getVoltageAC(60));
  display.print(" V");
  display.drawRect(1, 12, 100, 19, WHITE);//rectángulo
  display.display();//delay(2000);
  //Grab un ciclo de datos y calcula RMS
  float Vrms = voltageSensor.getVoltageAC(60);
  Serial.println(Vrms);
  delay(2000); //2min= 120000 milisegundos       //3min=180000 miliseconds  ....2min= 120000 milisegundos.....1min=60000 ms
}