import { type IDomEditor } from '@wangeditor/editor'
import { SlateTransforms, SlateRange } from '@wangeditor/editor'
import { emitter } from '@/event-bus'
import BaseFn from '../base-fn'
import type { LabelValue } from '@/model'
import type { Phoneme } from '@/core'
import { EMITTER_EVENT } from '@/constant'

export class SpeakerFn extends BaseFn {
  protected readonly key: string = 'speaker'

  public constructor(editor: IDomEditor) {
    super(editor)
  }

  public getValue(): string {
    return super.getValue()
  }

  public isDisabled(): boolean {
    if (super.isDisabled()) return true
    const { selection } = this.editor
    if (!selection) return true
    if (SlateRange.isCollapsed(selection)) {
      emitter.emit(EMITTER_EVENT.ERROR, '请选中文本')
      return true
    }

    const value = this.getValue()
    if (value.length != 1) return true

    if (!/^[\u4E00-\u9FA5]+$/gi.test(value)) {
      emitter.emit(EMITTER_EVENT.ERROR, '选中一个中文字符，并且有不能在其他语句之内')
      return true
    }

    return false
  }

  public exec(opt: LabelValue) {
    this.editor.restoreSelection()
    if (this.isDisabled()) return
    const value = this.getValue()
    if (value == null) return

    const node: Phoneme = {
      type: 'ssml-phoneme',
      ph: opt.value,
      remark: opt.label,
      children: [{ text: value }]
    }

    SlateTransforms.insertNodes(this.editor, node)
  }
}
