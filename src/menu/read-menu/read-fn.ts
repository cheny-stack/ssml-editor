import { SlateTransforms, SlateRange, type IDomEditor } from '@wangeditor/editor'
import { WANGEDITOR_EVENT } from '@/constant'
import BaseFn from '../base-fn'
import type { Prosody } from '@/core'
import { readValueMap, type ReadLabelValue } from './data'

export class ReadFn extends BaseFn {
  public constructor(editor: IDomEditor) {
    super(editor)
  }

  public isDisabled(): boolean {
    if (super.isDisabled()) return true
    const { selection } = this.editor
    if (!selection) return true
    if (selection == null) return true
    if (SlateRange.isCollapsed(selection)) {
      this.editor.emit(WANGEDITOR_EVENT.ERROR, '请先选择文本')
      return true
    }

    return false
  }

  exec(opt: ReadLabelValue) {
    this.editor.restoreSelection()
    if (this.isDisabled()) return
    const value = this.getValue()
    if (value == null) return

    const { pitch, rate } = readValueMap[opt.value]
    const node: Prosody = {
      type: 'ssml-prosody',
      remark: opt.label,
      pitch,
      rate,
      children: [{ text: value }],
    }

    SlateTransforms.insertNodes(this.editor, node)
  }
}
