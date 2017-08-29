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
	                    <Input placeholder="请输入房间名" v-model="search"><span slot="append" style="cursor: pointer" @click="joinroom">添加</span></Input>		               
                    </Row>
                    <Menu theme="dark" active-name="公共聊天室" @on-select="changeroom">
                        <Menu-item name="公共聊天室">
				            <Icon type="person-stalker" ></Icon>公共聊天室
				        </Menu-item>
				        <Menu-item v-for="(room, index) in allroom" :name="room.name" class="oneroom">
				           <Icon type="person"></Icon>{{room.name + '(' + room.count + ')'}}
				           <div class="closebut" @click.stop="deletroom(index)"><Icon type="close-round"></Icon></div>
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
import un from 'underscore'
export default {
  name: 'Chat',
  data () {
    return {
      content: '',
      roomname: '',
      search: '',
      massage: [],
      actionroom: '公共聊天室',
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
    joinroom () {
      if (checklength(this.search) <= 0) {
        this.$Message.error('房间名不能为空!')
        return
      }
      this.$socket.emit('joinroom', delspace(this.search))
    },
    deletroom (index) {
      this.allroom.splice(index, 1)
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
        count: 0
      })
    }
  },
  socket: {
    events: {
      addroom (msg) {
        if (isin(this.allroom, msg)) {
          this.$Notice.open({
            title: '本地通知',
            desc: '房间已存在!',
            duration: 1
          })
          return
        }
        this.allroom.push(msg)
      },
      msg (msg) {
        if (this.massage.length >= 100) {
          this.massage.shift()
        }
        this.massage.push(msg)
      },
      systemmsg (msg) {
        this.$Notice.open({
          title: '系统通知',
          desc: msg,
          duration: 1
        })
      }
    }
  },
  beforeMount () {
    this.$socket.emit('login')
  }
}

function delspace (str) {
  return str.replace(/\s+/g, '')
}

function checklength (str) {
  return delspace(str).length
}

function isin (arr, ele) {
  return un.some(arr, ele)
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

.closebut{
	position: absolute;
	top: 50%;
	right: 60px;
	-webkit-transform: translate(0,-50%);
	-moz-transform: translate(0,-50%);
	-ms-transform: translate(0,-50%);
	-o-transform: translate(0,-50%);
	transform: translate(0,-50%);
}

.oneroom{
	position: relative;
}

.oneroom:hover .closebut{
	display: block;
}
</style>