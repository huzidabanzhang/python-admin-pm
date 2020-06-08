<template>
    <chubby-container>
        <div slot="header">
            <el-radio-group
                size="mini"
                v-model="value"
                @change="handleChange"
            >
                <el-radio-button
                    v-for="(name, key) in data"
                    :label="name"
                    :key="key"
                ></el-radio-button>
            </el-radio-group>
        </div>

        <Preview
            :content="content"
            :loading="loadingInstance"
            ref="MARK_PREVIEW"
        ></Preview>
    </chubby-container>
</template>

<script>
import { GetReadmeContent } from '@api/sys.base'
import Preview from '@/pages/markdown/preview.vue'
import md from '../../../../README.md'
export default {
    name: 'preview',
    components: { Preview },
    data () {
        return {
            content: '',
            data: ['vue-admin', 'python-admin'],
            value: 'vue-admin',
            loadingInstance: ''
        }
    },
    mounted () {
        this.handleChange()
    },
    methods: {
        handleChange () {
            this.loadingInstance = this.$loading(
                this.loadOption('', this.$refs.MARK_PREVIEW.$el, false, false)
            )

            if (this.value == 'vue-admin') {
                this.content = md
            } else {
                GetReadmeContent()
                    .then(async res => {
                        this.content = res.content
                    })
                    .catch(() => {
                        this.loadingInstance.close()
                    })
            }
        }
    }
}
</script>