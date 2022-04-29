import * as axios from 'axios'
import type { DefineComponent } from 'vue'

declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $env: any,
        $baseUrl: String,
        $version: String,
        $buildTime: any,
        $auth: Function,
        loadOption: Function
    }
}

declare module '*.md'