import { ref, watch } from 'vue'

export default function () {
    const languages = ref([])

    function handleDealLanguages() {
        languages.value.forEach((i) => {
            const langs = JSON.parse(i.langs)
            for (let x in langs) {
                i[x] = langs[x]
            }
        })
    }

    watch(() => languages, () => {
        handleDealLanguages()
    }, {
        deep: true,
        immediate: true
    })

    return {
        languages,
        handleDealLanguages
    }
}
