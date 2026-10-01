import { defineLesson, q } from './helpers'

export const FUNDAMENTALS_LESSONS = [
  defineLesson({
    number: 0,
    slug: 'electronics-fundamentals',
    title: 'Electronics Fundamentals',
    objective:
      'Explain voltage, current, resistance, and polarity well enough to wire low-voltage kit circuits safely.',
    prerequisites: [],
    requiredHardware: ['atmega328p-arduino-compatible', 'usb-cable', 'breadboard-830'],
    safety: [
      'Stay on low-voltage DC lab supplies (USB/5V class). Never put mains wiring on a breadboard.',
      'Treat polarity as mandatory: reverse supply can destroy modules.',
    ],
    theory:
      'Voltage is electrical potential difference. Current is charge flow. Resistance limits current (Ohm’s law: V = IR). In MCU labs, a shared ground reference is required so signal voltages are meaningful between devices.',
    visualExplanation:
      'Picture a water analogy cautiously: voltage ≈ pressure, current ≈ flow, resistance ≈ pipe constriction. Prefer schematic thinking: a closed loop from supply, through loads, back to ground.',
    wiring:
      'Connect the controller’s 5V and GND to the breadboard rails. Confirm the red rail is positive and the blue/black rail is ground before adding parts.',
    prediction:
      'If GND is missing between the MCU and a module, digital readings become unreliable even if the module appears powered.',
    firmware: `void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println("Lab powered — check rails with a meter if available.");
  delay(1000);
}`,
    codeWalkthrough:
      'This sketch only proves the USB serial path works. Power integrity is physical: firmware cannot fix a missing ground or reversed supply.',
    physicalExperiment:
      'Power the board over USB. Verify 5V rail ≈ 5V relative to GND with a multimeter if you have one. Open Serial Monitor at 9600 baud.',
    expectedResult: 'Serial messages appear. Breadboard rails show correct polarity relative to GND.',
    measurements: [
      'USB VBUS to GND ≈ 5V',
      'Breadboard + rail to − rail matches controller 5V/GND',
    ],
    commonMistakes: [
      'Swapping 5V and GND on a module',
      'Assuming wire color guarantees signal type',
      'Powering motors only from a weak USB port without checking current',
    ],
    debugging: [
      'If Serial is silent, confirm port, baud, and cable data lines.',
      'If a module is hot, disconnect power immediately and check polarity.',
    ],
    challenge:
      'List three failure modes caused by missing common ground and how you would detect each with a meter.',
    miniProject:
      'Create a one-page lab checklist: polarity check, rail continuity, and max expected current for your next build.',
    quiz: [
      q(
        'ef-1',
        'Ohm’s law relates which quantities?',
        [
          { id: 'a', label: 'Voltage, current, and resistance', correct: true },
          { id: 'b', label: 'Only frequency and capacitance' },
          { id: 'c', label: 'Only magnetic field strength' },
        ],
        'V = IR links voltage, current, and resistance.',
      ),
      q(
        'ef-2',
        'Why must modules share ground with the MCU?',
        [
          { id: 'a', label: 'So signal voltages have a common reference', correct: true },
          { id: 'b', label: 'Ground is only decorative' },
          { id: 'c', label: 'USB forbids ground connections' },
        ],
        'Digital/analog levels are measured relative to a shared reference.',
      ),
    ],
  }),
  defineLesson({
    number: 1,
    slug: 'breadboard-fundamentals',
    title: 'Breadboard Fundamentals',
    objective: 'Build reliable temporary circuits by understanding breadboard row/rail connectivity.',
    prerequisites: ['electronics-fundamentals'],
    requiredHardware: ['breadboard-830', 'jumper-wire-set', 'jumpers-male-female'],
    safety: [
      'Never use a breadboard for mains voltages.',
      'Avoid high-current motor paths through tiny breadboard contacts when possible.',
    ],
    theory:
      'An 830-point breadboard groups sockets into conductive strips. Power rails run along the sides. The center channel separates left/right DIP halves. Misunderstanding these groups causes “mysterious” open circuits.',
    visualExplanation:
      'Imagine hidden metal buses under each numbered row group and continuous (or sometimes split) rails along the edges. Always verify continuity when unsure.',
    wiring:
      'Place the MCU beside the board. Run short jumpers from 5V/GND to rails. Keep signal wires short and routed so row numbers stay readable.',
    prediction:
      'A component lead in the wrong row group will look “connected” visually but be electrically isolated.',
    firmware: `// No firmware required for continuity mapping.
// Optional: blink D13 after rails are verified.`,
    codeWalkthrough:
      'Breadboard skill is physical. Firmware comes after you can predict which sockets share a node.',
    physicalExperiment:
      'Map one row group with a continuity tester or by wiring an LED+resistor across adjacent holes within vs across groups.',
    expectedResult: 'You can predict which holes are common before inserting the LED.',
    measurements: ['Continuity within a row group', 'No continuity across the center channel without a jumper'],
    commonMistakes: [
      'Assuming the entire numbered row is one node when using split boards incorrectly',
      'Crowding wires so shorts are invisible',
    ],
    debugging: [
      'Remove extra wires and rebuild the minimal path.',
      'Check whether your board’s power rail is split mid-board.',
    ],
    challenge: 'Sketch your breadboard’s conductive groups from memory, then verify with continuity checks.',
    miniProject: 'Build a tidy 5V/GND rail template you will reuse for later LED lessons.',
    quiz: [
      q(
        'bb-1',
        'What does the center channel on a typical breadboard provide?',
        [
          { id: 'a', label: 'Separation for DIP ICs across two sides', correct: true },
          { id: 'b', label: 'A hidden 9V battery' },
          { id: 'c', label: 'Mains isolation transformer' },
        ],
        'The channel lets ICs straddle disconnected halves.',
      ),
    ],
  }),
  defineLesson({
    number: 2,
    slug: 'leds-and-resistors',
    title: 'LEDs and Resistors',
    objective: 'Drive an LED safely from a GPIO pin using a series current-limiting resistor.',
    prerequisites: ['breadboard-fundamentals'],
    requiredHardware: ['atmega328p-arduino-compatible', 'led-red', 'resistor-220', 'breadboard-830'],
    safety: [
      'Always include a series resistor unless a constant-current driver is present.',
      'Observe LED polarity (anode/cathode).',
    ],
    theory:
      'An LED drops a forward voltage and needs controlled current. From a 5V GPIO, a series resistor sets current roughly by (Vgpio − Vf) / R. Without the resistor, current can spike and damage the LED or pin.',
    visualExplanation:
      'Series loop: GPIO → resistor → LED anode → LED cathode → GND. Current is the same through resistor and LED.',
    wiring:
      'GPIO D8 → 220Ω → LED anode; LED cathode → GND. Confirm cathode (usually shorter lead / flat edge).',
    prediction:
      'If the resistor is omitted, the LED may flash brightly then fail, and the MCU pin may be stressed.',
    firmware: `const int LED_PIN = 8;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`,
    codeWalkthrough:
      'pinMode configures the pin as a driver. digitalWrite asserts HIGH (~VCC) or LOW (GND). Delay creates a visible blink; it is blocking and fine for this first experiment.',
    physicalExperiment: 'Upload the blink sketch. Observe brightness and heating. Measure voltage across the resistor if a meter is available.',
    expectedResult: 'LED blinks about once per second without overheating.',
    measurements: ['Approximate LED forward drop', 'Voltage across the series resistor while ON'],
    commonMistakes: ['LED reversed', 'Resistor shorted by a misplaced jumper', 'Using an I/O pin that is also tied elsewhere'],
    debugging: [
      'If dark: check polarity, pin number, and common ground.',
      'If always on: firmware stuck HIGH or wiring tied to 5V.',
    ],
    challenge: 'Choose a resistor for a green LED assuming Vf≈2.1V and target 10mA from 5V. Show the calculation.',
    miniProject: 'Extend to two LEDs on two pins with independent blink rates using non-blocking later if you wish.',
    quiz: [
      q(
        'led-1',
        'Why is a series resistor used with a GPIO-driven LED?',
        [
          { id: 'a', label: 'To limit current to a safe value', correct: true },
          { id: 'b', label: 'To increase mains voltage' },
          { id: 'c', label: 'To store charge like a battery' },
        ],
        'The resistor sets LED current from the available voltage headroom.',
      ),
    ],
  }),
  defineLesson({
    number: 3,
    slug: 'buttons-and-digital-input',
    title: 'Buttons and Digital Input',
    objective: 'Read a momentary button reliably using a pull resistor and basic debouncing awareness.',
    prerequisites: ['leds-and-resistors'],
    requiredHardware: ['push-button', 'resistor-10k', 'led-green', 'resistor-220', 'atmega328p-arduino-compatible'],
    safety: ['Do not wire a button that can hard-short 5V directly to GND without resistance.'],
    theory:
      'A floating input reads noise. Pull-up or pull-down resistors define the idle logic level. Mechanical switches bounce, producing multiple edges for one press.',
    visualExplanation:
      'Active-low button: pin pulled HIGH by resistor/MCU pull-up; press connects pin to GND.',
    wiring:
      'Button between D2 and GND. Enable INPUT_PULLUP. LED on D8 with 220Ω as before.',
    prediction: 'Without a pull, the LED may flicker randomly as the input floats.',
    firmware: `const int BUTTON_PIN = 2;
const int LED_PIN = 8;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  bool pressed = digitalRead(BUTTON_PIN) == LOW;
  digitalWrite(LED_PIN, pressed ? HIGH : LOW);
}`,
    codeWalkthrough:
      'INPUT_PULLUP enables the internal pull-up. A press reads LOW. The LED mirrors pressed state.',
    physicalExperiment: 'Press and release rapidly. Note bounce qualitatively. Hold firmly and confirm stable ON.',
    expectedResult: 'LED tracks button presses; idle state is OFF with pull-up idle HIGH.',
    measurements: ['Idle pin voltage ≈ VCC', 'Pressed pin voltage ≈ 0V'],
    commonMistakes: ['Using INPUT without pull', 'Wiring button to 5V instead of GND with pull-up logic'],
    debugging: ['If always pressed: short to GND or inverted wiring.', 'If never pressed: wrong pin or open contact.'],
    challenge: 'Add a simple software debounce (ignore changes for 20–50ms) and describe why it helps.',
    miniProject: 'Toggle LED on press edges rather than while held.',
    quiz: [
      q(
        'btn-1',
        'What problem does a pull-up resistor solve for a button input?',
        [
          { id: 'a', label: 'Defines a known idle logic level', correct: true },
          { id: 'b', label: 'Increases LED brightness' },
          { id: 'c', label: 'Converts USB to 9V' },
        ],
        'Pulls prevent floating inputs.',
      ),
    ],
  }),
  defineLesson({
    number: 4,
    slug: 'gpio',
    title: 'GPIO',
    objective: 'Use general-purpose I/O pins as outputs and inputs with explicit pinMode and current awareness.',
    prerequisites: ['buttons-and-digital-input'],
    requiredHardware: ['atmega328p-arduino-compatible', 'led-red', 'led-yellow', 'resistor-220', 'push-button'],
    safety: [
      'Respect per-pin and total MCU current limits.',
      'Do not drive motor coils directly from GPIO.',
    ],
    theory:
      'GPIO pins are configurable digital nodes. As outputs they source/sink current within limits. As inputs they sense logic levels. Alternate functions (PWM, UART, SPI) share the same physical pins.',
    visualExplanation:
      'Think of each pin as a mode switch: High-Z input, driven output, or peripheral function selected by the MCU.',
    wiring: 'Two LEDs on D8/D9 with resistors. Button on D2 with INPUT_PULLUP.',
    prediction: 'Driving too many LEDs without resistors can brown out or stress the MCU.',
    firmware: `const int BTN = 2;
const int LED_A = 8;
const int LED_B = 9;

void setup() {
  pinMode(BTN, INPUT_PULLUP);
  pinMode(LED_A, OUTPUT);
  pinMode(LED_B, OUTPUT);
}

void loop() {
  bool pressed = digitalRead(BTN) == LOW;
  digitalWrite(LED_A, pressed);
  digitalWrite(LED_B, !pressed);
}`,
    codeWalkthrough:
      'One input selects between two mutually exclusive outputs — a pattern used in status indicators and interlocks.',
    physicalExperiment: 'Verify complementary LED states while pressing the button.',
    expectedResult: 'Exactly one LED is on at a time for the pressed/released states shown.',
    measurements: ['GPIO HIGH voltage', 'GPIO LOW voltage', 'LED series current estimate'],
    commonMistakes: ['Forgetting pinMode', 'Reusing a pin that Serial or SPI needs'],
    debugging: ['Print pin states over Serial when behavior mismatches wiring.'],
    challenge: 'Rewrite the sketch to use direct port registers conceptually (explain, do not require AVR asm).',
    miniProject: 'Build a 3-LED status bar driven by two buttons.',
    quiz: [
      q(
        'gpio-1',
        'What does pinMode(..., OUTPUT) enable?',
        [
          { id: 'a', label: 'The pin can drive HIGH/LOW actively', correct: true },
          { id: 'b', label: 'The pin becomes an antenna only' },
          { id: 'c', label: 'The pin disconnects from the MCU' },
        ],
        'OUTPUT configures the pin as a digital driver.',
      ),
    ],
  }),
  defineLesson({
    number: 5,
    slug: 'potentiometers',
    title: 'Potentiometers',
    objective: 'Wire a potentiometer as a voltage divider and interpret the wiper voltage.',
    prerequisites: ['gpio'],
    requiredHardware: ['potentiometer-10k', 'atmega328p-arduino-compatible', 'breadboard-830'],
    safety: ['Do not use a small potentiometer as a high-power motor rheostat.'],
    theory:
      'A potentiometer is a resistive divider with an adjustable tap (wiper). With ends at VCC and GND, the wiper voltage varies between the rails as you turn the shaft.',
    visualExplanation:
      'Three terminals: A to 5V, B to GND, wiper to A0. Turning moves the tap along the track.',
    wiring: 'Potentiometer outer pins to 5V and GND; wiper to A0.',
    prediction: 'If one outer pin is disconnected, the wiper may float or clip to a rail.',
    firmware: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(A0);
  Serial.println(raw);
  delay(100);
}`,
    codeWalkthrough:
      'analogRead returns a quantized count. At this stage we observe raw counts before converting to volts.',
    physicalExperiment: 'Sweep the pot slowly and watch Serial values change smoothly.',
    expectedResult: 'Values move between near 0 and near 1023 on a 10-bit ADC at 5V reference (typical Uno-class).',
    measurements: ['Wiper voltage at min/mid/max', 'Corresponding analogRead values'],
    commonMistakes: ['Swapping wiper with an end terminal', 'Missing GND on the divider'],
    debugging: ['If stuck at 0 or 1023, check end-terminal wiring.'],
    challenge: 'Explain how replacing the pot with an LDR+resistor divider creates a light sensor.',
    miniProject: 'Map pot position to LED blink rate using delay.',
    quiz: [
      q(
        'pot-1',
        'In a pot wired as a divider, what does the wiper provide?',
        [
          { id: 'a', label: 'An adjustable fraction of the supply voltage', correct: true },
          { id: 'b', label: 'A digital bus address' },
          { id: 'c', label: 'AC mains isolation' },
        ],
        'The wiper taps the resistive element.',
      ),
    ],
  }),
  defineLesson({
    number: 6,
    slug: 'analog-to-digital-conversion',
    title: 'Analog-to-Digital Conversion',
    objective: 'Convert ADC counts to voltage and apply threshold logic for sensors.',
    prerequisites: ['potentiometers'],
    requiredHardware: ['potentiometer-10k', 'ldr-5528', 'resistor-10k', 'atmega328p-arduino-compatible'],
    safety: ['Keep analog inputs within 0V..Vref (typically 0..5V on this kit’s MCU class).'],
    theory:
      'An ADC samples an analog voltage and produces an integer count. For a 10-bit ADC with Vref=5V, volts ≈ count * Vref / 1023. Thresholding turns continuous signals into decisions.',
    visualExplanation:
      'Signal → sample/hold → quantization → integer. Noise and reference quality affect usable bits.',
    wiring: 'Keep the pot on A0. Build an LDR divider on A1 with 10k to GND or 5V (document your orientation).',
    prediction: 'Covering the LDR changes A1 counts in the direction your divider orientation implies.',
    firmware: `float toVolts(int raw) {
  return raw * (5.0 / 1023.0);
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(A0);
  Serial.print(raw);
  Serial.print(" counts, ");
  Serial.print(toVolts(raw), 3);
  Serial.println(" V");
  delay(200);
}`,
    codeWalkthrough:
      'Scaling uses Vref and resolution. Printing both counts and volts builds intuition for later sensor calibration.',
    physicalExperiment: 'Compare meter voltage at the wiper with calculated volts from analogRead.',
    expectedResult: 'Calculated voltage tracks the meter within ADC and meter tolerances.',
    measurements: ['Vref assumption check', 'Error between meter and computed volts'],
    commonMistakes: ['Using 1024 vs 1023 inconsistently without understanding', 'Ignoring that AREF/default Vref matters'],
    debugging: ['If conversion is wrong by a factor, check Vref and integer math.'],
    challenge: 'Implement a hysteresis threshold so an LED does not chatter near the trip point.',
    miniProject: 'Night-light decision using LDR divider and hysteresis.',
    quiz: [
      q(
        'adc-1',
        'For a 10-bit ADC with 5V reference, full-scale count is typically:',
        [
          { id: 'a', label: '1023', correct: true },
          { id: 'b', label: '255 only' },
          { id: 'c', label: '8' },
        ],
        '10-bit range is 0..1023.',
      ),
    ],
  }),
  defineLesson({
    number: 7,
    slug: 'pwm',
    title: 'PWM',
    objective: 'Dim an LED using pulse-width modulation and relate duty cycle to average power.',
    prerequisites: ['analog-to-digital-conversion'],
    requiredHardware: ['led-red', 'resistor-220', 'potentiometer-10k', 'atmega328p-arduino-compatible'],
    safety: ['Still use a series resistor with the LED.'],
    theory:
      'PWM switches a pin rapidly between HIGH and LOW. Duty cycle is the fraction of time HIGH. The eye and many loads respond to the average, enabling dimming without a true DAC.',
    visualExplanation:
      'Wide pulses look brighter; narrow pulses look dimmer at a fixed frequency.',
    wiring: 'LED+resistor on D9 (PWM-capable). Pot on A0 to control brightness.',
    prediction: 'analogWrite values near 0 look dim; near 255 look bright (8-bit PWM on classic Arduino API).',
    firmware: `const int LED_PIN = 9;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int raw = analogRead(A0);
  int duty = map(raw, 0, 1023, 0, 255);
  analogWrite(LED_PIN, duty);
}`,
    codeWalkthrough:
      'map scales ADC range into PWM range. analogWrite configures hardware PWM on supported pins.',
    physicalExperiment: 'Sweep the pot and observe brightness. Optionally view the pin on an oscilloscope if available.',
    expectedResult: 'Smooth brightness control without audible fuss for LED dimming.',
    measurements: ['Duty cycle vs perceived brightness', 'ADC value vs analogWrite value'],
    commonMistakes: ['Using a non-PWM pin with analogWrite expecting hardware PWM', 'Omitting the LED resistor'],
    debugging: ['If brightness jumps only on/off, confirm pin PWM capability.'],
    challenge: 'Explain why motor PWM and LED PWM may need different frequencies.',
    miniProject: 'RGB cross-fade using three PWM channels on an RGB module.',
    quiz: [
      q(
        'pwm-1',
        'Duty cycle in PWM means:',
        [
          { id: 'a', label: 'Fraction of time the signal is HIGH', correct: true },
          { id: 'b', label: 'Wire insulation color' },
          { id: 'c', label: 'Battery chemistry only' },
        ],
        'Duty cycle is the HIGH time ratio.',
      ),
    ],
  }),
] as const
