<template>
    <div class="bg">
        <div class="centerbox">
            <Card>
                <Row>
	                <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="changelogin">
	                    <Menu-item name="1">
	                        登录
	                    </Menu-item>
	                    <Menu-item name="2">
	                        注册
	                    </Menu-item>
	                </Menu>
                </Row>
                <Row :gutter="16" class="oneput">
                    <Col :sm="24" :md="16">
	                	<Input v-model="name" placeholder="请输入昵称/手机号/邮箱" @on-blur="checkname">
					        <span slot="prepend"><Icon type="person"></Icon></span>
					    </Input>
				    </Col>
				    <Col :sm="24" :md="8" class="warn" :class="errname ? 'err':'noerr'">
				        {{errname ? errname : '昵称1~10个字符'}}
				    </Col>
                </Row>
                <Row :gutter="16" class="oneput">
                    <Col :sm="24" :md="16">
	                	<Input v-model="password" placeholder="请输入密码" type="password"  @on-blur="checkpassword">
					        <span slot="prepend"><Icon type="unlocked"></Icon></span>
					    </Input>
				    </Col>
				    <Col :sm="24" :md="8" class="warn" :class="errpassword ? 'err':'noerr'">
				        {{errpassword ? errpassword : '密码5~10个字母或数字'}}
				    </Col>
                </Row>
                <Row :gutter="16" class="oneput" v-show="!islogin">
                    <Col :sm="24" :md="16">
	                	<Input v-model="repassword" placeholder="请再次输入密码" type="password" @on-blur="checkrepassword">
					        <span slot="prepend"><Icon type="unlocked"></Icon></span>
					    </Input>
				    </Col>
				    <Col :sm="24" :md="8" class="warn" :class="errrepassword ? 'err':'noerr'">
				        {{ errrepassword ? errrepassword : '密码5~10个字母或数字'}}
				    </Col>
                </Row>
                <Row :gutter="16" class="oneput" v-show="verification">
                    <Col :sm="24" :md="16">
	                	<Input v-model="enterver" placeholder="请输入验证码">
					        <span slot="prepend"><Icon type="happy"></Icon></span>
					    </Input>
				    </Col>
				    <Col :sm="24" :md="8" class="warn">
				        警告提示
				    </Col>
                </Row>
                <Row :gutter="16" class="oneput">
                    <Col :sm="24" :md="16">
	                    <Button type="success" long @click="login">{{islogin ? '登录' : '注册'}}</Button>
				    </Col>
                </Row>
            </Card>
        </div>
    </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      loginname: '1',
      theme1: 'light',
      name: '',
      password: '',
      repassword: '',
      verificationNumber: '',
      islogin: true,
      enterver: '',
      verification: false,
      errname: false,
      errpassword: '',
      errrepassword: false,
      errverification: false
    }
  },
  watch: {
    password () {
      this.errpassword = checkpassword(this.password)
    },

    repassword () {
      this.errrepassword = checkpassword(this.repassword)
    }
  },
  methods: {
    changelogin (name) {
      if (this.loginname === name) {
        return
      }
      this.loginname = name
      this.islogin = !this.islogin
      this.name = ''
      this.password = ''
      this.repassword = ''
      this.verificationNumber = ''
      this.enterver = ''
      this.errname = false
      this.errpassword = ''
      this.errrepassword = ''
      this.errverification = false
    },
    checkrepassword () {
      if (this.repassword !== this.password) {
        this.errrepassword = '再次输入密码错误'
        return false
      }
      this.errrepassword = ''
      return true
    },
    checkpassword () {
      if (!this.checkpasslength()) return
      this.errpassword = checkpassword(this.password)
      if (this.errpassword === '') return true
      return false
    },
    checkpasslength () {
      if (checklength(this.password) < 5) {
        this.errpassword = '密码太短'
        return false
      }
      return true
    },
    checkname () {
      if (isemail(this.name)) {
        this.errname = ''
        return this.errname
      }
      if (isphonenummber(this.name)) {
        this.errname = ''
        return this.errname
      }
      if (checklength(this.name) > 1 && checklength(this.name) < 10) {
        this.errname = ''
        return this.errname
      }
      this.errname = '用户名格式错误'
      return this.errname
    },
    login () {
      if (this.checkname()) return
      if (!this.checkpassword()) return
      if (!this.checkpasslength()) return
      if (!this.islogin) {
        if (!this.checkrepassword()) return
        this.$http.post('/node/register', // 注册
          {
            name: this.name,
            password: this.password
          },
          {
            emulateJSON: true
          }).then(response => {
            if (response.body === '1') {
              this.$Message.success('注册成功!')
              this.$store.commit('setname', this.name)
              this.$router.replace({ path: '/' })
            }
            if (response.body === '2') this.$Message.error('注册失败!')
            if (response.body === '3') this.$Message.error('用户已存在!')
            if (response.body === '-1' || response.body === '-2') this.$Message.error('未知错误,请联系客服!')
          }, response => {
            console.log(response)
          })
      } else {
        this.$http.get('/node/login', // 登录
          {
            params: {
              name: this.name,
              password: this.password
            }
          }).then(response => {
            if (response.body === '1') {
              this.success('登录成功!')
              this.$router.replace({ path: '/' })
              this.$store.commit('setname', this.name)
            }
            if (response.body === '2') this.error('用户名或密码错误!')
            if (response.body === '-1' || response.body === '-2') this.error('未知错误,请联系客服!')
          }, response => {
            console.log(response)
          })
      }
    },
    success (msg) {
      this.$Message.success(msg)
    },
    error (err) {
      this.$Message.error(err)
    }
  }
}

function checkpassword (password) {
  let reg1 = new RegExp('[^a-zA-Z0-9]+', 'g')
  if (reg1.test(password)) return '密码有非法字符'
  if (checklength(password) > 8) return '密码过长'
  return ''
}

function delspace (str) {
  return str.replace(/\s+/g, '')
}

function checklength (str) {
  return delspace(str).length
}

function isphonenummber (str) {
  if (new RegExp('^[0-9]{11,11}$', 'g').test(delspace(str))) return true
  return false
}

function isemail (str) {
  if (new RegExp('^([a-zA-Z]+\\.)*([a-zA-Z0-9\\_]+)+\\@([a-zA-Z0-9]+\\.)+[a-zA-Z]+$', 'g').test(delspace(str))) return true
  return false
}
</script>
<style scoped>
.bg{
	position: relative;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
}

.centerbox{
	position: absolute;
	left: 50%;
	top: 50%;
	width: 90%;
	max-width: 500px;
	overflow: hidden;
	-webkit-transform: translate(-50%,-50%);
	-moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
	transform: translate(-50%,-50%);
}

i{
	font-size: 18px;
}

.oneput{
	padding-top: 16px;
}

.warn{
	font-size: 12px;
	padding-top: 10px;
}

.err{
	color:  #F92E63;
}

.noerr{
	color: #aaa;
}
</style>