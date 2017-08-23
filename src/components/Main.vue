<template>
    <div class="layout">
        <Row type="flex" class="laycontent">
            <i-col span="4" class="layout-menu-left">
                <my-nav @changeworkspace="changeWorkspace"></my-nav>
            </i-col>
            <i-col span="20">
                <div class="layout-header"></div>
                <div class="layout-content">
                    <div class="layout-content-main">
                    <transition name="slide-fade">
                        <keep-alive>
                            <component :is="currentView">
                            </component>
                        </keep-alive>
                    </transition>
                    </div>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
import mynav from './nav/Nav'
import drawing from './workspace/Drawing'
import chat from './workspace/Chat'
export default {
  name: 'main',
  data () {
    return {
      theme2: 'dark',
      islogin: false,
      currentView: 'my-draw'
    }
  },
  components: {
    'my-nav': mynav,
    'my-draw': drawing,
    'my-chat': chat
  },
  methods: {
    changeWorkspace (name) {
      this.currentView = name
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    height: 100%;
}

.laycontent{
	height: 100%;
}

.layout-breadcrumb{
    padding: 10px 15px 0;
}
.layout-content{
    height: calc(100% - 60px);
    overflow: hidden;
    padding: 15px;
    border-radius: 4px;
}
.layout-content-main{
    background: #fff;
    height: 100%;
}
.layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
}
.layout-menu-left{
    background: #464c5b;
}
.layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
}

.slide-fade-enter-active {
  transition: all .2s .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>
