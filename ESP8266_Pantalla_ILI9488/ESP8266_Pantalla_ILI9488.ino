#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <TFT_eSPI.h>
#include "imagen_verificacion.h"
#include "imagen_stop.h"
#include "imagen_personalizada.h"
#include "imagen_grande.h"

TFT_eSPI tft;  // Inicializa el objeto TFT
unsigned long tiempoInicio = 0;
bool bienvenidaActivada = false;

// Define el pin de control del relé
const int pinRele = D2;  // Puedes cambiar el número del pin según tu configuración

// Define el intervalo de reinicio en milisegundos (30 minutos)
const unsigned long intervaloReinicio = 1800000;
unsigned long tiempoUltimoReinicio = 0;

void setup() {
  Serial.begin(115200);
  tft.init();          // Inicializa la pantalla
  tft.setRotation(3);  // Ajusta la rotación de la pantalla según sea necesario
  // Intercambia el orden de los bytes de color al renderizar
  tft.setSwapBytes(true);

  // Configura el pin del relé como salida
  pinMode(pinRele, OUTPUT);
  // Inicializa el relé en modo NC (Normalmente Cerrado)
  digitalWrite(pinRele, HIGH);
}

void loop() {
  // Verifica el tiempo transcurrido desde el último reinicio
  if (millis() - tiempoUltimoReinicio >= intervaloReinicio) {
    // Reinicia el ESP8266
    ESP.restart();
  }

  if (Serial.available() > 0) {
    String resultado = Serial.readStringUntil('\n');
    Serial.println(resultado);
    mostrarMensajeEnPantalla(resultado.c_str());
    tiempoInicio = millis();
    bienvenidaActivada = false;
  }

  if (!bienvenidaActivada && millis() - tiempoInicio >= 5000) {
    mostrarMensajeBienvenida();
    bienvenidaActivada = true;
  }

  delay(100);
}

void mostrarMensajeEnPantalla(const char* mensaje) {
  String mensajeLimpiado = mensaje;
  mensajeLimpiado.trim();
  int xPos;
  int imgXPos;

  if (strcasecmp(mensajeLimpiado.c_str(), "Persona autorizada.") == 0) {
    // Escenario 1: "Persona autorizada"
    tft.fillScreen(TFT_BLACK);  // Fondo negro
    tft.setTextSize(3);
    tft.setTextColor(TFT_WHITE);

    xPos = (tft.width() - tft.textWidth("Persona autorizada")) / 2;
    tft.setCursor(xPos, 100);
    tft.println("Persona autorizada");

    // Muestra la imagen de verificación centrada
    imgXPos = (tft.width() - 139) / 2;
    tft.pushImage(imgXPos, 150, 139, 120, imagen_verificacion);
    digitalWrite(pinRele, LOW);
    delay(5000);
    digitalWrite(pinRele, HIGH);
  } else if (strcasecmp(mensajeLimpiado.c_str(), "Persona no autorizada.") == 0) {
    tft.fillScreen(TFT_BLACK);  // Fondo negro
    tft.setTextSize(3);
    tft.setTextColor(TFT_WHITE);
    // Escenario 2: "Persona no autorizada"
    xPos = (tft.width() - tft.textWidth("Persona no autorizada")) / 2;
    tft.setCursor(xPos, 100);
    tft.println("Persona no autorizada");
    digitalWrite(pinRele, HIGH);

    // Muestra la imagen de la señal de stop centrada
    imgXPos = (tft.width() - 150) / 2;
    tft.pushImage(imgXPos, 150, 150, 150, imagen_stop);
  } else if (strcasecmp(mensajeLimpiado.c_str(), "No hay rostros") == 0) {
    tft.fillScreen(TFT_WHITE);  // Fondo negro
    tft.setTextSize(2);
    tft.setTextColor(TFT_BLACK);
    // Escenario 3: "No se encontraron rostros"
    xPos = (tft.width() - tft.textWidth("No se encontro un rostro en la foto.")) / 2;
    tft.setCursor(xPos, 100);
    tft.println("No se encontro un rostro en la foto.");

    // Muestra la imagen personalizada centrada
    imgXPos = (tft.width() - 150) / 2;
    tft.pushImage(imgXPos, 150, 150, 150, imagen_personalizada);
  } else {
    tft.fillScreen(TFT_BLACK);  // Fondo negro
    tft.setTextSize(3);
    tft.setTextColor(TFT_WHITE);
    // Escenario 5: "Espere un momento..."
    xPos = (tft.width() - tft.textWidth("Espere un momento...")) / 2;
    tft.setCursor(xPos, 150);
    tft.println("Espere un momento...");
  }
}

void mostrarMensajeBienvenida() {
  // Escenario 4: "Imagen Grande"
  tft.fillScreen(TFT_BLACK);                     // Fondo negro
  tft.pushImage(0, 0, 480, 320, imagen_grande);  // Muestra la imagen grande

  // Actualiza el tiempo del último reinicio
  tiempoUltimoReinicio = millis();
}
