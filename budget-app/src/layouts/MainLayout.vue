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
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; color:black; border-right: 1px solid #ddd;">

        <q-list
          bordered
          padding
          class="rounded-borders"
          style="max-width: 500px"
        >
          <q-item
            to="/"
            clickable
            v-ripple
          >
            <q-item-section>
              Home
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item
            to="/"
            clickable
            v-ripple
          >
            <q-item-section>Log Out</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar
            size="56px"
            class="q-mb-sm"
          >
            <img :src="user.photoURL" />
          </q-avatar>
          <div class="text-weight-bold">{{user.displayName}}</div>
          <div>{{user.email}}</div>
        </div>
      </q-img>
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
  computed: {
    user () {
      return JSON.parse(JSON.stringify(this.$store.getters.user))
    }
  },
  watch: {
    $route (to, from) {
      this.getToolbarHeader()
    }
  }

}
</script>
