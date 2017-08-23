<template>
	<div class="content">
		<div class="workspace">
		    <div id="canvasbox1">
		        <canvas id="canvas1"></canvas>
		    </div>
		</div>
		<div class="chooseNav">
		    <Card :bordered="false" style="margin-top: 0" class="onecard">
	            <div slot="title">画笔样式设置</div>
	            <div>
	                <Row type="flex" align="middle">
	                   颜色:&nbsp<Icon type="android-checkbox-blank" :style="{ color: activeColor}"></Icon>
	                </Row>
	                <Row type="flex" align="middle">
		                <Col span="4">R:</Col>
		                <Col span="20">
		                   <Slider class="red" v-model="color.r" :step="1" :min="0" :max="255">
		                </Slider>
		               </Col>
	               </Row>
	               <Row type="flex" align="middle">
		                <Col span="4">G:</Col>
		                <Col span="20"><Slider class="green" v-model="color.g" :step="1" :min="0" :max="255"></Slider>
		                </Col>
	               </Row>
	               <Row type="flex" align="middle">
		               <Col span="4">B:</Col>
		               <Col span="20"><Slider class="blue" v-model="color.b" :step="1" :min="0" :max="255"></Slider>
		               </Col>
	               </Row>
	               <Row type="flex" align="middle">
		               <Col span="4">A:</Col>
		               <Col span="16"><Slider v-model="color.a" :step="1" :min="0" :max="100"></Slider>
		               </Col>
		               <Col span="3" offset="1">%</Col>
	               </Row>
	               <Row type="flex" align="middle">
		            大小:&nbsp<Input-number size="small" class="linwidth" :max="300" :min="1" v-model="lineWidth"></Input-number>
		            </Row>
	            </div>
	        </Card>
	        <Card :bordered="false" class="onecard">
	            <div slot="title">基本操作</div>
	            <div><Button type="warning" @click="clearCanvas">清理画布</Button><Button type="info" @click="goback">后退</Button><Button type="success" @click="save">保存</Button><Button type="error" @click="clearSave">清理缓存</Button></div>
	        </Card>
		</div>	
	</div>
</template>
<script>
export default {
  name: 'Drawing',
  data () {
    return {
      isDrawing: false,
      canvasContext: null,
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 100
      },
      lineWidth: 4
    }
  },
  computed: {
    activeColor () {
      return 'rgba(' + [this.color.r, this.color.g, this.color.b, this.color.a / 100].join(',') + ')'
    }
  },
  watch: {
    color: {
      handler: function () {
        this.canvasContext.setColor('rgba(' + [this.color.r, this.color.g, this.color.b, this.color.a / 100].join(',') + ')')
      },
      deep: true
    },
    lineWidth () {
      this.canvasContext.setLineWidth(this.lineWidth)
    }
  },
  methods: {
    clearCanvas () {
      this.canvasContext.clear()
    },
    save () {
      return
      /* this.canvasContext.saveCanvas() */
    },
    clearSave () {
      this.canvasContext.clearSave()
    },
    goback () {
      this.canvasContext.goback()
    }
  },
  mounted () {
    this.canvasContext = new Canvas()
    this.canvasContext.setObj()
    this.canvasContext.init()
  }
}

function Canvas () {
  this.bgcolor = '#fff'
  this.obj = null
  this.context = null
  this.offsetTop = 0
  this.offsetLeft = 0
  this.color = 'rgba(0,0,0,1)'
  this.lineWidth = 4
  this.start = false
  this.save = []
}

