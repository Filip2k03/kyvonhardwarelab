import { bom, defineProject, step } from './helpers'

export const SENSOR_PROJECTS = [
  defineProject({
    number: 7,
    slug: 'digital-thermometer',
    title: 'Digital Thermometer',
    category: 'sensors',
    difficulty: 'beginner',
    objective: 'Read an LM35 analog temperature sensor and print Celsius over Serial.',
    prerequisites: ['analog-to-digital-conversion', 'environmental-sensors'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-lm35', 1), bom('hw-jumpers-mf', 1)],
    firmware: `void setup() { Serial.begin(9600); }
void loop() {
  int raw = analogRead(A0);
  float volts = raw * (5.0 / 1023.0);
  float celsius = volts * 100.0; // LM35 ~10mV/°C
  Serial.println(celsius);
  delay(500);
}`,
    explanation:
      'LM35 outputs approximately 10 mV per °C. Convert ADC counts to volts, then to temperature. Treat this as educational accuracy, not metrology-grade.',
    constructionSteps: [
      step('1', 'Power LM35', 'Vs to 5V, GND to GND, Vout to A0 — verify pinout.'),
      step('2', 'Serial', 'Upload and open Serial Monitor at 9600.'),
      step('3', 'Stimulus', 'Warm gently with fingers and watch the reading rise.'),
    ],
    testing: ['Room-temp plausible', 'Warming increases reading', 'No NaNs'],
    debugging: ['Stuck 0 ⇒ wiring/polarity', 'Wild values ⇒ poor ground / noise'],
    extensions: ['Show on LCD', 'High-temp alarm LED'],
    safety: ['Confirm LM35 orientation before powering'],
  }),
  defineProject({
    number: 8,
    slug: 'temperature-humidity-monitor',
    title: 'Temperature/Humidity Monitor',
    category: 'sensors',
    difficulty: 'beginner',
    objective: 'Read DHT11 humidity and temperature and display values on Serial (LCD optional).',
    prerequisites: ['environmental-sensors'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-dht11', 1), bom('hw-lcd1602', 1, 'Optional I2C backpack')],
    circuitId: 'dht11',
    firmware: `#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
void setup() { Serial.begin(9600); dht.begin(); }
void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) Serial.println("read fail");
  else { Serial.print(h); Serial.print("% "); Serial.println(t); }
  delay(2000);
}`,
    explanation:
      'DHT11 uses a timed single-wire protocol. Libraries hide timing but not pin-order mistakes. Respect minimum sampling intervals.',
    constructionSteps: [
      step('1', 'Verify silk', 'Match DHT VCC/DATA/GND to your module.'),
      step('2', 'DATA to D4', 'Power per module rating.'),
      step('3', 'Optional LCD', 'Show the same values on LCD1602 if available.'),
    ],
    testing: ['Non-NaN readings', 'Breath raises humidity', '2s sampling stable'],
    debugging: ['NaN ⇒ pin order/power', 'Stale values ⇒ polling too fast'],
    extensions: ['Comfort thresholds', 'CSV logging over Serial'],
    safety: ['Confirm 3.3V vs 5V module rating', 'Verify pin order'],
  }),
  defineProject({
    number: 9,
    slug: 'water-leak-alarm',
    title: 'Water Leak Alarm',
    category: 'sensors',
    difficulty: 'beginner',
    objective: 'Trigger a buzzer when a water sensor ADC reading crosses a wet threshold.',
    prerequisites: ['analog-to-digital-conversion', 'gpio'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-water-sensor', 1),
      bom('hw-buzzer-active', 1),
      bom('hw-led-red', 1),
      bom('hw-resistor-220', 1),
    ],
    circuitId: 'buzzer',
    firmware: `const int BUZ = 7, LED = 8, TH = 400;
void setup() {
  pinMode(BUZ, OUTPUT); pinMode(LED, OUTPUT); Serial.begin(9600);
}
void loop() {
  int raw = analogRead(A0);
  bool wet = raw > TH;
  digitalWrite(LED, wet);
  digitalWrite(BUZ, wet);
  Serial.println(raw);
  delay(100);
}`,
    explanation:
      'Water bridges sensing traces and changes the analog reading. Thresholding creates an alarm decision. Calibrate TH dry vs wet for your module.',
    constructionSteps: [
      step('1', 'Sensor', 'Wire water sensor analog out to A0 with supply/GND.'),
      step('2', 'Outputs', 'Active buzzer on D7, LED on D8.'),
      step('3', 'Calibrate', 'Note dry/wet counts; set TH midway with margin.'),
    ],
    testing: ['Dry quiet', 'Wet alerts', 'Threshold not chattering'],
    debugging: ['Always alarm ⇒ TH too low / wiring', 'Never alarm ⇒ wrong analog pin'],
    extensions: ['Hysteresis', 'Mute button'],
    safety: ['Low-voltage only', 'Dry probe after tests to reduce corrosion', 'Use brief buzzers near ears'],
  }),
  defineProject({
    number: 10,
    slug: 'sound-reactive-light',
    title: 'Sound Reactive Light',
    category: 'sensors',
    difficulty: 'intermediate',
    objective: 'Drive an LED from a KY-037 sound sensor analog or digital threshold output.',
    prerequisites: ['analog-to-digital-conversion', 'pwm'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-ky037', 1),
      bom('hw-led-red', 1),
      bom('hw-resistor-220', 1),
    ],
    firmware: `const int LED = 9;
void setup() { pinMode(LED, OUTPUT); }
void loop() {
  int raw = analogRead(A0);
  int duty = constrain(map(raw, 0, 1023, 0, 255), 0, 255);
  analogWrite(LED, duty);
}`,
    explanation:
      'The microphone board produces an analog envelope/waveform you can map to brightness. Digital DO can instead gate an on/off lamp using the onboard pot threshold.',
    constructionSteps: [
      step('1', 'Sensor power', 'VCC/GND to rails; AO to A0.'),
      step('2', 'LED PWM', 'LED on D9.'),
      step('3', 'Stimulate', 'Clap/speak and observe brightness response.'),
    ],
    testing: ['Quiet dimmer than loud', 'No stuck full brightness from wiring to 5V'],
    debugging: ['No response ⇒ AO vs DO mixup', 'Saturated ⇒ gain/threshold pot'],
    extensions: ['Use DO for clap toggle', 'Peak-hold decay'],
    safety: ['Keep analog within ADC range'],
  }),
] as const
