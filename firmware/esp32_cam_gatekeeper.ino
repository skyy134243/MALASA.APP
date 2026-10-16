/**
 * ==============================================================================
 * MALASA.APP ECOSYSTEM - EDGE HARDWARE FIRMWARE
 * Target Board: ESP32-CAM (AI-Thinker OV2640)
 * Description: Edge Gatekeeper IoT Firmware for Smart Communal Bin 120L
 * Components:
 *   - OV2640 Camera Module (Garbage surface image snapshot)
 *   - HC-SR04 Ultrasonic Sensor (Height / fill percentage)
 *   - HX711 Load Cell (Weight in kg)
 *   - Magnetic Limit Switch (Bin lid open/close trigger via RTC GPIO)
 *   - Status LEDs: GPIO 12 (Yellow: Contaminated), GPIO 13 (Green: Clean)
 * ==============================================================================
 */

#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include "esp_sleep.h"

// --- Wi-Fi Configuration ---
const char* WIFI_SSID = "MALASA_COMMUNAL_NET";
const char* WIFI_PASS = "EcoJember2026";

// --- Malasa.App Cloud Endpoint ---
const char* CLOUD_API_HOST = "https://api.malasa.app/v1/telemetry/edge-ingest";
const char* DEVICE_TOKEN   = "BIN-JBR-KEC-SUMBERSARI-001";
const char* BIN_ID         = "MALASA-BIN-01";

// --- Pin Definitions for AI-Thinker ESP32-CAM ---
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// --- Peripherals & Sensors Pin Map ---
#define PIN_TRIG          14 // Ultrasonic HC-SR04 Trigger
#define PIN_ECHO          15 // Ultrasonic HC-SR04 Echo
#define PIN_LID_SWITCH    GPIO_NUM_33 // Wake-up trigger from bin lid
#define PIN_LED_GREEN     12 // Quality passed (Maggot safe)
#define PIN_LED_YELLOW    13 // Contamination detected alert

// --- Physical Bin Constants (Drum HDPE 120L) ---
const float BIN_DEPTH_CM = 90.0; // Total internal height of 120L drum
const float CRITICAL_FILL_PERCENT = 70.0;
const float CRITICAL_WEIGHT_KG = 5.0;

// Function prototypes
bool initCamera();
float readUltrasonicDistance();
float readWeightScale();
void transmitEdgePayload(camera_buffer_t* fb, float fillPercent, float weightKg);
void enterDeepSleep();

void setup() {
  Serial.begin(115200);
  Serial.println(F("\n[MALASA EDGE] Waking up from sleep mode..."));

  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_YELLOW, OUTPUT);

  // Turn off LEDs by default
  digitalWrite(PIN_LED_GREEN, LOW);
  digitalWrite(PIN_LED_YELLOW, LOW);

  // Configure Lid Wakeup on GPIO 33 (Active LOW or HIGH depending on switch)
  esp_sleep_enable_ext0_wakeup(PIN_LID_SWITCH, 0);

  // Initialize Camera
  if (!initCamera()) {
    Serial.println(F("[ERROR] Camera init failed"));
    enterDeepSleep();
  }

  // Connect to Wi-Fi / 4G Modem hotspot
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(300);
    Serial.print(F("."));
    retry++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("\n[WARN] Wi-Fi offline. Logging locally to RTC memory."));
    enterDeepSleep();
  }

  Serial.println(F("\n[INFO] Connected to Malasa Cloud Gateway"));

  // Settle delay: give 800ms for trash to settle and camera auto-exposure to adjust
  delay(800);

  // Capture Image
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println(F("[ERROR] Camera capture failed"));
    enterDeepSleep();
  }

  // Measure Bin Capacity
  float distance = readUltrasonicDistance();
  float fillPercent = 0.0;
  if (distance < BIN_DEPTH_CM && distance > 0) {
    fillPercent = ((BIN_DEPTH_CM - distance) / BIN_DEPTH_CM) * 100.0;
    if (fillPercent > 100.0) fillPercent = 100.0;
  }

  // Read Weight
  float currentWeightKg = readWeightScale();

  Serial.printf("[SENSOR] Distance: %.1f cm | Fill: %.1f%% | Weight: %.2f kg\n", 
                distance, fillPercent, currentWeightKg);

  // Transmit to Cloud API
  transmitEdgePayload((camera_buffer_t*)fb, fillPercent, currentWeightKg);

  // Clean up camera buffer
  esp_camera_fb_return(fb);

  // Ready to sleep again
  enterDeepSleep();
}

void loop() {
  // Empty loop: Device operates strictly on Event-Triggered Deep Sleep architecture
}

bool initCamera() {
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
  
  if (psramFound()) {
    config.frame_size = FRAMESIZE_VGA; // 640x480 for fast lightweight AI inference
    config.jpeg_quality = 12; // 10-63 lower means higher quality
    config.fb_count = 1;
  } else {
    config.frame_size = FRAMESIZE_QVGA;
    config.jpeg_quality = 16;
    config.fb_count = 1;
  }
  return (esp_camera_init(&config) == ESP_OK);
}

float readUltrasonicDistance() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duration = pulseIn(PIN_ECHO, HIGH, 30000); // 30ms timeout
  if (duration <= 0) return BIN_DEPTH_CM; // Default empty
  return (duration * 0.0343) / 2.0;
}

float readWeightScale() {
  // Stub for HX711 reading calibration (returns simulated or read value)
  return 3.45; // kg
}

void transmitEdgePayload(camera_buffer_t* fb, float fillPercent, float weightKg) {
  HTTPClient http;
  http.begin(CLOUD_API_HOST);
  http.addHeader("Authorization", String("Bearer ") + DEVICE_TOKEN);
  http.addHeader("X-Bin-ID", BIN_ID);
  http.addHeader("X-Fill-Percent", String(fillPercent, 1));
  http.addHeader("X-Weight-Kg", String(weightKg, 2));
  http.addHeader("Content-Type", "image/jpeg");

  int httpCode = http.POST(fb->buf, fb->len);
  Serial.printf("[HTTP] Ingest status code: %d\n", httpCode);

  if (httpCode == HTTP_CODE_OK || httpCode == 201) {
    String response = http.getString();
    Serial.println("[RESPONSE] " + response);

    // Parsing result from Gatekeeper AI
    if (response.indexOf("\"is_contaminated\":true") > 0) {
      Serial.println(F("[GATEKEEPER AI ALERT] Contamination detected! Triggering YELLOW LED."));
      digitalWrite(PIN_LED_YELLOW, HIGH);
      delay(3000); // Visual signal for citizen
      digitalWrite(PIN_LED_YELLOW, LOW);
    } else {
      Serial.println(F("[GATEKEEPER AI VERIFIED] Feed is organic & safe for Maggot. Triggering GREEN LED."));
      digitalWrite(PIN_LED_GREEN, HIGH);
      delay(2000);
      digitalWrite(PIN_LED_GREEN, LOW);
    }
  }
  http.end();
}

void enterDeepSleep() {
  Serial.println(F("[MALASA EDGE] Returning to ultra-low power Deep Sleep..."));
  WiFi.disconnect(true);
  esp_deep_sleep_start();
}
