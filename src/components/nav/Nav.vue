<template>
    <Menu active-name="my-draw" theme="dark" width="auto" :open-names="['1']" @on-select="changeWorkspace">
        <div class="layout-logo">
            <div>
               <p><img src="../../../static/login.png" height="60" width="60"></p>
               <p>{{name ? name : '未登录'}}</p>
            </div>
        </div>
        <Submenu name="1">
            <template slot="title">
                <Icon type="network"></Icon>
                功能
            </template>
            <Menu-item name="my-draw">画图板</Menu-item>
            <Menu-item name="my-image">图片处理</Menu-item>
            <Menu-item name="my-chat">聊天室</Menu-item>
        </Submenu>
        <Submenu name="2">
            <template slot="title">
                <Icon type="bag"></Icon>
                作品
            </template>
            <Menu-item name="my-nodone">未完成</Menu-item>
            <Menu-item name="my-done">已完成</Menu-item>
        </Submenu>
        <Submenu name="3">
            <template slot="title">
                <Icon type="gear-a"></Icon>
                设置
            </template>
            <Menu-item name="3-1">账户密码</Menu-item>
            <Menu-item name="3-2"><span>注销</span></Menu-item>
        </Submenu>
    </Menu>
</template>

<script>
export default {
  name: 'Nav',
  data () {
    return {
      theme2: 'dark',
      islogin: false
    }
  },
  computed: {
    name () {
      if (!this.$store.state.name) {
        this.gologin()
      }
      return this.$store.state.name
    }
  },
  methods: {
    changeWorkspace (name) {
      this.$emit('changeworkspace', name)
    },
    gologin () {
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.layout-logo{
    color: #fff;
    width: 100%;
    text-align: center;
    text-align: center;
    padding: 10px 0px;
    border-bottom: 1px solid #2d8cf0!important;
}
</style>
