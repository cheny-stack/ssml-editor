<script setup lang="ts">
import { EditorView } from '@cheny33/ssml-editor'
import config from './config'
import type { IDomEditor } from '@wangeditor/editor'

declare global {
  interface Window {
    editor: import('@wangeditor/editor').IDomEditor
  }
}
function handleCreate(editor: IDomEditor) {
  window.editor = editor
}
</script>

<template>
  <!-- <div class="d-flex flex-row justify-content-between">
    <div>菜单栏</div>
    <div>
      <EditorView @created="handleCreate"></EditorView>
    </div>
  </div> -->
  <EditorView @created="handleCreate" :config="config"></EditorView>
</template>

<style scoped></style>
