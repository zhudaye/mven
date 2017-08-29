<template>
	<div class="content">
	    <Row :gutter="10">
	    	<Col :sm="24" :md="6" style="margin-bottom: 10px;" v-for="(img,index) in imgarr">
	    	    <Card>
		            <p slot="title">{{img.imgname}}</p>
		            <p class="imgbox"><img :src="img.img" style="width:100%"></p>
		            <p style="border-top: 1px solid rgb(233, 234, 236);padding-top: 16px;"><Button type="warning" @click="delet(index)">删除</Button><Button type="info" style="float: right" @click="show(index)">查看</Button></p>
		        </Card>
	    	</Col>
	    </Row>
      <Modal
        v-model="modal1"
        :title="showimg ? showimg.imgname : ''" 
        ok-text="退出"
        cancel-text=""
        width="750px"
        class-name="vertical-center-modal">
        <p><img :src="showimg ? showimg.img : ''" style="width:100%; border: 1px solid rgb(233, 234, 236);"></p>
     </Modal>
     <Modal
	</div>
</template>
<script>
export default {
  name: 'Nodone',
  data () {
    return {
      isopen: false,
      imgarr: [],
      modal1: false,
      showimg: null
    }
  },
  methods: {
    delet (index) {
      this.$Modal.confirm({
        title: '本地消息',
        content: '<p>确认删除' + this.imgarr[index].imgname + '?',
        loading: true,
        onOk: () => {
          this.$http.post('/node/removeimg', // 删除图片
            {
              username: this.$store.state.name,
              imgname: this.imgarr[index].imgname
            },
            {
              emulateJSON: true
            }).then(response => {
              if (response.body === '1') {
                this.$Message.success('删除成功!')
                this.imgarr.splice(index, 1)
              }
              if (response.body === '-1' || response.body === '-2') {
                this.$Message.error('未知错误,请联系客服!')
              }
              this.$Modal.remove()
            }, response => {
              console.log(response)
            })
        }
      })
    },
    show (index) {
      this.showimg = this.imgarr[index]
      this.modal1 = true
    }
  },
  activated () {
    this.$http.get('/node/getimg',
      {
        params: {
          username: this.$store.state.name,
          type: 'done'
        }
      }).then(response => {
        if (response.body === '2') this.$Message.error('没有作品!')
        if (response.body === '-1' || response.body === '-2') this.$Message.error('未知错误,请联系客服!')
        if (response.body !== null && response.body !== '2') {
          this.imgarr = response.body
        }
      }, response => {
        console.log(response)
      })
  }
}
</script>
<style scoped>
.content{
	width: 100%;
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
}

.imgbox{
	width: 100%;
	overflow:hidden;
}

@media screen and (min-width: 1000px) {
   .imgbox {
        height: 180px;
    }
}
</style>