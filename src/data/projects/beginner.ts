import { bom, defineProject, step } from './helpers'

export const BEGINNER_PROJECTS = [
  defineProject({
    number: 1,
    slug: 'blink',
    title: 'Blink',
    category: 'beginner',
    difficulty: 'beginner',
    objective: 'Blink an LED from a GPIO pin through a series resistor and confirm the firmware loop.',
    prerequisites: ['leds-and-resistors'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-led-red', 1),
      bom('hw-resistor-220', 1),
      bom('hw-breadboard-830', 1),
      bom('hw-jumper-set', 1),
    ],
    circuitId: 'led',
    firmware: `const int LED_PIN = 8;
void setup() { pinMode(LED_PIN, OUTPUT); }
void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`,
    explanation:
      'Driving the pin HIGH sources current through the resistor and LED to ground. The resistor sets safe current. delay() creates a visible blink for verification.',
    constructionSteps: [
      step('1', 'Power rails', 'Connect MCU 5V/GND to breadboard rails.'),
      step('2', 'LED path', 'D8 → 220Ω → LED anode; cathode → GND.'),
      step('3', 'Upload', 'Upload the sketch and open Serial only if needed later.'),
    ],
    testing: ['LED blinks ~1 Hz', 'No excessive LED heating', 'Unplug/replug recovers cleanly'],
    debugging: ['Check polarity', 'Confirm pin number matches sketch', 'Verify common ground'],
    extensions: ['Change blink rate', 'Add a second LED on another pin'],
    safety: ['Always use a series resistor', 'Stay on USB/5V lab power'],
  }),
  defineProject({
    number: 2,
    slug: 'traffic-light',
    title: 'Traffic Light',
    category: 'beginner',
    difficulty: 'beginner',
    objective: 'Sequence red, yellow, and green LEDs like a basic traffic signal.',
    prerequisites: ['leds-and-resistors', 'gpio'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-led-red', 1),
      bom('hw-led-yellow', 1),
      bom('hw-led-green', 1),
      bom('hw-resistor-220', 3),
      bom('hw-breadboard-830', 1),
    ],
    firmware: `const int RED = 8, YEL = 9, GRN = 10;
void setup() {
  pinMode(RED, OUTPUT); pinMode(YEL, OUTPUT); pinMode(GRN, OUTPUT);
}
void setLights(int r, int y, int g) {
  digitalWrite(RED, r); digitalWrite(YEL, y); digitalWrite(GRN, g);
}
void loop() {
  setLights(HIGH, LOW, LOW); delay(3000);
  setLights(LOW, HIGH, LOW); delay(1000);
  setLights(LOW, LOW, HIGH); delay(3000);
}`,
    explanation:
      'Each LED is an independent GPIO load with its own resistor. Timing in loop() models signal phases. Mutual exclusion of states prevents ambiguous “two greens”.',
    constructionSteps: [
      step('1', 'Three LED branches', 'Wire R/Y/G with 220Ω resistors to D8/D9/D10.'),
      step('2', 'Commons', 'All cathodes to GND.'),
      step('3', 'Sequence test', 'Upload and verify phase order by eye.'),
    ],
    testing: ['Only one lamp on at a time in this sketch', 'Timing matches delays', 'No shared resistor mistakes'],
    debugging: ['If two light: check wiring shorts', 'If one dark: polarity/resistor'],
    extensions: ['Add pedestrian button hold', 'Use millis() instead of delay'],
    safety: ['Current-limit every LED', 'Avoid staring at bright LEDs up close'],
  }),
  defineProject({
    number: 3,
    slug: 'button-controlled-led',
    title: 'Button Controlled LED',
    category: 'beginner',
    difficulty: 'beginner',
    objective: 'Turn an LED on while a button is pressed using INPUT_PULLUP active-low wiring.',
    prerequisites: ['buttons-and-digital-input'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-push-button', 1),
      bom('hw-led-green', 1),
      bom('hw-resistor-220', 1),
      bom('hw-breadboard-830', 1),
    ],
    circuitId: 'button',
    firmware: `const int BTN = 2, LED = 8;
void setup() {
  pinMode(BTN, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}
void loop() {
  digitalWrite(LED, digitalRead(BTN) == LOW ? HIGH : LOW);
}`,
    explanation:
      'INPUT_PULLUP holds the pin HIGH until the button closes to GND. The LED mirrors the pressed state. This teaches digital input without an external pull resistor.',
    constructionSteps: [
      step('1', 'Button', 'Wire button between D2 and GND.'),
      step('2', 'LED', 'Wire LED+resistor on D8 as in Blink.'),
      step('3', 'Verify idle', 'LED off when released; on when pressed.'),
    ],
    testing: ['Idle LED off', 'Pressed LED on', 'No random flicker when wired correctly'],
    debugging: ['Flicker ⇒ floating input / wrong pinMode', 'Always on ⇒ short to GND'],
    extensions: ['Toggle on rising edge', 'Add debounce'],
    safety: ['Do not hard-short 5V to GND through the button'],
  }),
  defineProject({
    number: 4,
    slug: 'rgb-controller',
    title: 'RGB Controller',
    category: 'beginner',
    difficulty: 'beginner',
    objective: 'Mix colors on an RGB module using three PWM channels.',
    prerequisites: ['pwm', 'leds-and-resistors'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-rgb-module', 1, 'Confirm common anode/cathode'),
      bom('hw-resistor-220', 3, 'If module lacks resistors'),
      bom('hw-pot-10k', 1, 'Optional brightness'),
    ],
    firmware: `const int R = 9, G = 10, B = 11;
void setup() {
  pinMode(R, OUTPUT); pinMode(G, OUTPUT); pinMode(B, OUTPUT);
}
void loop() {
  analogWrite(R, 255); analogWrite(G, 40); analogWrite(B, 0); delay(1000);
  analogWrite(R, 0); analogWrite(G, 180); analogWrite(B, 80); delay(1000);
}`,
    explanation:
      'PWM duty on each channel sets perceived brightness. Mixing channels creates colors. Common-anode modules invert the drive sense — verify before copying values.',
    constructionSteps: [
      step('1', 'Identify common', 'Confirm COM wiring for your RGB module.'),
      step('2', 'PWM pins', 'Connect R/G/B to PWM-capable pins with resistors if needed.'),
      step('3', 'Sweep', 'Upload color sequence and note perceived hues.'),
    ],
    testing: ['Colors change distinctly', 'No channel stuck full-on from wiring error'],
    debugging: ['Wrong common ⇒ inverted colors', 'Non-PWM pin ⇒ coarse/no dimming'],
    extensions: ['Map pot to brightness', 'Smooth cross-fade with millis'],
    safety: ['Current-limit each channel', 'Avoid staring into bright LEDs'],
  }),
  defineProject({
    number: 5,
    slug: 'potentiometer-dimmer',
    title: 'Potentiometer Dimmer',
    category: 'beginner',
    difficulty: 'beginner',
    objective: 'Dim an LED by mapping a potentiometer ADC reading to PWM duty.',
    prerequisites: ['potentiometers', 'pwm', 'analog-to-digital-conversion'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-pot-10k', 1),
      bom('hw-led-red', 1),
      bom('hw-resistor-220', 1),
    ],
    circuitId: 'potentiometer',
    firmware: `const int LED = 9;
void setup() { pinMode(LED, OUTPUT); }
void loop() {
  int raw = analogRead(A0);
  analogWrite(LED, map(raw, 0, 1023, 0, 255));
}`,
    explanation:
      'The pot forms a voltage divider into A0. map() scales 10-bit ADC into 8-bit PWM. This links sensing and actuation without blocking delays.',
    constructionSteps: [
      step('1', 'Pot divider', 'Ends to 5V/GND, wiper to A0.'),
      step('2', 'LED PWM', 'LED+resistor on D9.'),
      step('3', 'Sweep', 'Turn pot fully and confirm smooth dimming.'),
    ],
    testing: ['Min ≈ off', 'Max ≈ bright', 'Mid values intermediate'],
    debugging: ['Stuck bright/dark ⇒ pot wiring', 'No dimming ⇒ non-PWM pin'],
    extensions: ['Print volts on Serial', 'Add hysteresis night-light threshold'],
    safety: ['Do not use the pot as a motor rheostat'],
  }),
  defineProject({
    number: 6,
    slug: 'automatic-night-light',
    title: 'Automatic Night Light',
    category: 'beginner',
    difficulty: 'beginner',
    objective: 'Turn on an LED when an LDR divider reports darkness, using hysteresis.',
    prerequisites: ['analog-to-digital-conversion', 'potentiometers'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-ldr-5528', 1),
      bom('hw-resistor-10k', 1),
      bom('hw-led-yellow', 1),
      bom('hw-resistor-220', 1),
    ],
    circuitId: 'ldr-divider',
    firmware: `const int LED = 8;
const int ON_TH = 700, OFF_TH = 600;
bool lamp = false;
void setup() { pinMode(LED, OUTPUT); }
void loop() {
  int raw = analogRead(A1);
  if (!lamp && raw > ON_TH) lamp = true;
  if (lamp && raw < OFF_TH) lamp = false;
  digitalWrite(LED, lamp ? HIGH : LOW);
  delay(50);
}`,
    explanation:
      'An LDR divider changes with light. Separate on/off thresholds (hysteresis) prevent chatter near the trip point. Thresholds are experimental for your divider orientation.',
    constructionSteps: [
      step('1', 'LDR divider', 'Build LDR+10k divider into A1; document which way dark increases counts.'),
      step('2', 'Lamp LED', 'LED on D8 through 220Ω.'),
      step('3', 'Calibrate', 'Cover/uncover LDR and tune thresholds.'),
    ],
    testing: ['Dark turns lamp on', 'Light turns lamp off', 'No rapid flicker at threshold'],
    debugging: ['Inverted behavior ⇒ swap threshold sense', 'No change ⇒ divider wiring'],
    extensions: ['PWM soft lamp', 'Log thresholds to EEPROM later'],
    safety: ['Keep ADC within 0..Vref', 'Series resistor on LED'],
  }),
] as const
