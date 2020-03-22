<template>
  <f7-page name="home" @page:beforein="initHome">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false" large>
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>Talkie</f7-nav-title>
      <f7-nav-right>
        <f7-link href="/requests/">
          <f7-icon f7="persons">
              <f7-badge color="red" v-if="friend_requests.length>0">{{friend_requests.length}}</f7-badge>
          </f7-icon>
        </f7-link>
        <f7-link href="/contacts/" icon-f7="person_badge_plus"></f7-link>
      </f7-nav-right>
      <f7-nav-title-large sliding>Talkie</f7-nav-title-large>
    </f7-navbar>

  <f7-list media-list>
    <f7-list-item v-for="(frd,index) in friends" :key="index"
      :title="frd.name" @click="gotoChat(frd)">
      <img class="small-avatar" slot="media" :src="frd.photo_url"/>    
    </f7-list-item>
</f7-list>

  </f7-page>
</template>
<script>
export default {
  methods:{
    gotoChat(frd){
      var frd_string = JSON.stringify(frd)
      this.$f7router.navigate('/chat/'+encodeURIComponent(frd_string))
    },
    initHome(){
      this.$store.commit('setShowTabs',true)
    }
  },
  computed:{
    friends(){
      return this.$store.getters.friends
    },
    friend_requests(){
      return this.$store.getters.friend_requests
    }
  },
  created(){
    this.$store.dispatch('getMyRequests')
    this.$store.dispatch('getMyFriends')

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
