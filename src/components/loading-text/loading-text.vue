<!-- src/components/LoadingText.vue -->
<template>
  <span>{{ displayedText }}</span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ text: string; isLoading: boolean }>()
const displayedText = ref('')

function startLoading() {
  let index = 0
  displayedText.value = ''
  const interval = setInterval(() => {
    if (props.isLoading) {
      if (index < props.text.length) {
        displayedText.value += props.text[index]
        index++
      } else {
        index = 0
        displayedText.value = ''
      }
    } else {
      clearInterval(interval)
    }
  }, 150) // Adjust the interval time for speed of animation
}

watch(
  () => props.isLoading,
  (newVal) => {
    if (newVal) {
      startLoading()
    }
  },
)

if (props.isLoading) {
  startLoading()
}
</script>

<style scoped>
span {
  display: inline-block;
  white-space: pre;
}
</style>