Canvas.prototype = {
  setObj () {
    this.obj = document.getElementById('canvas1')
    this.context = this.obj.getContext('2d')
    this.addEvent()
  },
  init () {
    this.obj.width = document.getElementById('canvasbox1').offsetWidth
    this.obj.height = document.getElementById('canvasbox1').offsetHeight
    this.offsetTop = -this.obj.getBoundingClientRect().top
    this.offsetLeft = -this.obj.getBoundingClientRect().left
    this.setStyle()
  },
  setStyle () {
    this.context.lineWidth = this.lineWidth
    this.context.strokeStyle = this.color
    this.context.lineJoin = 'round'
    this.context.lineCap = 'round'
  },
  setLineWidth (width) {
    this.lineWidth = width
    this.context.lineWidth = this.lineWidth
  },
  setColor (color) {
    this.color = color
    this.context.strokeStyle = this.color
  },
  clear () {
    this.context.clearRect(0, 0, this.obj.width, this.obj.height)
  },
  clearSave () {
    this.save = []
  },
  saveCanvas () {
    let image = new Image()
    image.src = this.obj.toDataURL('image/png')
    this.save.push(image)
  },
  goback () {
    if (this.save.length <= 0) return this.clear()
    if (this.save.length > 0 && this.save.length <= 1) {
      this.save.pop()
      return this.clear()
    }
    this.save.pop()
    let image = this.save[this.save.length - 1]
    this.clear()
    this.context.drawImage(image, 0, 0)
  },
  drawStart (startX, startY) {
    this.context.save()
    this.context.fillStyle = this.color
    this.context.beginPath()
    this.context.arc(startX, startY, this.lineWidth / 2, 0, Math.PI * 2, true)
    this.context.closePath()
    this.context.fill()
    this.context.beginPath()
    this.context.moveTo(startX, startY)
  },
  drawMove (moveX, moveY) {
    this.context.lineTo(moveX, moveY)
    this.context.closePath()
    this.context.stroke()
    this.context.beginPath()
    this.context.moveTo(moveX, moveY)
  },
  drawEnd (endX, endY) {
    this.context.restore()
  },
  addEvent () {
    this.obj.addEventListener('mousedown', (e) => {
      this.start = true
      this.drawStart(e.clientX + this.offsetLeft, e.clientY + this.offsetTop)
    })
    this.obj.addEventListener('mouseup', () => {
      this.start = false
      this.drawEnd()
      this.saveCanvas()
    })
    this.obj.addEventListener('mouseleave', () => {
      this.start = false
      this.drawEnd()
    })
    this.obj.addEventListener('mousemove', (e) => {
      if (!this.start) return
      this.drawMove(e.clientX + this.offsetLeft, e.clientY + this.offsetTop)
    })

    window.onresize = () => {
      this.offsetTop = -this.obj.getBoundingClientRect().top
      this.offsetLeft = -this.obj.getBoundingClientRect().left
      if (this.save.length <= 0) return
      this.clear()
      let image = this.save[this.save.length - 1]
      this.context.drawImage(image, 0, 0)
    }

    window.onscroll = () => {
      this.offsetTop = -this.obj.getBoundingClientRect().top
      this.offsetLeft = -this.obj.getBoundingClientRect().left
    }
  }
}

/* function getOffsetLeft (obj) {
  var tmp = obj.offsetLeft
  var val = obj.offsetParent
  while (val != null) {
    tmp += val.offsetLeft
    val = val.offsetParent
  }
  return tmp
} */

/* function getOffsetTop (obj) {
  var tmp = obj.offsetTop
  var val = obj.offsetParent
  while (val != null) {
    tmp += val.offsetTop
    val = val.offsetParent
  }
  return tmp
} */

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

.workspace{
	position: relative;
	width: 100%;
	height: 100%;
	padding-right: 200px;
}

#canvasbox1{
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 4px;
	overflow:hidden;
	background-color: #fafafa;
}

#canvas{
	width: 100%;
	height: 100%;
}

.chooseNav{
	position: absolute;
	padding: 10px;
	right: 0;
	top: 0;
	width: 210px;
	height: 100%;
}	

.onecard{
	margin-top: 10px;
}

.linwidth{
	width: 60px;
}

button{
	margin: 5px;
}
</style>