import { bom, defineProject, step } from './helpers'

export const DISPLAY_PROJECTS = [
  defineProject({
    number: 11,
    slug: 'seven-segment-counter',
    title: 'Seven Segment Counter',
    category: 'displays',
    difficulty: 'intermediate',
    objective: 'Count 0–9 on a single seven-segment digit with correct common polarity and resistors.',
    prerequisites: ['seven-segment-displays', 'leds-and-resistors'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-sevseg-1', 1), bom('hw-resistor-220', 8)],
    firmware: `// Segment map depends on common-anode vs cathode — adjust HIGH/LOW sense.
const uint8_t DIGITS[10] = {
  B00111111,B00000110,B01011011,B01001111,B01100110,
  B01101101,B01111101,B00000111,B01111111,B01101111
};
const int SEGS[7] = {2,3,4,5,6,7,8};
void show(uint8_t v) {
  for (int i=0;i<7;i++) digitalWrite(SEGS[i], bitRead(DIGITS[v], i) ? HIGH : LOW);
}
void setup(){ for(int s:SEGS) pinMode(s,OUTPUT); }
void loop(){ for(int d=0;d<10;d++){ show(d); delay(400);} }`,
    explanation:
      'Digits are bit patterns across segments a–g. Polarity of the common terminal flips the drive sense. Always current-limit segments.',
    constructionSteps: [
      step('1', 'Identify common', 'Determine common-anode vs cathode.'),
      step('2', 'Wire segments', 'a–g via resistors to GPIO; common to rail.'),
      step('3', 'Count', 'Upload and verify glyphs 0–9.'),
    ],
    testing: ['Readable 0–9', 'No segment overheating'],
    debugging: ['Garbage glyphs ⇒ polarity/bit order', 'Dim/hot ⇒ resistor mistakes'],
    extensions: ['Use 74HC595', 'Button to increment'],
    safety: ['Series resistors on segments'],
  }),
  defineProject({
    number: 12,
    slug: 'stopwatch',
    title: 'Stopwatch',
    category: 'displays',
    difficulty: 'intermediate',
    objective: 'Build a button-controlled stopwatch displayed on a 4-digit seven-segment module.',
    prerequisites: ['seven-segment-displays', 'buttons-and-digital-input'],
    bom: [
      bom('hw-atmega328p-uno', 1),
      bom('hw-sevseg-4', 1),
      bom('hw-push-button', 2),
      bom('hw-resistor-220', 1, 'As required by module'),
    ],
    firmware: `// Prefer a multiplexed display library matched to your 4-digit module.
// Maintain elapsed millis; start/stop/reset via buttons with debounce.`,
    explanation:
      'Timekeeping uses millis(). The display multiplexes digits quickly. Separate UI state (running/paused) from rendering.',
    constructionSteps: [
      step('1', 'Display', 'Wire the 4-digit module per its common/driver needs.'),
      step('2', 'Buttons', 'Start/stop and reset with pull-ups.'),
      step('3', 'Validate', 'Compare against a phone stopwatch over 30s.'),
    ],
    testing: ['Start/stop works', 'Reset clears', 'Drift acceptable for lab use'],
    debugging: ['Flicker ⇒ refresh too slow', 'Buttons bounce ⇒ debounce'],
    extensions: ['Lap capture', 'LCD alternative'],
    safety: ['Current-limit LED segments/drivers'],
  }),
  defineProject({
    number: 13,
    slug: 'lcd-environmental-monitor',
    title: 'LCD Environmental Monitor',
    category: 'displays',
    difficulty: 'intermediate',
    objective: 'Show DHT11 readings on an LCD1602.',
    prerequisites: ['lcd-displays', 'environmental-sensors'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-dht11', 1), bom('hw-lcd1602', 1)],
    circuitId: 'lcd',
    firmware: `// Combine DHT read + LiquidCrystal_I2C print on two lines.
// Handle NaN by showing "ERR" rather than blanking silently.`,
    explanation:
      'Separate sensor acquisition from UI render. LCD contrast/address issues look like software bugs — verify hardware first.',
    constructionSteps: [
      step('1', 'LCD I2C', 'Wire backpack; scan address if needed.'),
      step('2', 'DHT', 'Known-good DHT wiring to D4.'),
      step('3', 'Compose UI', 'Line1 temp, line2 humidity.'),
    ],
    testing: ['Readable characters', 'Values update ~2s', 'Error state visible on unplug'],
    debugging: ['Blank LCD ⇒ contrast/address', 'ERR ⇒ DHT wiring'],
    extensions: ['Trend arrows', 'Alarm icon'],
    safety: ['Confirm module voltages'],
  }),
  defineProject({
    number: 14,
    slug: 'digital-clock',
    title: 'Digital Clock',
    category: 'displays',
    difficulty: 'intermediate',
    objective: 'Display wall time from a DS1302 RTC on LCD or seven-segment.',
    prerequisites: ['real-time-clocks', 'lcd-displays'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-ds1302', 1), bom('hw-lcd1602', 1)],
    firmware: `// Set RTC once, then read HH:MM:SS each second and print to LCD.`,
    explanation:
      'RTC keeps time across resets with backup power. Firmware should format time separately from bus I/O.',
    constructionSteps: [
      step('1', 'RTC wiring', 'Match CLK/DAT/RST silk screen.'),
      step('2', 'Set time', 'Initialize once from a trusted clock.'),
      step('3', 'Display', 'Update LCD once per second.'),
    ],
    testing: ['Time advances', 'Survives USB unplug if backup cell present'],
    debugging: ['Nonsensical time ⇒ not initialized', 'Bus fail ⇒ pin order'],
    extensions: ['Alarm LED', '12/24h toggle'],
    safety: ['Correct coin-cell polarity if used'],
  }),
  defineProject({
    number: 15,
    slug: 'led-matrix-animation',
    title: 'LED Matrix Animation',
    category: 'displays',
    difficulty: 'intermediate',
    objective: 'Animate a simple pattern on an 8×8 matrix module.',
    prerequisites: ['led-matrices', 'shift-registers'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-led-matrix-8x8', 1)],
    firmware: `// Use a MAX7219-compatible library if your kit includes a driver board.
// Draw a scanning row, then a bouncing pixel.`,
    explanation:
      'Driver ICs accept serial commands and scan the grid. Keep intensity moderate on USB power.',
    constructionSteps: [
      step('1', 'Identify driver', 'Confirm DIN/CS/CLK module pins.'),
      step('2', 'Power', 'Common GND; adequate 5V.'),
      step('3', 'Animate', 'Upload scanning pattern.'),
    ],
    testing: ['Stable image', 'No MCU resets at moderate intensity'],
    debugging: ['Blank ⇒ CS/wiring', 'Noise ⇒ ground/power'],
    extensions: ['Scroll text', 'Button to change animation'],
    safety: ['Prefer driver board over bare matrix drive'],
  }),
] as const

export const MOTION_PROJECTS = [
  defineProject({
    number: 16,
    slug: 'servo-controller',
    title: 'Servo Controller',
    category: 'motion',
    difficulty: 'beginner',
    objective: 'Sweep an SG90 servo across a safe angle range.',
    prerequisites: ['servo-motors', 'pwm'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-sg90', 1)],
    circuitId: 'servo',
    firmware: `#include <Servo.h>
Servo s;
void setup(){ s.attach(9); }
void loop(){
  for(int a=20;a<=160;a++){ s.write(a); delay(15); }
  for(int a=160;a>=20;a--){ s.write(a); delay(15); }
}`,
    explanation:
      'Servo pulse width maps to angle. Avoid mechanical end-stop stalls. USB may brown out under load — use a stiff 5V supply with common ground if needed.',
    constructionSteps: [
      step('1', 'Signal', 'SIG to D9; VCC/GND powered carefully.'),
      step('2', 'Clearance', 'Ensure horn can move freely.'),
      step('3', 'Sweep', 'Upload limited-range sweep.'),
    ],
    testing: ['Smooth motion', 'No resets', 'No grinding at ends'],
    debugging: ['Jitter ⇒ power/ground', 'No move ⇒ signal pin'],
    extensions: ['Serial angle command', 'Soft start'],
    safety: ['Do not force stalls', 'Mind supply current'],
  }),
  defineProject({
    number: 17,
    slug: 'joystick-servo',
    title: 'Joystick Servo',
    category: 'motion',
    difficulty: 'beginner',
    objective: 'Aim a servo from a joystick axis with deadzone.',
    prerequisites: ['servo-motors', 'potentiometers'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-joystick', 1), bom('hw-sg90', 1)],
    firmware: `#include <Servo.h>
Servo s;
void setup(){ s.attach(9); }
void loop(){
  int raw = analogRead(A0);
  if (abs(raw-512)<30) raw=512; // deadzone
  s.write(map(raw,0,1023,20,160));
  delay(15);
}`,
    explanation:
      'Joystick pots feed ADC. A deadzone stops creep near center. Clamp angles away from hard stops.',
    constructionSteps: [
      step('1', 'Joystick', 'VRX to A0; power/GND.'),
      step('2', 'Servo', 'As in Servo Controller.'),
      step('3', 'Tune deadzone', 'Adjust until stick center is stable.'),
    ],
    testing: ['Center stable', 'Left/right map correctly'],
    debugging: ['Drift ⇒ enlarge deadzone', 'Axis swapped ⇒ VRX/VRY'],
    extensions: ['Second axis / second servo', 'SW button preset'],
    safety: ['Adequate servo power', 'Common ground'],
  }),
  defineProject({
    number: 18,
    slug: 'stepper-turntable',
    title: 'Stepper Turntable',
    category: 'motion',
    difficulty: 'intermediate',
    objective: 'Rotate a 5V stepper to fixed angles using a ULN2003 driver.',
    prerequisites: ['stepper-motors'],
    bom: [bom('hw-atmega328p-uno', 1), bom('hw-stepper-5v', 1), bom('hw-uln2003', 1)],
    circuitId: 'stepper-uln2003',
    firmware: `#include <Stepper.h>
const int STEPS=2048; // calibrate for your gear train
Stepper st(STEPS,8,10,9,11);
void setup(){ st.setSpeed(8); }
void loop(){ st.step(STEPS/4); delay(500); }`,
    explanation:
      'Phase sequencing through ULN2003 moves the rotor in steps. Calibrate steps/revolution empirically.',
    constructionSteps: [
      step('1', 'Driver', 'Seat motor connector; IN1–IN4 to GPIO.'),
      step('2', 'Power', 'Motor supply on driver VCC with common GND.'),
      step('3', 'Quarter turns', 'Mark shaft and verify.'),
    ],
    testing: ['Repeatable 90° moves', 'No MCU brown-out'],
    debugging: ['Vibrate only ⇒ pin order', 'Missed steps ⇒ speed/power'],
    extensions: ['Button index positions', 'Acceleration ramp'],
    safety: ['Never drive coils from MCU pins directly'],
  }),
] as const
