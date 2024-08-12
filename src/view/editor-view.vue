<script setup lang="ts">
import EditorHeader from './editor-header.vue'
import EditorCore from './editor-core.vue'
import EditorBar from './editor-bar.vue'
import EditorPlay from './editor-play.vue'
import LoadingText from '@/components/loading-text/loading-text.vue'
import { type IDomEditor } from '@wangeditor/editor'
import { emitter } from '@/event-bus'
import { ref, provide, onMounted, onUnmounted, toRaw } from 'vue'
import { type PartialSSMLEditorConfig, setConfig } from '@/config'

const emit = defineEmits<{ created: [editor: IDomEditor]; change: [editor: IDomEditor] }>()
const props = withDefaults(
  defineProps<{ config?: PartialSSMLEditorConfig; editorKey?: symbol }>(),
  {
    editorKey: () => Symbol('editorKey'),
  },
)

const boxRef = ref<HTMLDivElement>()
const isLoading = ref(false)
setConfig(props.editorKey, toRaw(props.config))

// 设置拖拽容器盒子,如果想要在整个页面可拖拽,将boxRef换为ref(document.body)即可
provide('dragContainerBox', boxRef)
provide('editorKey', props.editorKey)

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  emitter.on('show-loading', showLoading)
  emitter.on('hide-loading', hideLoading)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  emitter.off('show-loading', showLoading)
  emitter.off('hide-loading', hideLoading)
})

function handleCreated(editor: IDomEditor) {
  emit('created', editor)
}

function handleChange(editor: IDomEditor) {
  emit('change', editor)
}

function handleClick(ev: MouseEvent) {
  emitter.emit('view-click', ev)
}

function handleKeyDown(ev: KeyboardEvent) {
  emitter.emit('view-keydown', ev)
}
function showLoading() {
  isLoading.value = true
}

function hideLoading() {
  isLoading.value = false
}
</script>

<template>
  <div ref="boxRef" class="ssml-editor-root editor-view" @click="handleClick">
    <slot name="header"><EditorHeader></EditorHeader></slot>
    <div class="editor-box">
      <EditorBar></EditorBar>
      <div class="editor-core-container shadow pt-1">
        <EditorCore @change="handleChange" @created="handleCreated"></EditorCore>
      </div>
      <EditorPlay audioUrl=""></EditorPlay>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <LoadingText text="语音生成中..." :isLoading="isLoading"></LoadingText>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor-view {
  background-color: var(--tool-bg-color);

  .editor-box {
    background-color: var(--tool-bg-grey-color);

    .editor-core-container {
      margin: 0 auto;
      width: 60vw;
    }
  }
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Ensure it is above other elements */
  }
}
</style>
