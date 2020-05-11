import Vue from 'vue'
import Vuex from 'vuex'

import chubby from './modules/chubby'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    chubby
  }
})
