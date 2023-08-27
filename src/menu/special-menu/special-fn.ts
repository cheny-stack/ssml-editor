import { type IDomEditor } from '@wangeditor/editor'
import { SlateTransforms, SlateRange } from '@wangeditor/editor'
import { WANGEDITOR_EVENT } from '@/constant'
import BaseFn from '../base-fn'
import type { LabelValue } from '@/model'
import type { Audio } from '@/core'

// 音效功能
export class SpecialFn extends BaseFn {
  public constructor(editor: IDomEditor) {
    super(editor)
  }

  public restoreSelection() {
    this.editor.restoreSelection()
  }

  public isDisabled(): boolean {
    if (super.isDisabled()) return true
    const { selection } = this.editor
    if (!selection) return true
    if (SlateRange.isExpanded(selection)) {
      this.editor.emit(WANGEDITOR_EVENT.ERROR, '不能框选文字')
      return true
    }
    return false
  }

  exec(opt: LabelValue) {
    this.editor.restoreSelection()
    if (this.isDisabled()) return

    const value = this.getValue()
    if (value == null) return

    const node: Audio = {
      type: 'ssml-audio',
      src: opt.value,
      remark: opt.label,
      children: [{ text: '' }],
    }

    SlateTransforms.insertNodes(this.editor, node)
  }
}
