export type HandoutKind = 'lesson' | 'project'

export interface HandoutListItem {
  readonly text: string
  readonly lines?: number
}

export interface HandoutSection {
  readonly id: string
  readonly title: string
  readonly body?: string
  readonly items?: readonly HandoutListItem[]
  readonly avoidPageBreak?: boolean
}

export interface HandoutSheet {
  readonly kind: HandoutKind
  readonly slug: string
  readonly numberLabel: string
  readonly title: string
  readonly subtitle: string
  readonly sections: readonly HandoutSection[]
}
