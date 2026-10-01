import { defineLesson, q } from './helpers'

export const ADVANCED_LESSONS = [
  defineLesson({
    number: 15,
    slug: 'stepper-motors',
    title: 'Stepper Motors',
    objective: 'Drive a 5V stepper through a ULN2003 using sequenced phase patterns.',
    prerequisites: ['servo-motors'],
    requiredHardware: ['stepper-5v', 'uln2003', 'atmega328p-arduino-compatible'],
    safety: [
      'Do not drive stepper coils directly from MCU pins — use the ULN2003 (or equivalent).',
      'Provide a stiff 5V motor supply.',
    ],
    theory:
      'Steppers move in discrete steps by energizing coils in sequence. Open-loop position is the count of steps issued, assuming no missed steps under load.',
    visualExplanation:
      'MCU outputs IN1–IN4 patterns; the driver switches coil current; the rotor advances one step per valid sequence transition.',
    wiring: 'Motor connector fully seated on ULN2003 board. IN1–IN4 to D8–D11. Board VCC/GND to adequate 5V/GND.',
    prediction: 'Wrong sequence order vibrates or reverses unexpectedly.',
    firmware: `#include <Stepper.h>
const int STEPS = 2048; // revision-dependent gearing; measure empirically
Stepper stepper(STEPS, 8, 10, 9, 11);

void setup() {
  stepper.setSpeed(10);
}

void loop() {
  stepper.step(STEPS / 4);
  delay(500);
}`,
    codeWalkthrough:
      'Pin order must match the driver/motor pairing. Step counts per revolution vary by gear train — calibrate.',
    physicalExperiment: 'Command quarter-turns and mark the shaft to verify step count assumptions.',
    expectedResult: 'Repeatable rotation without MCU resets.',
    measurements: ['Steps per revolution estimate', 'Supply voltage under load'],
    commonMistakes: ['Incorrect IN pin order', 'Shared weak USB power only'],
    debugging: ['Reduce speed', 'Verify driver LEDs if present'],
    challenge: 'Implement acceleration ramping conceptually to reduce missed steps.',
    miniProject: 'Turntable that stops at 0/90/180/270 via button.',
    quiz: [
      q(
        'step-1',
        'Why is a ULN2003 used with many 5V unipolar steppers?',
        [
          { id: 'a', label: 'To switch coil current beyond safe GPIO limits', correct: true },
          { id: 'b', label: 'To generate Wi-Fi' },
          { id: 'c', label: 'To measure humidity' },
        ],
        'Drivers handle coil current and inductive energy.',
      ),
    ],
  }),
  defineLesson({
    number: 16,
    slug: 'infrared-communication',
    title: 'Infrared Communication',
    objective: 'Decode IR remote button codes with a receiver module and map them to actions.',
    prerequisites: ['stepper-motors'],
    requiredHardware: ['infrared-receiver', 'infrared-remote', 'atmega328p-arduino-compatible', 'led-red'],
    safety: ['Verify IR receiver pin order — clones differ.', 'Use correct battery polarity in the remote.'],
    theory:
      'Remotes modulate an IR carrier with coded bursts. Receivers demodulate to a digital waveform; libraries decode protocols (often NEC-like, but not guaranteed).',
    visualExplanation:
      'Remote LED → optical path → demodulator OUT → MCU interrupt/timer decode.',
    wiring: 'Receiver OUT to D2, VCC/GND correct for module. LED indicator on D8 optional.',
    prediction: 'Ambient fluorescent light can add noise; aiming and distance matter.',
    firmware: `// Use an IR remote library matched to your receiver.
// On decode success: Serial.println(code); digitalWrite(LED, toggle);`,
    codeWalkthrough:
      'Treat codes as opaque IDs until you map them. Always print raw codes before assigning behaviors.',
    physicalExperiment: 'Press each remote button, log codes, then map one code to toggle an LED.',
    expectedResult: 'Stable unique codes per button (within protocol repeat rules).',
    measurements: ['Code list table', 'Max reliable distance in your room'],
    commonMistakes: ['Wrong VS1838-style pinout', 'Blocking loop too slow to catch signals'],
    debugging: ['Confirm OUT pulses with a scope/logic LED', 'Replace remote batteries'],
    challenge: 'Ignore repeat codes so one press yields one edge action.',
    miniProject: 'IR-controlled LED brightness steps.',
    quiz: [
      q(
        'ir-1',
        'An IR receiver module output is typically:',
        [
          { id: 'a', label: 'A demodulated digital waveform for the MCU to decode', correct: true },
          { id: 'b', label: 'Raw 240V AC' },
          { id: 'c', label: 'I2C EEPROM contents only' },
        ],
        'The module demodulates the carrier to a digital signal.',
      ),
    ],
  }),
  defineLesson({
    number: 17,
    slug: 'rfid',
    title: 'RFID',
    objective: 'Read RFID tag UIDs with an RC522 over SPI and build an allow-list decision.',
    prerequisites: ['infrared-communication'],
    requiredHardware: ['rc522', 'rfid-card-tag', 'atmega328p-arduino-compatible'],
    safety: [
      'Many RC522 modules are 3.3V devices — do not feed 5V into a 3.3V-only supply pin.',
      'Confirm whether level shifting is required for SPI lines.',
    ],
    theory:
      'The RC522 generates a 13.56MHz field, converses with nearby tags, and exposes results to the MCU over SPI. UIDs identify credentials for educational access-control demos.',
    visualExplanation:
      'SPI: SS/SCK/MOSI/MISO (+RST). Tag enters field → anticollision → UID read.',
    wiring: 'Power carefully at 3.3V if required. Connect SPI pins to the MCU’s SPI-capable pins per your board.',
    prediction: '5V into a 3.3V-only module can permanently damage it.',
    firmware: `// Use MFRC522 library. On new card:
// read UID bytes, print hex, compare to allow-list.`,
    codeWalkthrough:
      'Initialize SPI and the driver, poll for new cards, read UID, then decide. Keep secrets out of public repos if you ever go beyond toys.',
    physicalExperiment: 'Log UIDs for card and keyfob. Grant LED ON only for one UID.',
    expectedResult: 'Consistent UID hex strings; allow-list toggles an indicator.',
    measurements: ['UID bytes', 'Read range roughly in cm'],
    commonMistakes: ['Wrong SS pin', 'Missing common ground', '5V supply mistake'],
    debugging: ['Run library self-check dump', 'Verify 3.3V rail'],
    challenge: 'Add a deny list and a cooldown timer after rejects.',
    miniProject: 'Serial “ACCESS GRANTED/DENIED” terminal.',
    quiz: [
      q(
        'rfid-1',
        'RC522 commonly talks to the MCU using:',
        [
          { id: 'a', label: 'SPI', correct: true },
          { id: 'b', label: 'HDMI' },
          { id: 'c', label: 'Mains PLC only' },
        ],
        'SPI is the typical MCU interface for RC522 modules.',
      ),
    ],
  }),
  defineLesson({
    number: 18,
    slug: 'relays',
    title: 'Relays',
    objective: 'Switch a low-voltage load with a 5V relay module while respecting coil vs contact isolation.',
    prerequisites: ['rfid'],
    requiredHardware: ['relay-5v', 'atmega328p-arduino-compatible', 'led-red', 'resistor-220'],
    safety: [
      'Do not switch mains on a breadboard in this curriculum.',
      'Keep coil-side and contact-side mentally and physically organized.',
    ],
    theory:
      'A relay uses a coil to move contacts. The control side and load side can be isolated. Modules often include a transistor driver and flyback diode for the coil.',
    visualExplanation:
      'IN pin energizes coil path; COM/NO/NC switch the load circuit separately.',
    wiring: 'Module VCC/GND/IN to MCU. Use NO/COM to switch a separate low-voltage LED circuit as a safe load demo.',
    prediction: 'Active-low vs active-high IN logic differs by module — reading silk/docs matters.',
    firmware: `const int RELAY = 7;
void setup() {
  pinMode(RELAY, OUTPUT);
  digitalWrite(RELAY, LOW);
}
void loop() {
  digitalWrite(RELAY, HIGH);
  delay(1000);
  digitalWrite(RELAY, LOW);
  delay(1000);
}`,
    codeWalkthrough:
      'Treat IN polarity as empirically verified. Click sound confirms coil actuation; load side must be wired to see switched power.',
    physicalExperiment: 'Listen for clicks; confirm the low-voltage load circuit energizes only when expected.',
    expectedResult: 'Predictable click + load state without MCU resets.',
    measurements: ['Coil supply current', 'Contact voltage on the safe low-voltage demo load'],
    commonMistakes: ['Assuming IN polarity', 'Sharing flaky grounds across noisy loads'],
    debugging: ['Drive IN manually with known HIGH/LOW', 'Verify module jumper settings if present'],
    challenge: 'Combine RFID allow-list to energize the relay for 3 seconds.',
    miniProject: 'Access-control demo with LED “door” load (low voltage only).',
    quiz: [
      q(
        'rel-1',
        'COM/NO/NC pins belong to which part of the relay?',
        [
          { id: 'a', label: 'The contact/load side', correct: true },
          { id: 'b', label: 'The USB PHY' },
          { id: 'c', label: 'The crystal oscillator only' },
        ],
        'Those terminals are switched contacts.',
      ),
    ],
  }),
  defineLesson({
    number: 19,
    slug: 'embedded-system-integration',
    title: 'Embedded System Integration',
    objective: 'Combine sensor input, decision logic, and dual outputs into one coherent firmware architecture.',
    prerequisites: ['relays'],
    requiredHardware: ['dht11', 'lcd1602', 'led-red', 'buzzer-active', 'atmega328p-arduino-compatible'],
    safety: ['Integrate power budgeting: buzzers+backlights+sensors can stress weak supplies.'],
    theory:
      'Integration is about interfaces and timing: read inputs, update a small state model, drive outputs, and fail safe when sensors error. Avoid spaghetti loops without structure.',
    visualExplanation:
      'Block diagram: sensors → state → outputs (LCD/LED/buzzer). Each arrow is a typed interface you can test.',
    wiring: 'Reuse known-good DHT + LCD wiring. Add LED and active buzzer on free GPIOs with proper drive assumptions.',
    prediction: 'If you block for 2s on DHT delay, UI feels laggy — structure timing deliberately.',
    firmware: `// Structure:
// readSensors() -> updateState() -> renderOutputs()
// Keep each function testable and side-effect clear.`,
    codeWalkthrough:
      'Separate acquisition, decision, and rendering. Propagate sensor failures as first-class states rather than silent zeros.',
    physicalExperiment: 'Build a threshold alarm: high humidity lights LED and buzzes briefly while LCD shows values.',
    expectedResult: 'Coherent behavior under normal and failed sensor reads.',
    measurements: ['Loop timing', 'Supply voltage under alarm'],
    commonMistakes: ['Nested delays everywhere', 'No error state on NaN reads'],
    debugging: ['Stub sensors with Serial-entered values', 'Disable buzzer while validating logic'],
    challenge: 'Add hysteresis and a mute button.',
    miniProject: 'Desktop “environment sentry” with LCD + alarm.',
    quiz: [
      q(
        'int-1',
        'A robust integration pattern is:',
        [
          { id: 'a', label: 'Read → update state → render outputs', correct: true },
          { id: 'b', label: 'Random GPIO toggling without state' },
          { id: 'c', label: 'Ignoring sensor failures' },
        ],
        'Explicit state keeps systems debuggable.',
      ),
    ],
  }),
  defineLesson({
    number: 20,
    slug: 'robotics-fundamentals',
    title: 'Robotics Fundamentals',
    objective: 'Describe differential drive basics and safe motor control interfaces for kit-level robots.',
    prerequisites: ['embedded-system-integration'],
    requiredHardware: ['sg90-servo', 'uln2003', 'stepper-5v', 'joystick', 'atmega328p-arduino-compatible'],
    safety: [
      'Motors need adequate power and common grounds.',
      'Lift wheels during first bring-up to avoid runaway motion.',
    ],
    theory:
      'Differential drive combines left/right speeds into translation and rotation. Embedded robots need sensing, actuation, and a control loop rate matched to mechanical response.',
    visualExplanation:
      'Joystick → command velocities → motor drivers → motion. Sensors close the loop later (encoders/IR/etc.).',
    wiring: 'Bench-test actuators individually before mounting. Keep motor supply separate if it brown-outs the MCU.',
    prediction: 'Open-loop joystick mapping will drift; expect to iterate deadzones.',
    firmware: `// Map joystick to left/right commands with deadzone.
// Start with servos or steppers you already know before adding a chassis.`,
    codeWalkthrough:
      'Deadzones prevent creep. Saturate commands. Log commanded values before connecting wheels to the floor.',
    physicalExperiment: 'Create a “pose” demo: joystick controls a servo “heading” while Serial shows computed left/right magnitudes.',
    expectedResult: 'Stable neutral stick position; predictable left/right signs.',
    measurements: ['Deadzone width', 'Command update rate'],
    commonMistakes: ['No deadzone', 'Motor power through MCU USB only'],
    debugging: ['Test one actuator channel at a time'],
    challenge: 'Add a software E-stop input that zeros all motion commands.',
    miniProject: 'Document a bring-up checklist for a two-wheel platform (even if chassis is future hardware).',
    quiz: [
      q(
        'rob-1',
        'Differential drive steering primarily varies:',
        [
          { id: 'a', label: 'Relative left/right wheel speeds', correct: true },
          { id: 'b', label: 'Only LCD contrast' },
          { id: 'c', label: 'RFID UID length' },
        ],
        'Turning comes from wheel speed difference.',
      ),
    ],
  }),
  defineLesson({
    number: 21,
    slug: 'esp32-and-iot',
    title: 'ESP32 and IoT',
    objective: 'Explain how ESP32-class devices extend Arduino-class labs into Wi-Fi IoT patterns without abandoning safety and architecture discipline.',
    prerequisites: ['robotics-fundamentals'],
    requiredHardware: ['atmega328p-arduino-compatible', 'dht11', 'lcd1602'],
    safety: [
      'When you move to ESP32 hardware, confirm 3.3V logic levels before reusing 5V-only modules.',
      'Do not hard-code production secrets into firmware you publish.',
    ],
    theory:
      'ESP32-class SoCs add radios and more compute. IoT systems still need sensing, local state, and careful power/security. Start with local serial prototypes, then add network transport as a layer.',
    visualExplanation:
      'Device → local sensors/actuators → optional cloud/API. Fail safe when the network is absent.',
    wiring:
      'This lesson remains conceptual on the ATmega kit: prototype sensor+display locally. When ESP32 hardware is available, re-check every module’s voltage.',
    prediction:
      'Copy-pasting 5V Arduino wiring onto a 3.3V ESP32 without level/power review will damage parts.',
    firmware: `// On ATmega kit: keep a local DHT+LCD monitor.
// On ESP32 (when available): publish the same state struct over Wi-Fi using a maintained client library.`,
    codeWalkthrough:
      'Keep a pure state struct independent of transport. Serial, LCD, and Wi-Fi become renderers/transports over the same model.',
    physicalExperiment:
      'Implement the local monitor now. Write a short design note describing what would change on ESP32 (pins, voltage, secrets, reconnect policy).',
    expectedResult: 'Working local monitor + a concrete IoT migration checklist.',
    measurements: ['Local sample period', 'Checklist completeness (voltage, secrets, offline mode)'],
    commonMistakes: ['Network code entangled with sensing', 'Ignoring offline behavior'],
    debugging: ['Prove sensors work offline first', 'Add logging around reconnect states later'],
    challenge: 'Specify an offline mode that still alarms locally when humidity exceeds a threshold.',
    miniProject: 'Architecture one-pager: state model, transports, and safety gates for an ESP32 port.',
    quiz: [
      q(
        'iot-1',
        'Before moving modules from a 5V Arduino-class board to ESP32, you should:',
        [
          { id: 'a', label: 'Re-check voltage/logic compatibility', correct: true },
          { id: 'b', label: 'Assume all 5V wiring is identical' },
          { id: 'c', label: 'Remove all grounds' },
        ],
        'ESP32 is typically 3.3V logic; compatibility must be verified.',
      ),
    ],
  }),
] as const
