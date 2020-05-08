<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import Vue from 'vue'
import { GlobalMixin } from './mixins/globalMixins'
// import firebase from 'firebase/app'
import firebase from '@firebase/app'
import { config } from './firebase/config'

require('firebase/messaging')
require('firebase/firestore')
require('firebase/auth')
require('firebase/storage')

const firebaseApp = firebase.initializeApp(config)

Vue.mixin(GlobalMixin)
export default {
  name: 'App',
  created () {
  },
  beforeCreate () {
    Vue.prototype.$db = firebaseApp.firestore()
    Vue.prototype.$fireAuth = firebaseApp.auth()
    Vue.prototype.$storage = firebaseApp.storage()
    Vue.prototype.$firebase = firebase
    console.log('firebaseApp', firebaseApp.auth())
  }
}
</script>
