<template>
  <q-layout view="lHh Lpr lFf">

    <q-header
      elevated
      reveal
    >
      <q-toolbar class="row">
        <div class="col-1">
          <q-avatar size="26px ">
          </q-avatar>
        </div>
        <q-toolbar-title class="col">
          <div class="absolute-center">
            {{toolbarHeader}}
          </div>
        </q-toolbar-title>
        <div class="col-1">
          <q-btn
            class="self-right"
            dense
            flat
            round
            icon="menu"
            @click="right = !right"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="right"
      show-if-above
      side="right"
      :width="200"
      :breakpoint="700"
      elevated
      content-class=""
    >
      <q-list
        bordered
        padding
        class="rounded-borders"
        style="max-width: 500px"
      >
        <q-item
          to="/dashboard"
          clickable
          v-ripple
        >
        </q-item>
        <q-item
          to="/"
          clickable
          v-ripple
        >
          <q-item-section>
            main page
          </q-item-section>
        </q-item>
        <q-separator spaced />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      right: true,
      toolbarHeader: null
    }
  },
  methods: {
    getToolbarHeader () {
      if (this.$router.currentRoute.meta.toolbarHeader) {
        this.toolbarHeader = this.$router.currentRoute.meta.toolbarHeader
      }
    }
  },
  created () {
    this.getToolbarHeader()
  },
  watch: {
    $route (to, from) {
      this.getToolbarHeader()
    }
  }

}
</script>
