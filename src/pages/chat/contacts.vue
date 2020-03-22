<template>
  <f7-page name="about">
    <f7-navbar title="Contacts" back-link="Back"></f7-navbar>
    <f7-list media-list>
  <f7-list-item swipeout v-for="(contact,index) in contacts" :key="index"
    :title="contact.name"
  >
    <img class="small-avatar" slot="media" :src="contact.photo_url"/>
    <f7-swipeout-actions right>
         <f7-swipeout-button color="green" @click="addFrd(contact)">Add</f7-swipeout-button>
    </f7-swipeout-actions>
  </f7-list-item>
</f7-list>
    <!-- <pre>{{contacts}}</pre> -->
  </f7-page>
</template>
<script>
import firebase from 'firebase'
export default {
  computed:{
    contacts(){
      return this.$store.getters.contacts
    }
  },methods:{
    addFrd(frd){
       var request={}
       request.sender=firebase.auth().currentUser.uid;
       request.recipient=frd.uid
       this.$store.dispatch('sendRequest',request)
    }
  },
  created(){
    this.$store.dispatch('getAllUsers')
  }
}
</script>
<style scoped>
.small-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}
</style>