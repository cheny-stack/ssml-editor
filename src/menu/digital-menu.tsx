import { type IDomEditor } from '@wangeditor/editor'
import type { SayAs, IdText } from '../core/custom-types'
import { SlateTransforms, SlateEditor, SlateRange } from '@wangeditor/editor'
import { genRandomStr } from '@/utils/random'
import { defineComponent, inject, ref, withModifiers, type ShallowRef } from 'vue'
import { BarButton } from '@/components'
import { ElPopover } from 'element-plus'
import { bindClose } from './helper'

function genDomID(): string {
  return genRandomStr('w-e-dom-digital')
}

export class DigitalFn {
  getValue(editor: IDomEditor): string | null {
    const { selection } = editor
    if (selection == null) return ''
    return SlateEditor.string(editor, selection)
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor
    if (selection == null) return true
    if (SlateRange.isCollapsed(selection)) return true

    const value = SlateEditor.string(editor, selection)
    if (value.length <= 0) return true

    if (Number.isNaN(Number(value))) return true

    return false
  }

  exec(editor: IDomEditor, idtext: IdText) {
    if (this.isDisabled(editor)) return
    const { selection } = editor
    if (selection == null) return
    const value = this.getValue(editor)
    if (value == null) return

    const node: SayAs = {
      type: 'ssml-say-as',
      domId: genDomID(),
      interpretAs: idtext.id,
      remark: idtext.remark,
      bgColor: 'digital',
      children: [{ text: value }]
    }

    SlateTransforms.delete(editor)
    SlateTransforms.insertNodes(editor, node)

    bindClose(editor, 'ssml-say-as', node.domId, (nodeEntity) => {
      SlateTransforms.unwrapNodes(editor, { at: nodeEntity[1] })
    })
  }
}

const idTextList: IdText[] = [
  { id: 'value', text: '读数值', remark: '读数值' },
  { id: 'digits', text: '读数字', remark: '读数字' },
  { id: 'telephone', text: '读手机号', remark: '读手机号' }
]

export default defineComponent({
  emits: ['error'],
  setup(_props, { emit }) {
    const fn = new DigitalFn()
    const editorRef = inject<ShallowRef>('editor')
    const visible = ref(false)

    function toggle() {
      visible.value = !visible.value
    }

    function handleClick(editor: IDomEditor) {
      if (fn.isDisabled(editor)) {
        emit('error', '请选择纯数字文本')
        return
      }
      toggle()
    }

    return () => (
      <ElPopover v-model:visible={visible.value} trigger="contextmenu" hideAfter={0}>
        {{
          reference: () => (
            <BarButton text="数字符号" icon="digital" onClick={handleClick}></BarButton>
          ),
          default: () => (
            <div class="d-flex flex-column">
              {idTextList.map(({ id, text, remark }) => {
                return (
                  <div
                    key={id}
                    class="clickable w-100 fs-6 rounded-1 px-3 py-2"
                    onClick={() => {
                      if (!fn.isDisabled(editorRef?.value)) {
                        fn.exec(editorRef?.value, { id, text, remark })
                      }
                      toggle()
                    }}
                    onMousedown={withModifiers(() => {}, ['stop', 'prevent'])}
                  >
                    {text}
                  </div>
                )
              })}
            </div>
          )
        }}
      </ElPopover>
    )
  }
})
