import type { FilterSpeaker, LabelValue } from '@/model'
import type { IEditorConfig } from '@wangeditor/editor'
import type { FilterBarSearch } from '@/components/bar-search'
import type { Speaker } from '@/model'
import { defaultAudioInfo, type AudioInfo } from '@/menu/conversion-menu/data'
import type { CancellationToken } from '@/utils'
import { defaultRecentUsageSpeaker, type RecentUsageSpeaker } from '@/menu/management-menu/data'
import { inject, type App } from 'vue'
import { EMITTER_EVENT, PROVIDER_KEY } from '@/constant'
import { emitter } from '@/event-bus'

type FetahFunction = (word: string) => Promise<LabelValue[]>
type FilterFetahFunction = (filter: FilterBarSearch) => Promise<LabelValue[]>
type FilterSpeakerFetahFunction = (filter: FilterSpeaker) => Promise<Speaker[]>

function resolveList<T>() {
  return () => Promise.resolve<T[]>([])
}

export type GlobalEditorConfig = ReturnType<typeof createGlobalEditorConfig>

export interface SSMLEditorConfig {
  editorConfig: IEditorConfig
  handleError: (error: string, detail?: any) => void
  pinyin: {
    fetchData: FetahFunction
  }
  english: {
    fetchData: FetahFunction
  }
  bgm: {
    menus?: LabelValue[]
    fetchScene: () => Promise<LabelValue[]>
    fetchStyle: () => Promise<LabelValue[]>
    fetchData: FilterFetahFunction
  }
  special: {
    menus?: LabelValue[]
    fetchScene: () => Promise<LabelValue[]>
    fetchStyle: () => Promise<LabelValue[]>
    fetchData: FilterFetahFunction
  }
  tryPlay: {
    play: (ssml: string) => Promise<AudioInfo>
    gender?: LabelValue[]
    topFlag?: LabelValue[]
    category?: LabelValue[]
    fetchData: FilterSpeakerFetahFunction
    featchTag: () => Promise<LabelValue[]>
    fetchStar: (speaker: string, star: boolean) => Promise<boolean>
  }
  conversion: {
    timeoutMilliseconds: number
    audioUpload: (file: File | Blob, token: CancellationToken) => Promise<AudioInfo>
    transfer: (opt: { audioId: string; speakerId: string }) => Promise<AudioInfo>
    fetchSpeaker: () => Promise<Speaker[]>
  }
  management: {
    recordRecentUsage: (recentUsage: RecentUsageSpeaker) => Promise<RecentUsageSpeaker>
    fetchRecentUsage: () => Promise<RecentUsageSpeaker[]>
    deleteRecentUsage: (id?: string) => Promise<void>
  }
}

export function createGlobalEditorConfig(config?: Partial<SSMLEditorConfig>) {
  const editorConfig =
    config?.editorConfig || <IEditorConfig>{ maxLength: 5000, placeholder: '请输入内容...' }
  const handleError = config?.handleError || (() => {})
  const pinyin = config?.pinyin || { fetchData: resolveList<LabelValue>() }
  const english = config?.english || { fetchData: resolveList<LabelValue>() }
  const special = config?.special || {
    fetchData: resolveList<LabelValue>(),
    fetchScene: resolveList<LabelValue>(),
    fetchStyle: resolveList<LabelValue>(),
  }
  const bgm = config?.bgm || {
    fetchData: resolveList<LabelValue>(),
    fetchScene: resolveList<LabelValue>(),
    fetchStyle: resolveList<LabelValue>(),
  }
  const tryPlay = config?.tryPlay || {
    play: () => Promise.resolve(defaultAudioInfo()),
    fetchData: resolveList<FilterSpeaker>(),
    featchTag: resolveList<LabelValue>(),
    fetchStar: () => Promise.resolve(true),
  }
  const conversion = config?.conversion || {
    timeoutMilliseconds: 20000,
    audioUpload: () => Promise.resolve(defaultAudioInfo()),
    transfer: () => Promise.resolve(defaultAudioInfo()),
    fetchSpeaker: resolveList<Speaker>(),
  }
  const management = config?.management || {
    recordRecentUsage: () => Promise.resolve<RecentUsageSpeaker>(defaultRecentUsageSpeaker()),
    fetchRecentUsage: resolveList<RecentUsageSpeaker>(),
    deleteRecentUsage: () => Promise.resolve(),
  }

  const specialRequired = special as Required<SSMLEditorConfig['special']>
  const bgmRequired = bgm as Required<SSMLEditorConfig['bgm']>
  const tryPlayRequired = tryPlay as Required<SSMLEditorConfig['tryPlay']>

  specialRequired.menus ??= [
    { label: '默认音效', value: '' },
    { label: '自定义音效', value: 'custom' },
    { label: '最近音效', value: 'history' },
  ]

  bgmRequired.menus ??= [
    { label: '默认配乐', value: '' },
    { label: '自定义配乐', value: 'custom' },
    { label: '最近配乐', value: 'history' },
  ]

  tryPlayRequired.gender ??= [
    { label: '全部', value: '' },
    { label: '男声', value: 'Male' },
    { label: '女声', value: 'Female' },
  ]

  tryPlayRequired.topFlag ??= [
    { label: '热榜', value: '' },
    { label: 'SVIP', value: 'SVIP' },
    { label: '付费', value: '付费' },
  ]

  tryPlayRequired.category ??= [
    { label: '常用', value: '常用' },
    { label: '已购', value: '已购' },
    { label: '收藏', value: '收藏' },
    { label: '我的', value: '我的' },
  ]

  return {
    editorConfig,
    handleError,
    pinyin,
    english,
    bgm: bgmRequired,
    special: specialRequired,
    tryPlay: tryPlayRequired,
    conversion,
    management,
  }
}

export function proviceConfig(app: App, config?: Partial<SSMLEditorConfig>) {
  const globalEditorConfig = createGlobalEditorConfig(config)
  emitter.on(EMITTER_EVENT.ERROR, globalEditorConfig.handleError)
  app.provide(PROVIDER_KEY.EDITOR_CONFIG, globalEditorConfig)
}

export function injectConfig(): GlobalEditorConfig {
  const config = inject<GlobalEditorConfig>(PROVIDER_KEY.EDITOR_CONFIG)
  if (!config) throw new Error('GlobalEditorConfig is undefined')
  return config
}
