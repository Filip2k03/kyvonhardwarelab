import { defineLesson, q } from './helpers'

export const INTERMEDIATE_LESSONS = [
  defineLesson({
    number: 8,
    slug: 'environmental-sensors',
    title: 'Environmental Sensors',
    objective: 'Read temperature/humidity (DHT11) and reason about timing and revision-dependent pinouts.',
    prerequisites: ['pwm'],
    requiredHardware: ['dht11', 'atmega328p-arduino-compatible', 'jumpers-male-female'],
    safety: [
      'Verify DHT11 pin order on your module silk screen.',
      'Stay within the module’s rated supply (often 3.3–5V).',
    ],
    theory:
      'The DHT11 communicates over a single timed digital line. The MCU must follow a request/response timing protocol. Sensor accuracy and sampling interval are limited — treat readings as educational measurements, not metrology-lab grade.',
    visualExplanation:
      'MCU pulls the data line to request a sample; the sensor responds with a bitstream encoding humidity and temperature.',
    wiring: 'DHT11 VCC→5V (if rated), GND→GND, DATA→D4. Some modules include a pull-up already.',
    prediction: 'Wrong pin order often yields timeouts or garbage readings rather than a partial value.',
    firmware: `// Pseudocode-level sketch structure (use a maintained DHT library in practice)
#include <DHT.h>
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    Serial.println("Read failed — check wiring/timing.");
  } else {
    Serial.print("H=");
    Serial.print(h);
    Serial.print("% T=");
    Serial.println(t);
  }
  delay(2000);
}`,
    codeWalkthrough:
      'Libraries hide low-level timing but not wiring mistakes. Always check isnan and respect minimum sampling intervals.',
    physicalExperiment: 'Breath near the sensor and watch humidity trend. Cup a hand to raise temperature slightly.',
    expectedResult: 'Plausible humidity/temperature values that move with stimulus, not stuck at 0/NaN.',
    measurements: ['Sample interval', 'Stability over 1 minute', 'Response to breath humidity'],
    commonMistakes: ['Swapped DATA/VCC', 'Polling faster than the sensor allows'],
    debugging: ['Confirm supply with a meter', 'Try a known-good data pin and pull-up'],
    challenge: 'Log min/max temperature over 5 minutes and explain outliers.',
    miniProject: 'Serial “comfort index” message from humidity thresholds.',
    quiz: [
      q(
        'env-1',
        'Why can DHT reads fail even with power present?',
        [
          { id: 'a', label: 'Timing/protocol or wiring errors on the data line', correct: true },
          { id: 'b', label: 'Because LEDs are too bright' },
          { id: 'c', label: 'Because USB cannot carry ground' },
        ],
        'The single-wire protocol and pinout are common failure points.',
      ),
    ],
  }),
  defineLesson({
    number: 9,
    slug: 'lcd-displays',
    title: 'LCD Displays',
    objective: 'Display sensor or status text on an LCD1602 and identify parallel vs I2C backpack wiring.',
    prerequisites: ['environmental-sensors'],
    requiredHardware: ['lcd1602', 'atmega328p-arduino-compatible', 'potentiometer-10k'],
    safety: ['Identify whether your LCD is parallel or I2C before wiring.'],
    theory:
      'Character LCDs accept commands and data. Contrast voltage and backlight are separate concerns from logic. I2C backpacks reduce pin count via an expander.',
    visualExplanation:
      'Parallel: many GPIO lines. I2C: SDA/SCL plus power. Contrast pot often sits on VO for parallel modules.',
    wiring:
      'If I2C backpack: VCC/GND/SDA/SCL to MCU. If parallel: follow RS/E/D4–D7 plus contrast pot on VO.',
    prediction: 'Wrong contrast looks like a “blank” display even when firmware is correct.',
    firmware: `#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2); // address is revision-dependent

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("KYVON Lab");
}

void loop() {}`,
    codeWalkthrough:
      'Initialization must match interface type. I2C address (0x27/0x3F common) varies by backpack.',
    physicalExperiment: 'Print a two-line message. Adjust contrast until characters are sharp.',
    expectedResult: 'Readable text on both lines; backlight behaves as expected.',
    measurements: ['I2C address scan result (if used)', 'Contrast pot position notes'],
    commonMistakes: ['Assuming I2C address', 'Missing backlight polarity'],
    debugging: ['Run an I2C scanner', 'Verify 5V/GND before blaming libraries'],
    challenge: 'Show DHT humidity on line 2 updating every 2 seconds.',
    miniProject: 'Build a splash screen then a live status screen.',
    quiz: [
      q(
        'lcd-1',
        'A blank LCD with backlight on often indicates:',
        [
          { id: 'a', label: 'Contrast or initialization/interface mismatch', correct: true },
          { id: 'b', label: 'That Ohm’s law is false' },
          { id: 'c', label: 'That USB data is encrypted' },
        ],
        'Contrast and init/wiring are the usual culprits.',
      ),
    ],
  }),
  defineLesson({
    number: 10,
    slug: 'seven-segment-displays',
    title: 'Seven-Segment Displays',
    objective: 'Map digits to segments and multiplex a multi-digit display safely with current limits.',
    prerequisites: ['lcd-displays'],
    requiredHardware: ['seven-segment-1digit', 'seven-segment-4digit', 'resistor-220', 'atmega328p-arduino-compatible'],
    safety: [
      'Current-limit every LED segment path.',
      'Confirm common-anode vs common-cathode.',
    ],
    theory:
      'Seven segments (plus DP) encode digits. Multi-digit modules multiplex: one digit active at a time while persistence of vision makes them all appear lit.',
    visualExplanation:
      'Segment bitmasks select a–g. Digit commons select which digit is on during each time slice.',
    wiring: 'Start with a single digit and resistors. Only then move to the 4-digit multiplexed module.',
    prediction: 'Driving a common-cathode display with common-anode logic yields inverted garbage glyphs.',
    firmware: `// Example: light segments for digit "0" on a common-cathode single digit (pins illustrative)
const int SEG_A = 2;
void setup() {
  pinMode(SEG_A, OUTPUT);
  digitalWrite(SEG_A, HIGH);
}
void loop() {}`,
    codeWalkthrough:
      'Real projects use segment tables and timers. Understand polarity before copying multiplex code.',
    physicalExperiment: 'Display 0–9 on a single digit using a segment map you write yourself.',
    expectedResult: 'Each numeral is recognizable; segments are not overheated.',
    measurements: ['Segment current', 'Refresh rate if multiplexing'],
    commonMistakes: ['No resistors', 'Wrong common polarity'],
    debugging: ['Test one segment at a time', 'Verify commons with a meter'],
    challenge: 'Implement a 0–99 counter on 4 digits with visible multiplexing artifacts noted.',
    miniProject: 'Stopwatch tenths display (even if crude).',
    quiz: [
      q(
        'seg-1',
        'Multiplexing multi-digit displays works because of:',
        [
          { id: 'a', label: 'Persistence of vision plus fast digit scanning', correct: true },
          { id: 'b', label: 'Mains frequency locking only' },
          { id: 'c', label: 'Bluetooth pairing' },
        ],
        'Fast scanning fools the eye into seeing steady digits.',
      ),
    ],
  }),
  defineLesson({
    number: 11,
    slug: 'shift-registers',
    title: 'Shift Registers',
    objective: 'Expand outputs with a 74HC595 by shifting and latching serial data.',
    prerequisites: ['seven-segment-displays'],
    requiredHardware: ['74hc595', 'led-red', 'led-yellow', 'led-green', 'resistor-220', 'atmega328p-arduino-compatible'],
    safety: ['Respect total IC output current limits.'],
    theory:
      'A serial-in parallel-out shift register accepts bits on a data line clocked by SHCP, then transfers them to output latches on STCP. OE and MR provide enable/reset control.',
    visualExplanation:
      'Bits march through a chain, then appear simultaneously on Q0–Q7 when latched — few MCU pins control many outputs.',
    wiring: 'DS→D11, SHCP→D12, STCP→D10, VCC/GND powered, OE tied for enabled outputs per datasheet guidance, LEDs via resistors on Q0–Q2.',
    prediction: 'Clocking without latching updates the shift chain but not the visible outputs.',
    firmware: `const int DATA = 11;
const int CLOCK = 12;
const int LATCH = 10;

void setup() {
  pinMode(DATA, OUTPUT);
  pinMode(CLOCK, OUTPUT);
  pinMode(LATCH, OUTPUT);
}

void loop() {
  digitalWrite(LATCH, LOW);
  shiftOut(DATA, CLOCK, MSBFIRST, B00000111);
  digitalWrite(LATCH, HIGH);
  delay(500);
  digitalWrite(LATCH, LOW);
  shiftOut(DATA, CLOCK, MSBFIRST, B00000000);
  digitalWrite(LATCH, HIGH);
  delay(500);
}`,
    codeWalkthrough:
      'shiftOut clocks eight bits. The latch edge publishes them to Qn. Pattern B00000111 lights three LSBs when wired to LEDs.',
    physicalExperiment: 'Blink three LEDs via the 595. Confirm MCU pins alone are not sourcing those LED currents directly.',
    expectedResult: 'LED pattern matches latched bytes.',
    measurements: ['Latch timing notes', 'Output voltage on Q pins'],
    commonMistakes: ['Floating OE/MR', 'Swapped clock/latch'],
    debugging: ['Latch a known walking-bit pattern', 'Verify VCC on the 595'],
    challenge: 'Cascade two 595s conceptually and explain Q7′.',
    miniProject: 'Drive a single seven-segment digit through the 595.',
    quiz: [
      q(
        'sr-1',
        'What does the latch (STCP) edge do on a 74HC595?',
        [
          { id: 'a', label: 'Copies shift-register bits to the output latches', correct: true },
          { id: 'b', label: 'Deletes EEPROM' },
          { id: 'c', label: 'Starts a servo calibration' },
        ],
        'STCP updates visible parallel outputs.',
      ),
    ],
  }),
  defineLesson({
    number: 12,
    slug: 'led-matrices',
    title: 'LED Matrices',
    objective: 'Render patterns on an 8×8 matrix using a driver module when present.',
    prerequisites: ['shift-registers'],
    requiredHardware: ['led-matrix-8x8', 'atmega328p-arduino-compatible'],
    safety: [
      'Bare matrices need careful current control — prefer the kit’s driver board if included.',
    ],
    theory:
      'An 8×8 grid addresses rows/columns. Driver ICs (e.g., MAX7219-class) accept serial commands and handle scanning/current.',
    visualExplanation:
      'Framebuffer bits become lit pixels after the driver scans the grid faster than perception.',
    wiring: 'For MAX7219-style modules: VCC/GND/DIN/CS/CLK to MCU SPI-like pins per module docs.',
    prediction: 'Missing ground yields sparkles/noise; wrong CS pin yields a blank matrix.',
    firmware: `// Use a maintained MAX7219/matrix library matched to your module.
// Concept: set a pixel bitmap, then update the driver.`,
    codeWalkthrough:
      'Libraries send intensity and digit/row registers. Your job is coordinate mapping and power integrity.',
    physicalExperiment: 'Draw a border rectangle, then an animated scanning row.',
    expectedResult: 'Stable patterns without flickering from loose power.',
    measurements: ['Module current at brightness setting', 'SPI-ish wiring checklist'],
    commonMistakes: ['Powering from a fragile breadboard rail under high brightness'],
    debugging: ['Lower intensity first', 'Confirm DIN/CS/CLK order'],
    challenge: 'Scroll a 5×7 glyph across the matrix.',
    miniProject: 'Heartbeat animation tied to a button press.',
    quiz: [
      q(
        'mx-1',
        'Why do matrix drivers scan rows/columns quickly?',
        [
          { id: 'a', label: 'To light many LEDs with limited pins while appearing steady', correct: true },
          { id: 'b', label: 'To generate USB signaling' },
          { id: 'c', label: 'To charge a 9V battery' },
        ],
        'Scanning plus persistence creates a full image.',
      ),
    ],
  }),
  defineLesson({
    number: 13,
    slug: 'real-time-clocks',
    title: 'Real-Time Clocks',
    objective: 'Keep wall-clock time with a DS1302 module and read time registers from firmware.',
    prerequisites: ['led-matrices'],
    requiredHardware: ['ds1302', 'atmega328p-arduino-compatible', 'lcd1602'],
    safety: ['Insert backup coin cells with correct polarity if present.'],
    theory:
      'An RTC maintains time using a crystal and low-power circuitry, optionally with battery backup, so time survives MCU resets.',
    visualExplanation:
      'MCU sets/reads registers over a simple serial bus (CLK/DAT/RST for DS1302).',
    wiring: 'Match silk screen for VCC/GND/CLK/DAT/RST. Do not guess pin order.',
    prediction: 'Without setting the clock once, values may be nonsensical until initialized.',
    firmware: `// Use a DS1302 library. Concept:
// rtc.setTime(...); then periodically rtc.getTime() and print/display.`,
    codeWalkthrough:
      'Initialization writes timebase registers. Ongoing reads should be paced; display formatting is separate from timekeeping.',
    physicalExperiment: 'Set time, unplug USB briefly (with backup battery if available), confirm time continuity.',
    expectedResult: 'Time advances; backup behavior matches your hardware options.',
    measurements: ['Drift over 10 minutes vs phone clock', 'Pin continuity checklist'],
    commonMistakes: ['Wrong CE/RST pin', 'Missing crystal on a bare IC breakout (module usually includes it)'],
    debugging: ['Read status/write-protect bits per datasheet/library'],
    challenge: 'Trigger an LED alarm at a chosen HH:MM.',
    miniProject: 'LCD clock using DS1302 as source of truth.',
    quiz: [
      q(
        'rtc-1',
        'Primary purpose of an RTC module in embedded labs is:',
        [
          { id: 'a', label: 'Maintain time across resets/power loss (with backup)', correct: true },
          { id: 'b', label: 'Amplify audio' },
          { id: 'c', label: 'Replace the USB cable' },
        ],
        'RTCs are timekeepers.',
      ),
    ],
  }),
  defineLesson({
    number: 14,
    slug: 'servo-motors',
    title: 'Servo Motors',
    objective: 'Command an SG90 servo angle with PWM pulses while managing supply current.',
    prerequisites: ['real-time-clocks'],
    requiredHardware: ['sg90-servo', 'atmega328p-arduino-compatible', 'joystick'],
    safety: [
      'Servos can stall and draw large current — use an adequate 5V supply and common ground.',
      'Do not force the horn against hard stops.',
    ],
    theory:
      'Hobby servos interpret pulse width (often ~1–2ms within a ~20ms frame) as target angle. The internal controller closes the loop to that angle.',
    visualExplanation:
      'Control wire carries pulses; red/black (colors vary) carry power/ground. Pulse width maps to angle.',
    wiring: 'Signal to D9, VCC to 5V capable supply, GND common with MCU. Optionally joystick VRx to A0.',
    prediction: 'Powering a stalling servo only from a weak USB port may reset the MCU.',
    firmware: `#include <Servo.h>
Servo servo;
void setup() {
  servo.attach(9);
}
void loop() {
  int raw = analogRead(A0);
  int angle = map(raw, 0, 1023, 0, 180);
  servo.write(angle);
  delay(15);
}`,
    codeWalkthrough:
      'Servo library generates the control pulses. map converts joystick ADC to angle. delay gives the servo time to move.',
    physicalExperiment: 'Sweep slowly with the joystick. Listen/feel for stalls near endpoints.',
    expectedResult: 'Smooth tracking without MCU brown-out resets.',
    measurements: ['Supply voltage during motion', 'Endpoint angles'],
    commonMistakes: ['Missing common ground', 'Driving servo from 3.3V-only rails incorrectly'],
    debugging: ['Power servo separately with common GND', 'Print commanded angles'],
    challenge: 'Add software end stops to avoid mechanical binding.',
    miniProject: 'Two-axis pointer with joystick (one axis first).',
    quiz: [
      q(
        'servo-1',
        'A hobby servo’s control signal typically encodes angle via:',
        [
          { id: 'a', label: 'Pulse width', correct: true },
          { id: 'b', label: 'Ethernet packets' },
          { id: 'c', label: 'Mains phase only' },
        ],
        'Pulse width maps to target angle.',
      ),
    ],
  }),
] as const
