import type { HardwareComponent } from '@/types/hardware'

export const IDENTIFICATION_COMPONENTS: readonly HardwareComponent[] = [
  {
    id: 'hw-rc522',
    slug: 'rc522',
    name: 'RC522 RFID module',
    category: 'identification',
    description: '13.56 MHz RFID reader/writer module based on the MFRC522, typically SPI-connected.',
    difficulty: 'intermediate',
    operatingVoltage: 'Typically 3.3V (many modules are 3.3V logic — verify revision)',
    logicVoltage: 'Often 3.3V; level shifting may be required with 5V MCU pins (revision-dependent)',
    interfaces: ['spi', 'digital'],
    pins: [
      { id: 'sda', name: 'SDA/SS', type: 'spi', description: 'SPI chip select' },
      { id: 'sck', name: 'SCK', type: 'spi', description: 'SPI clock' },
      { id: 'mosi', name: 'MOSI', type: 'spi', description: 'SPI master-out' },
      { id: 'miso', name: 'MISO', type: 'spi', description: 'SPI master-in' },
      { id: 'irq', name: 'IRQ', type: 'digital', description: 'Optional interrupt (may be unused)' },
      { id: 'gnd', name: 'GND', type: 'ground', description: 'Ground' },
      { id: 'rst', name: 'RST', type: 'digital', description: 'Reset' },
      { id: '3v3', name: '3.3V', type: 'power', description: 'Module supply', voltage: '3.3V typical' },
    ],
    operatingPrinciple:
      'The module generates an RF field, communicates with nearby ISO14443 tags, and exchanges data with the MCU over SPI.',
    useCases: ['Access control', 'Attendance tokens', 'Asset identification demos'],
    safety: [
      'Do not feed 5V into a 3.3V-only RC522 supply pin.',
      'Confirm whether your board needs level shifting on SPI lines.',
    ],
    relatedLessons: ['rfid'],
    relatedProjects: ['rfid-reader', 'rfid-access-terminal'],
  },
  {
    id: 'hw-rfid-tag',
    slug: 'rfid-card-tag',
    name: 'RFID card/tag',
    category: 'identification',
    description: 'Passive 13.56 MHz RFID credential (card or keyfob) for RC522 labs.',
    difficulty: 'beginner',
    operatingVoltage: 'Passive (powered by reader field)',
    logicVoltage: 'N/A',
    interfaces: ['spi'],
    pins: [
      { id: 'coil', name: 'Antenna coil', type: 'other', description: 'Internal antenna couples to the reader field' },
    ],
    operatingPrinciple: 'The tag harvests energy from the reader field and returns its UID / memory contents per protocol.',
    useCases: ['Badge simulation', 'Allow-list experiments', 'UID logging'],
    safety: ['Do not bend or puncture laminated cards.', 'Keep away from strong magnets that can damage some card types.'],
    relatedLessons: ['rfid'],
    relatedProjects: ['rfid-reader', 'rfid-access-terminal'],
  },
] as const
