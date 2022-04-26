import * as axios from 'axios'
import type { DefineComponent } from 'vue'

declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}

declare module '*.md'