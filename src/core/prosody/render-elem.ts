import { h, type VNode } from 'snabbdom'
import { SlateElement, type IDomEditor, SlateTransforms, DomEditor } from '@wangeditor/editor'
import type { Prosody } from './custom-types'
import throttle from 'lodash.throttle'

export default {
  type: 'ssml-prosody',
  renderElem: (elem: SlateElement, children: VNode[] | null, editor: IDomEditor) => {
    const { remark } = elem as Prosody
    return h('span.ssml-wrapper', [
      h(
        `span.remark`,
        {
          props: { contentEditable: false },
          style: {
            backgroundColor: 'var(--ssml-prosody)',
          },
        },
        [
          h(`span.iconfont.icon-roundclosefill`, {
            on: {
              click: throttle((event: Event) => {
                event.preventDefault()
                const path = DomEditor.findPath(editor, elem)
                SlateTransforms.unwrapNodes(editor, { at: path })
              }),
            },
          }),
          h(`span.data-content`, { attrs: { 'data-content': remark } }),
        ],
      ),
      h(`span.data-content`, {
        attrs: { 'data-content': '{{' },
        style: { color: `var(--ssml-prosody)` },
      }),
      h('span', children),
      h(`span.data-content`, {
        attrs: { 'data-content': '}}' },
        style: { color: 'var(--ssml-prosody)' },
      }),
    ])
  },
}
