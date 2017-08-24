<template>
    <div class="content">
		<div class="workspace">
		    <div class="showbox">
		        <Row class="chatcontent">
		            <p v-for="msg in massage">
			            <span :class="msg.name === ismyname ? 'mysef' : ''">
			                {{msg.name + '(' + msg.time + '):'}}
			            </span>
			            <img v-if="msg.type === 'image'" :src="msg.content" align="top">
			            <span v-else-if="msg.type === 'string'">
			                {{msg.content}}
			            </span>
		            </p>
			    </Row>
			    <Row class="setbox">
			        <span class="imagebox"><Icon type="image"></Icon><input type="file" accept="image/*" @change="msgimg"></span>			        
		        </Row>
		        <Row class="enterbox">
			        <textarea v-model="content" placeholder="200字以内"></textarea>
		        </Row>
		        <Row style="text-align:right" class="send">
		            <Button type="success" @click="send">发送</Button>
		            <Button type="warning" @click="clearcontent">清除</Button>
		        </Row>
		        <div class="room">{{actionroom}}</div>
		    </div>
		</div>
		<div class="chooseNav">
		    <Row>
		        <Card :bordered="false"  dis-hover>
	            <p slot="title">房间</p>
	            <div class="roombox">
	                <Row class="searchbox">
	                    <Input placeholder="请输入房间名" v-model="search"><Button slot="append" icon="ios-search-strong"></Button></Input>		               
                    </Row>
                    <Menu theme="dark" active-name="1" @on-select="changeroom" :open-names="['公共聊天室']">
				        <Menu-item v-for="room in allroom" :name="room.name">
				            <Icon type="person-stalker" v-if="room.name === '公共聊天室'"></Icon><Icon type="person" v-else></Icon>{{room.name + '(' + room.count + ')'}}
				        </Menu-item>
				    </Menu>
	            </div>
                </Card>
                <Collapse accordion>
                    <Panel>
			            创建房间
			            <p slot="content">
			                <Row>
			                    <Input v-model="roomname" placeholder="请输入房间名"></Input>		               
	                        </Row>
	                        <Row>
	                            <Button style="margin-top: 10px;" type="success" @click="add" long>创建</Button>
	                        </Row>
	                    </p>
		            </Panel>
		        </Collapse>
        </Panel>
		    </Row>
		</div>	
	</div>
</template>
<script>
export default {
  name: 'Chat',
  data () {
    return {
      content: '',
      roomname: '',
      search: '',
      massage: [],
      actionroom: '',
      allroom: []
    }
  },
  computed: {
    ismyname () {
      return this.$store.state.name
    }
  },
  methods: {
    clearcontent () {
      this.content = ''
    },
    changeroom (name) {
      this.actionroom = name
    },
    msgimg (e) {
      let reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = (event) => {
        this.$socket.emit('content', {
          name: this.$store.state.name,
          type: 'image',
          time: new Date().toLocaleTimeString(),
          content: event.target.result
        })
        e.target.value = ''
      }
    },
    send () {
      if (this.content === '') return
      this.$socket.emit('content', {
        name: this.$store.state.name,
        type: 'string',
        time: new Date().toLocaleTimeString(),
        content: this.content
      })
      this.content = ''
    },
    add () {
      this.$socket.emit('addroom', {
        name: this.roomname,
        count: 1
      })
    }
  },
  socket: {
    events: {
      updateallroom (msg) {
        this.allroom = msg
      },
      msg (msg) {
        if (this.massage.length >= 100) {
          this.massage.shift()
        }
        this.massage.push(msg)
      },
      roomfull (msg) {
        this.$Notice.open({
          title: '系统通知',
          desc: msg
        })
      }
    }
  },
  mounted () {
    this.$socket.emit('login')
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

.chatcontent{
	padding: 10px;
}

.chatcontent p{
	font-size: 14px;
	padding: 2px 0;
}

.chatcontent p img{
	max-width: 400px;
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

.setbox>*{
	
	
}

.imagebox{
	cursor: pointer;
	display: inline-block;
	
	position: relative;
}

.imagebox input{
	position: absolute;
	display: inline-block;
	font-size: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	cursor: pointer;
	z-index: 9999;
	left: 0;
	top: 0;
}

.mysef{
	color: #19be6b;
}

.setbox i{
   cursor: pointer;
}

.searchbox{
	margin-bottom: 10px;
}

.send button{
	margin-top: 5px;
	margin-left: 5px;
}
.chatcontent{
	position: relative;
	width: 100%;
	background-color: #eee;
	border-radius: 4px;
	height: calc(100% - 180px);
	box-shadow: 1px 1px 10px 1px rgba(0,0,0,0.5) inset;
	overflow-y: auto;
}

.room{
	position: absolute;
	top: 20px;
	right: 20px;
	font-size: 20px;
}


.setbox{
	width: 100%;
	height: 60px;
}

.roombox{
	position: relative;
	width: 100%;
}

.roombox i{
	font-size: 18px;
}

.roombox p{
   font-size: 14px;
   padding: 3px 6px;
   margin: 2px 0;
   border-radius: 4px;
   background-color: #464c5b;
   color: #fff;
   cursor: pointer;
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

.ivu-card{
	border-radius: 4px 4px 0 0;
}

.ivu-collapse{
	border-radius: 0 0 4px 4px;
}

.ivu-menu-item{
	padding: 10px 16px;
}
</style>