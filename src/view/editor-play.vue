<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { emitter } from '@/event-bus'
import { sleep } from '@/utils'

// Define props to accept the audio file URL
const props = defineProps<{
  audioUrl: string
}>()
const audioUrl = ref<string>(props.audioUrl)
// Create a reference for the audio element
const audioRef = ref<HTMLAudioElement | null>(null)

// Create a method to play the audio
async function playAudio(src: string) {
  audioUrl.value = src
  localStorage.setItem('editor-audio-url', audioUrl.value)
  if (audioRef.value) {
    audioRef.value.load() // Ensure the new source is loaded
    await sleep(300) // Wait for the source to load
    audioRef.value.play().catch((error) => {
      console.error('Error playing audio:', error)
    })
  }
}

// Use the event bus to listen for the play event
onMounted(() => {
  emitter.on('text-to-speech-ok', playAudio)
})
</script>

<template>
  <div class="mt-3 pb-3 d-flex justify-content-center align-items-center">
    <audio class="dark-audio" style="width: 500px" ref="audioRef" controls>
      <source :src="audioUrl" type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<style scoped lang="scss">
/* Add any necessary styles here */
.dark-audio {
  filter: brightness(0.95); /* Adjust the value to make the color darker */
}
</style>
