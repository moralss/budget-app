<template>
  <q-page
    padding
    class="authPage"
  >
    <q-card class="q-mt-md">
      <div class="row">
        <q-input
          ref="name"
          label="Full Name"
          class="col q-pa-sm"
          v-model="name"
          :rules="[val => !!val || 'Full Name is required']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </div>
      <div class="row">
        <q-input
          ref="email"
          label="Email"
          lazy-rules
          class="col q-pa-sm"
          type="email"
          v-model="email"
          :rules="[val => !!val || 'Email is required', val =>
      validateEmail(
        val) || 'Invalid Email Address'
        ]"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
      </div>
      <div class="row q-mt-sm">
        <q-input
          ref="password"
          label="Password"
          :type="isPwd ? 'password' : 'text'"
          class="col q-pa-sm"
          v-model="password"
          :rules="[val => !!val || 'Passsword is required']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <div class="row q-mt-sm">
        <q-input
          ref="confirm"
          label="Confirm Password"
          :type="isPwd ? 'password' : 'text'"
          class="col q-pa-sm"
          v-model="confirm"
          :rules="[val => !!val || 'Confirm Passsword is required',  val =>
      passwordMatch(
        val) || 'Password does not match']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <!-- <div class="row">
        <q-toggle class="col q-pa-sm" v-model="rememberMe" label="Remember Me"/>
      </div>-->
      <div class="row">
        <q-btn
          type="submit"
          @click="signup"
          label="Sign Up"
          class="q-ma-sm q-mt-md q-pa-sm col q-mb-md"
          color="positive"
        ></q-btn>
      </div>
      <div class="row">
        <q-btn
          type="submit"
          outline
          @click="nav('/login')"
          label="Sign In"
          class="q-ma-sm q-mt-md q-pa-sm col q-mb-md"
          color="positive"
        ></q-btn>
      </div>
    </q-card>
    <q-inner-loading :showing="submitting">
      <q-spinner-facebook color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<style>
</style>

<script>

// var firebase = require('firebase')
export default {
  name: 'Login',
  data () {
    return {
      email: null,
      password: null,
      name: null,
      confirm: null,
      submitting: false,
      rememberMe: false,
      isPwd: true
    }
  },
  mounted () {

  },
  methods: {
    nav (val) {
      this.$router.push(val)
    },
    passwordMatch (val) {
      return this.password === val
    },
    validateEmail (email) {
      var re =
        /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    },
    signup () {
      this.$refs.name.validate()
      this.$refs.password.validate()
      this.$refs.email.validate()
      this.$refs.confirm.validate()
      if (!this.$refs.email.hasError && !this.$refs.password.hasError && !this.$refs.name.hasError && !this.$refs.confirm.hasError) {
        this.submitting = true
        this.$fireAuth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((res) => {
            this.$db
              .collection('users')
              .add({
                email: this.email,
                displayName: this.name
              })
              .then(() => {
                var user = this.$fireAuth.currentUser
                this.$fireAuth.currentUser.getIdToken(true)
                  .then((idToken) => {
                    console.log('idToken', idToken)
                    this.$store.dispatch('addToken',
                      `Bearer ${idToken}`
                    )
                  }).catch(e => console.log(e))
                user.sendEmailVerification().then(() => { }).catch((error) => {
                  this.$q.notify({ message: error.message, color: 'negative', icon: 'close' })
                })
                this.submitting = false
                this.$q.notify({ message: 'Sign Up Successful', color: 'positive' })
                this.$router.replace({ path: '/login', query: { email: this.email } })
              })
            this.submitting = false
          })
          .catch(error => {
            this.submitting = false
            this.$q.notify({ message: error.message, color: 'negative', icon: 'close' })
          })
      }
    },
    getByEmail (res) {
      return this.$db
        .collection('users')
        .where('email', '==', res.user.email)
        .limit(1)
        .get()
        .then(querySnapshot => {
          const user = querySnapshot.docs.map(doc => doc.data())
          const id = querySnapshot.docs.map(doc => doc.id)
          if (user.length > 0) {
            user[0].id = id[0]
            return user[0]
          }
        })
        .catch(() => {
          this.$q.notify({
            message: 'There was an error',
            color: 'negative',
            icon: 'check'
          })
          this.submitting = false
        })
    }
  }
}
</script>
<style>
.sign-font {
  font-family: Roboto, Helvetica, Arial, sans-serif !important;
}
</style>
