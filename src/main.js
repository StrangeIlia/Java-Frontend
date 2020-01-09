import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {HTTP} from "./components/http";
import Vuelidate from "vuelidate/src";

Vue.config.productionTip = false;

Vue.use(Vuelidate);

export let MainVue = new Vue({
  name: 'Main',
  router,
  data() {
    return {
      username: null
    }
  },

  render: h => h(App),

  created() {
    this.getUserName();
  },

  methods: {
    getUserName: async function()
    {
      if (localStorage.token !== undefined) {
        await HTTP.get('/site/get_username').then(response => {
          this.username = response.data.username;
          if(this.username === null)
            this.username === '';
        }).catch(() => delete localStorage.token);
      }
    }
  },

  computed: {
    successAuth : function () {
      return this.username !== null && this.username !== '';
    }
  }

});

MainVue.$mount('#app');
