import { useToast, POSITION, TYPE } from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'

export enum ToastTypes {
  SUCCESS = TYPE.SUCCESS,
  ERROR = TYPE.ERROR,
  INFO = TYPE.INFO,
  WARNING = TYPE.WARNING
}

const DEFAULT_TIMEOUT = 2000
const ERROR_TIMEOUT = 5000

const toast = useToast()
const toastConfig: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: DEFAULT_TIMEOUT
}

export const showToast = (type: ToastTypes, text: string, options?: PluginOptions) => {
  toast(text, {
    ...toastConfig,
    timeout: type === ToastTypes.ERROR ? ERROR_TIMEOUT : toastConfig.timeout,
    type: (<unkonwn>type) as TYPE,
    ...options
  })
}
