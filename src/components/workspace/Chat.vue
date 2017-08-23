<template>
    <div class="content">
		<div class="workspace">
		    <div class="showbox">
		        <Row class="chatcontent">
		            <p v-for="msg in massage"><span>{{msg.name + '(' + msg.time + '):'}}</span>{{msg.content}}</p>
			    </Row>
			    <Row class="setbox" type="flex" justify="start" align="middle">
			        <Col span="1">
			        	<span><Icon type="image"></Icon></span>
			        </Col>
		        </Row>
		        <Row class="enterbox">
			        <textarea v-model="content" placeholder="200字以内"></textarea>
		        </Row>
		        <Row style="text-align:right" class="send">
		            <Button type="success" @click="send">发送</Button>
		            <Button type="warning" @click="clearcontent">清除</Button>
		        </Row>
		    </div>
		</div>
		<div class="chooseNav">
		</div>	
	</div>
</template>
<script>
export default {
  name: 'Chat',
  data () {
    return {
      content: '',
      massage: []
    }
  },
  methods: {
    clearcontent () {
      this.content = ''
    },
    send () {
      if (this.content === '') return
      let date = new Date()
      let time = date.toLocaleTimeString()
      this.$socket.emit('content', {
        name: this.$store.state.name,
        time: time,
        content: this.content
      })
    }
  },
  socket: {
    events: {
      msg (msg) {
        if (this.massage.length >= 100) {
          this.massage.shift()
        }
        this.massage.push(msg)
      }
    }
  }
}
</script>
<style scoped>
.content{
	position: relative;
	width: 100%;
	height: 100%;
	padding: 10px;
	background: #464c5b;
	border-radius: 4px;
	overflow:hidden;
}

.showbox{
	width: 100%;
	height: 100%;
	position: relative;
}

.workspace{
	position: relative;
	width: 100%;
	height: 100%;
	padding-right: 200px;
}
.chooseNav{
	position: absolute;
	padding: 10px;
	right: 0;
	top: 0;
	width: 210px;
	height: 100%;
}

.setbox{
	font-size: 20px;
	color: #fff;
}

.setbox i{
   cursor: pointer;
}

.send button{
	margin-top: 5px;
	margin-left: 5px;
}
.chatcontent{
	width: 100%;
	background-color: #eee;
	border-radius: 4px;
	height: calc(100% - 180px);
	box-shadow: 1px 1px 10px 1px rgba(0,0,0,0.5) inset;
	overflow-y: auto;
}

.chatcontent p{
	padding: 4px 15px;
	word-wrap:break-word; 
    word-break:break-all; 
	font-size: 14px;
	width: 100%;
}

.setbox{
	width: 100%;
	height: 60px;
}

.enterbox{
	width: 100%;
	height: 80px;
	border-radius: 4px;
	overflow: hidden;
	background-color: #eee;
	border-radius: 4px;
	box-shadow: 1px 1px 5px 1px rgba(0,0,0,0.5) inset;
}

textarea{
	width: 100%;
	height: 100%;
	resize: none;
	text-align: justify;
	font-size: 14px;
	letter-spacing: 1px;
	line-height: 20px;
	padding: 5px;
}
</style>