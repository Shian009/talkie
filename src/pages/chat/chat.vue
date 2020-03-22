<template>
  <f7-page>
    <f7-navbar title="Messages" back-link="Back"></f7-navbar>

    <f7-messagebar
      :placeholder="placeholder"
      ref="messagebar"
      :attachments-visible="attachmentsVisible"
      :sheet-visible="sheetVisible"
    >
      <f7-link
        icon-ios="f7:folder"
        icon-aurora="f7:folder"
        icon-md="material:folder"
        slot="inner-start"
        @click="launchFilePicker"
      ></f7-link>
      <f7-link
        icon-ios="f7:camera_fill"
        icon-aurora="f7:camera_fill"
        icon-md="material:camera_alt"
        slot="inner-start"
        @click="sheetVisible = !sheetVisible"
      ></f7-link>
      <f7-link
        icon-ios="f7:arrow_up_circle_fill"
        icon-aurora="f7:arrow_up_circle_fill"
        icon-md="material:send"
        slot="inner-end"
        @click="sendMessage"
      ></f7-link>
      <f7-messagebar-attachments>
        <f7-messagebar-attachment
          v-for="(image, index) in attachments"
          :key="index"
          :image="image"
          @attachment:delete="deleteAttachment(image)"
        ></f7-messagebar-attachment>
      </f7-messagebar-attachments>
      <f7-messagebar-sheet>
        <f7-messagebar-sheet-image
          v-for="(image, index) in images"
          :key="index"
          :image="image"
          :checked="attachments.indexOf(image) >= 0"
          @change="handleAttachment"
        ></f7-messagebar-sheet-image>
      </f7-messagebar-sheet>
    </f7-messagebar>

    <f7-messages ref="messages">
        <div class="messages" v-for="(messages,index) in chat_messages" :key="index">
      <f7-messages-title><b>{{index}}</b></f7-messages-title>
      <f7-message
        v-for="(message, i) in messages"
        :key="i"
        :type="message.type"
        :image="message.image"
        :name="message.name"
        :avatar="message.avatar"
        :first="isFirstMessage(message, i)"
        :last="isLastMessage(message, i)"
        :tail="isTailMessage(message, i)"
      >
        <span slot="text" v-if="message.text" v-html="message.text"></span>
      </f7-message>
      <f7-message v-if="typingMessage"
        type="received"
        :typing="true"
        :first="true"
        :last="true"
        :tail="true"
        :header="`${typingMessage.name} is typing`"
        :avatar="typingMessage.avatar"
      ></f7-message></div>
    </f7-messages>
          <input type="file" ref="file" style="display:none;" @change="onFilePicked" multiple/>
  </f7-page>
</template>
<script>
  export default {
    data() {
      return {
        friend:null,
        attachments: [],
        sheetVisible: false,
        typingMessage: null,
        
        
      };
    },
    computed: {
        images(){
            return this.$store.getters.images
        },
        chat_messages(){
            return this.$store.getters.chat_messages
        },
      attachmentsVisible() {
        const self = this;
        return self.attachments.length > 0;
      },
      placeholder() {
        const self = this;
        return self.attachments.length > 0 ? 'Add comment or Send' : 'Message';
      },
    },
    mounted() {
      const self = this;
      self.$f7ready(() => {
        self.messagebar = self.$refs.messagebar.f7Messagebar;
        self.messages = self.$refs.messages.f7Messages;
      });
    },
    methods: {
        launchFilePicker(){
            this.$refs.file.click()
        },
        onFilePicked(){
            this.$store.dispatch('readFileMessage')
        },
      isFirstMessage(message, index) {
        const self = this;
        const previousMessage = self.chat_messages[index - 1];
        if (message.isTitle) return false;
        if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
        return false;
      },
      isLastMessage(message, index) {
        const self = this;
        const nextMessage = self.chat_messages[index + 1];
        if (message.isTitle) return false;
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
        return false;
      },
      isTailMessage(message, index) {
        const self = this;
        const nextMessage = self.chat_messages[index + 1];
        if (message.isTitle) return false;
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
        return false;
      },
      deleteAttachment(image) {
        const self = this;
        const index = self.attachments.indexOf(image);
        self.attachments.splice(index, 1)[0]; // eslint-disable-line
      },
      handleAttachment(e) {
        const self = this;
        const index = self.$$(e.target).parents('label.checkbox').index();
        const image = self.images[index];
        if (e.target.checked) {
          // Add to attachments
          self.attachments.unshift(image);
        } else {
          // Remove from attachments
          self.attachments.splice(self.attachments.indexOf(image), 1);
        }
      },
      sendMessage() {
        const self = this;
        const text = self.messagebar.getValue().replace(/\n/g, '<br>').trim();
        const messagesToSend = [];
        self.attachments.forEach((attachment) => {
          messagesToSend.push({
            image: attachment,
          });
        });
        if (text.trim().length) {
          messagesToSend.push({
            text,
          });
        }
        if (messagesToSend.length === 0) {
          return;
        }
        if(this.attachments.length>0){
            _.forEach(self.attachments,attachment =>{
                self.$store.dispatch('uploadChatImages',attachment).then(url=>{
                    self.$store.dispatch('sendMessage',{
                        friend:self.friend,
                        msg:text,
                        img:url
                    })
                })
            })
        }else{
            self.$store.dispatch('sendMessage',{
            friend:self.friend,
            msg:text,
            img:null
        })
        }
        
        // Reset attachments
        self.attachments = [];
        // Hide sheet
        self.sheetVisible = false;
        // Clear area
        self.messagebar.clear();
        // Focus area
        if (text.length) self.messagebar.focus();
        // Send message
        
      },
    },
    created(){
        let param = decodeURIComponent(this.$f7route.params.frd)
        this.friend=JSON.parse(param)
        this.$store.commit('setShowTabs',false)
        this.$store.dispatch('getChatMessages',this.friend)
    }
  };
</script>