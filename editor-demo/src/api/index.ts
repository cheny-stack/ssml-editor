import axios from 'axios'
import '../mock'
import type { FilterSpeaker, LabelValue, Speaker } from '@cheny33/ssml-editor'
import type { FilterBarSearch } from '@cheny33/ssml-editor'
import type { CancellationToken } from '@cheny33/ssml-editor'
import { sleep } from '@cheny33/ssml-editor'
import type { AudioInfo } from '@cheny33/ssml-editor'
import type { RecentUsageSpeaker } from '@cheny33/ssml-editor'
import { html } from '../mock/ssml'

axios.defaults.baseURL = 'http://localhost:8083/cli-student/api'
// 从 URL 参数中获取 Authorization 值
const urlParams = new URLSearchParams(window.location.search)
let authorizationToken = urlParams.get('tkn')
if (!authorizationToken) {
  authorizationToken = sessionStorage.getItem('auth-token')
}
// 配置 axios headers
if (authorizationToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authorizationToken}`
}

export async function english(word: string): Promise<LabelValue[]> {
  const resp = await axios.get('/english', { params: { word } })
  return resp.data
}

export async function bgm(filter: FilterBarSearch): Promise<LabelValue[]> {
  const resp = await axios.get('/bgm', { params: { ...filter } })
  return resp.data
}

export async function special(filter: FilterBarSearch): Promise<LabelValue[]> {
  const resp = await axios.get('/special', { params: { ...filter } })
  return resp.data
}

export async function scene(): Promise<LabelValue[]> {
  const resp = await axios.get('/scene')
  return resp.data
}

export async function style(): Promise<LabelValue[]> {
  const resp = await axios.get('/style')
  return resp.data
}

export async function tag(): Promise<LabelValue[]> {
  const resp = await axios.get('/tag')
  return resp.data
}

export async function speaker(filter: FilterSpeaker): Promise<Speaker[]> {
  const resp = await axios.get('/speaker', { params: { ...filter } })
  return resp.data
}

export async function star(speaker: string, star: boolean): Promise<boolean> {
  const resp = await axios.get('/star', { params: { speaker, star } })
  return resp.data
}

export async function upload(file: File, token: CancellationToken): Promise<AudioInfo> {
  const source = axios.CancelToken.source()
  const formData = new FormData()
  formData.append('file', file)
  const resp = await axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    cancelToken: source.token,
    onUploadProgress: () => {
      token.isCancellationRequested() && source.cancel()
    },
  })
  return resp.data
}

export async function transfer(opt: { audioId: string; speakerId: string }): Promise<AudioInfo> {
  const resp = await axios.put('/transfer', { params: { ...opt } })
  return resp.data
}

export async function conversionSpeaker(): Promise<Speaker[]> {
  const resp = await axios.get('/conversionSpeaker')
  return resp.data
}

export async function play(ssmlGetter: () => string): Promise<AudioInfo> {
  const ssml = ssmlGetter()
  console.log('ssml:', ssml)
  const resp = await axios.post('/word/textToSpeech', { ssml })
  return resp.data
}

export async function recordRecentUsage(item: RecentUsageSpeaker): Promise<RecentUsageSpeaker> {
  const resp = await axios.post('/recentUsage', item)
  return resp.data
}

export async function fetchRecentUsage(): Promise<RecentUsageSpeaker[]> {
  const resp = await axios.get('/recentUsage')
  return resp.data
}

export async function deleteRecentUsage(id?: string): Promise<void> {
  const resp = await axios.delete('/recentUsage', { params: { id } })
  return resp.data
}

export async function saveHtml(getter: () => string) {
  await sleep(200)
  window.localStorage.setItem('editor-html', getter())
  return true
}

export async function readHtml() {
  console.log('readHtml')
  return window.localStorage.getItem('editor-html') || html
}
