import { LabPanel, SectionTitle } from '@/components/ui/LabPanel'
import { currentBridgeMode } from '@/features/maoLab/domain/protocol'

export function MaoFirmwarePage() {
  const mode = currentBridgeMode()

  return (
    <div className="space-y-4">
      <LabPanel className="space-y-2">
        <SectionTitle>Bridge status</SectionTitle>
        <p className="font-mono-tech text-sm">{mode}</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          The browser does not open USB serial. A future local Mac bridge will publish board detect,
          flash/SRAM, and telemetry. Until then this panel stays in simulation.
        </p>
      </LabPanel>

      <LabPanel className="space-y-3">
        <SectionTitle>Arduino CLI (host)</SectionTitle>
        <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)] p-3 font-mono-tech text-[11px] whitespace-pre-wrap">{`cd ~/Projects/mao-mark-i
./tools/detect-board.sh
./tools/build.sh heartbeat
./tools/upload.sh heartbeat
./tools/build.sh external_led
# upload external_led only after M2 power photo OK`}</pre>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">FQBN</dt>
            <dd className="font-mono-tech">arduino:avr:uno</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Last known host sizes</dt>
            <dd className="font-mono-tech text-xs">heartbeat 924 flash / 9 SRAM · external_led 862 / 14</dd>
          </div>
        </dl>
      </LabPanel>

      <LabPanel className="space-y-2">
        <SectionTitle>Protocol (MAO/1)</SectionTitle>
        <p className="text-sm text-[var(--color-text-muted)]">Telemetry examples (host ← board):</p>
        <pre className="font-mono-tech text-[11px] whitespace-pre-wrap">{`MAO/1 HELLO fw=0.1.x board=uno
MAO/1 HEARTBEAT uptime_ms=12000
MAO/1 STATE IDLE
MAO/1 TEMP 28.4
MAO/1 HUM 70
MAO/1 LIGHT 530
MAO/1 SOUND 1
MAO/1 HEAD 90`}</pre>
        <p className="text-sm text-[var(--color-text-muted)]">Commands (host → board):</p>
        <pre className="font-mono-tech text-[11px] whitespace-pre-wrap">{`MAO/1 FACE HAPPY
MAO/1 HEAD 100
MAO/1 BEEP 1
MAO/1 PING`}</pre>
      </LabPanel>
    </div>
  )
}
