<template>
  <f7-page name="signin">
    <f7-navbar title="Sign in"></f7-navbar>

    <f7-list no-hairlines-md>
      <f7-list-input
        :value="email"
        @input="email=$event.target.value"
        label="E-mail"
        type="email"
        placeholder="Your e-mail"
        clear-button
      ></f7-list-input>

      <f7-list-input
        :value="password"
        @input="password=$event.target.value"
        label="Password"
        type="password"
        placeholder="Your password"
        clear-button
      ></f7-list-input>
    </f7-list>
    <f7-block>
      <f7-button outline @click="signIn">Sign in</f7-button>
      <br />
      <div style="text-align:center;">
        <f7-link v-if="show_resend_email" @click="resendEmail" :color="color(time_left)">
          Resend Confirmation Email
          <span v-if="time_left>0">&nbsp; {{time_left}}</span>
        </f7-link>
        <br />
        <f7-link href="/signup/">Don't have an account? Sign-up</f7-link>
        <br />
        <f7-link @click="forgetPassword">Forget Password</f7-link>
      </div>
    </f7-block>
  </f7-page>
</template>
<script>
// import { setInterval, clearInterval } from 'timers';
import { mixin } from '../../js/mixin'
import firebase from 'firebase'

export default {
  data() {
    return {
      email: null,
      password: null,
      time_left: -1
    };
  },
  computed: {
    show_resend_email() {
      return this.$store.getters.show_resend_email;
    }
  },
  methods: {
    forgetPassword() {
      const self = this
      
      if (self.email != null) {
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(self.email).then(function() {
            // Email sent.
            self.$store.commit('setAlertMessage','A reset email has been sent')
          }).catch(function(error) {
            self.$store.commit('setAlertMessage',error)
          });
      } else {
        self.$store.commit('setAlertMessage', 'Please enter your email')
      }
    },
    color(timeleft) {
      if (timeleft <= 0) {
        return "#007aff";
      } else {
        return "gray";
      }
    },
    resendEmail() {
      const self = this;
      if (self.time_left <= 0) {
        self.$store.dispatch("sendVerification");
        self.countDown();
      }
    },
    countDown() {
      const self = this;
      self.time_left = 30;
      var timer = setInterval(function() {
        self.time_left -= 1;
        if (self.time_left <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },
    signIn() {
      var payload = {};
      payload.email = this.email;
      payload.password = this.password;
      this.$store.dispatch("signIn", payload);
    }
  }
};
</script>
