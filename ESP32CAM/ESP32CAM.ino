#include <Arduino.h>
#include <WiFi.h>
#include "esp_camera.h"
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include <ArduinoJson.h>

String getBody;
String getAll;
const char* api_key = "API_KEY";


#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27

#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22



// LED Flash PIN (GPIO 4)
#define FLASH_LED_PIN 4

// Define el pin del sensor HC-SR04
const int trigPin = 14;
const int echoPin = 2;


// Inserta tus credenciales de red
const char* ssid = "SSID";
const char* password = "password";


const char* serverName = "0.0.0.0";

const int serverPort = port;


const char* serverPath = "/compare";

// Variable para controlar si el flash LED está encendido o apagado


bool LED_Flash_ON = false;

// Inicializa WiFiClient
WiFiClient client;

String AllData;
String DataBody;

void setup() {
  // Deshabilita el detector de brownout
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200);
  pinMode(FLASH_LED_PIN, OUTPUT);
  WiFi.mode(WIFI_STA);

  // Conexión a la red WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    //Serial.println("Conectando a WiFi...");
  }

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // init with high specs to pre-allocate larger buffers
  if (psramFound()) {
    config.frame_size = FRAMESIZE_UXGA;
    config.jpeg_quality = 10;  //--> 0-63 lower number means higher quality
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 8;  //--> 0-63 lower number means higher quality
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    //Serial.printf("Error en la inicialización de la cámara: 0x%x", err);
    return;
  }

  // Selecciona la resolución de la cámara (puedes cambiarla según tus necesidades)
  sensor_t* s = esp_camera_sensor_get();
  s->set_framesize(s, FRAMESIZE_SVGA);  // Cambia esto según la resolución deseada

  //Serial.println("Configuración completa");

  // Configura los pines del sensor HC-SR04
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}



void sendPhotoToServer() {

  getBody = "";
  if (LED_Flash_ON) {
    digitalWrite(FLASH_LED_PIN, HIGH);
    delay(2000);
  }
  camera_fb_t* fb = NULL;
  fb = esp_camera_fb_get();
  //Serial.println("Tomando una foto...");


  if (!fb) {
    //Serial.println("Error al capturar imagen");
    return;
  }

  if (LED_Flash_ON) {
    digitalWrite(FLASH_LED_PIN, LOW);
  }

  //Serial.println("Tomando una foto exitosa.");

  //Serial.println("Conectando al servidor: " + String(serverName));


  if (client.connect(serverName, serverPort)) {
    //Serial.println("Conexión exitosa!");

    String post_data = "--dataMarker\r\nContent-Disposition: form-data; name=\"imageFile\"; filename=\"ESP32CAMCap.jpg\"\r\nContent-Type: multipart/form-data\r\n\r\n";
    String head = post_data;
    String boundary = "\r\n--dataMarker--\r\n";

    uint32_t imageLen = fb->len;
    uint32_t dataLen = head.length() + boundary.length();
    uint32_t totalLen = imageLen + dataLen;

    String serverPathStr = String(serverPath);
    String serverNameStr = String(serverName);


    client.println("POST " + serverPathStr + " HTTP/1.1");
    client.println("Host: " + serverNameStr);
    client.println("Content-Type: multipart/form-data; boundary=dataMarker");
    client.println("Content-Length: " + String(totalLen));
    client.println("X-API-Key: " + String(api_key));
    client.println();
    client.print(head);


    uint8_t* fbBuf = fb->buf;
    size_t fbLen = fb->len;
    for (size_t n = 0; n < fbLen; n = n + 1024) {
      if (n + 1024 < fbLen) {
        client.write(fbBuf, 1024);
        fbBuf += 1024;
      } else if (fbLen % 1024 > 0) {
        size_t remainder = fbLen % 1024;
        client.write(fbBuf, remainder);
      }
    }
    client.print(boundary);

    esp_camera_fb_return(fb);


    int timoutTimer = 10000;
    long startTimer = millis();
    boolean state = false;

    while ((startTimer + timoutTimer) > millis()) {
      //Serial.print(".");
      delay(100);
      while (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (getAll.length() == 0) { state = true; }
          getAll = "";
        } else if (c != '\r') {
          getAll += String(c);
        }
        if (state == true) { getBody += String(c); }
        startTimer = millis();
      }
      if (getBody.length() > 0) { break; }
    }

    Serial.println(getBody);

    client.stop();

  } else {
    //Serial.println("Error al conectar al servidor.");
    client.stop();
    return;
  }
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);

  float temperature = obtenerTemperatura();  // Debes implementar la función para obtener la temperatura actual
  float speedOfSound = 331.5 + 0.6 * temperature;

  float distance = (speedOfSound * duration) / (2 * 10000);  // Convertir a centímetros

  if (distance < 10) {
    sendPhotoToServer();
  } else {
  }
  delay(1000);
}

// Implementación de la función obtenerTemperatura
float obtenerTemperatura() {
  // Implementa la lógica para obtener la temperatura aquí
  // Puedes usar un sensor de temperatura o cualquier otro método
  // Retorna la temperatura en grados Celsius
  return 25.0;  // Ejemplo: temperatura constante de 25 grados Celsius
}
