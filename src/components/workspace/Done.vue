<template>
	<div class="content">
	    <Row :gutter="10">
	    	<Col :sm="24" :md="6" style="margin-bottom: 10px;" v-for="img in imgarr">
	    	    <Card>
		            <p slot="title">{{img.imgname}}</p>
		            <p class="imgbox"><img :src="img.img" style="width:100%"></p>
		            <p></p>
		        </Card>
	    	</Col>
	    </Row>
	</div>
</template>
<script>
export default {
  name: 'Nodone',
  data () {
    return {
      isopen: false,
      imgarr: []
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
        if (response.body !== null) {
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