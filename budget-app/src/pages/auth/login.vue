<template>
  <q-page
    padding
    class="authPage"
  >

    <div
      v-if="!showForm"
      class="q-mt-md q-pa-sm"
    >
      <div>
        <div class="row">
          <q-btn
            type="submit"
            style="background:#ffffff;color: #757575"
            :loading="submitting"
            icon="img:statics/s_icon/gg.svg"
            @click="loginPopup(googleProvider)"
            no-caps
            label="Sign in with Google"
            class="q-ma-sm q-mt-md q-pa-sm col sign-font"
          >
            <template v-slot:loading>
              <q-spinner-facebook color="primary" />
            </template>
          </q-btn>
        </div>

        <div class="row">
          <q-btn
            type="submit"
            :loading="submitting"
            icon="img:statics/s_icon/mail.svg"
            @click="showForm=true"
            no-caps
            color="accent"
            label="Sign in with Email"
            class="q-ma-sm q-mt-md q-mb-md q-pa-sm col sign-font"
          > <template v-slot:loading>
              <q-spinner-facebook color="primary" />
            </template></q-btn>
        </div>
      </div>
    </div>
    <q-card
      v-else
      class="q-mt-md"
    >
      <form>
        <div class="row">
          <q-input
            ref="email"
            name="email"
            label="Email"
            class="col q-pa-sm"
            type="email"
            v-model="email"
            :rules="[val => !!val || 'Email is required']"
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
      </form>
      <!-- <div class="row">
        <q-toggle class="col q-pa-sm" v-model="rememberMe" label="Remember Me"/>
      </div>-->
      <div class="row">
        <q-btn
          type="submit"
          @click="login"
          label="Login"
          class="q-ma-sm q-mt-md q-pa-sm col q-mb-md"
          color="positive"
        ></q-btn>
      </div>
      <div class="row">
        <q-btn
          type="submit"
          @click="showForm=false"
          label="Cancel"
          flat
          class=" q-pa-sm col"
          color="positive"
        ></q-btn>
      </div>
      <div class="row">
        <q-btn
          type="submit"
          outline
          to="/sign-up"
          label="Sign Up"
          class="q-pa-sm col"
          color="positive"
        ></q-btn>
      </div>
      <div class="row ">
        <q-btn
          to="/forgot-password"
          label="Forgot Password"
          class=" q-pa-sm col "
          color="secondary"
          flat
        ></q-btn>
      </div>
      <q-inner-loading :showing="submitting">
        <q-spinner-facebook color="primary" />
      </q-inner-loading>
    </q-card>

  </q-page>
</template>

<style>
</style>

<script>
var firebase = require('firebase')
export default {
  name: 'Login',
  data () {
    return {
      email: null,
      showForm: false,
      password: null,
      submitting: false,
      rememberMe: false,
      isPwd: true,
      googleProvider: new firebase.auth.GoogleAuthProvider(),
      facebookProvider: new firebase.auth.FacebookAuthProvider()
    }
  },
  created () {
    if (this.$route.query.email) {
      this.email = this.$route.query.email
      this.showForm = true
    }
  },
  mounted () {
    this.submitting = true
    firebase
      .auth()
      .getRedirectResult()
      .then(res => {
        if (res.user !== null) {
          this.signInSuccess(res)
        } else {
          this.submitting = false
        }
      })
      .catch(() => {
        this.submitting = false
      })
  },
  methods: {
    login () {
      this.$refs.email.validate()
      this.$refs.password.validate()
      if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
        this.submitting = true
        this.$fireAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(res => {
            this.signInSuccess(res)
          })
          .catch(err => { this.loginFail(err) })
      }
    },
    loginPopup (p) {
      this.submitting = true
      this.$fireAuth.signInWithRedirect(p).catch(err => this.loginFail(err))
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
    },
    signInSuccess (response) {
      this.getByEmail(response)
        .then(res => {
          if (res) {
            this.$store.dispatch('login', {
              user: res
            })
            this.$router.replace('/')
          } else {
            this.$fireAuth.currentUser.getIdToken(true)
              .then((idToken) => {
                console.log('idToken', idToken)
                this.$store.dispatch('addToken',
                  `Bearer ${idToken}`
                )
              }).catch(e => console.log(e))
            this.$fireAuth.currentUser.sendEmailVerification()
            this.$db
              .collection('users')
              .add({
                email: response.user.email,
                displayName: response.user.displayName,
                photoURL: response.user.photoURL
              })
              .then(() => {
                this.signInSuccess(response)
              })
          }
          this.submitting = false
        })
        .catch(err => {
          this.$q.notify({ message: err, color: 'negative', icon: 'close' })
          this.submitting = false
        })
    },
    loginFail (e) {
      this.$q.notify({ message: '' + e, color: 'negative', icon: 'close' })
      this.submitting = false
    },
    forgotPW () { },
    contactSupport () { },
    createAccount () { }
  }
}
</script>
<style>
.sign-font {
  font-family: Roboto, Helvetica, Arial, sans-serif !important;
}
</style>
