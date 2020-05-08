<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-primary"
  >
    <div class="row justify-center q-pt-lg q-mb-xs">
      <div class="col-xs-8 col-4 col-xl-4">
        <q-img
          basic
          src="statics/app-logo5.png"
        ></q-img>
      </div>
    </div>
    <div class="row justify-center">
      <div class="text-h6 col text-center text-white">Start using the budget app today </div>
    </div>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'AuthLayout',
  beforeCreate () {
    if (this.$q.platform.is.cordova) {
      cordova.plugins.firebase.dynamiclinks.onDynamicLink((data) => {
        if (data.deepLink) {
          var vars = data.deepLink.split('?')
          if (vars.length > 0) {
            this.$router.replace('/sign-in?' + vars[1])
          }
        }
      }
      )
    }
  }
}

</script>

<style>
</style>
