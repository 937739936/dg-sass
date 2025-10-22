<template>
	<div :style="{maxWidth:maxWidth+'px', ...styleContent}" class="textOverflow">
		<span v-if="!isOver" :class="'spanItem'+content" v-html="content" @click="clickFunc"></span>
		<a-tooltip v-else :placement="placement" overlayClassName="text-over-flow-tooltip">
			<template slot="title">
				<span v-html="content"></span>
			</template>
			<span class="spanItem" v-html="content" @click="clickFunc"></span>
		</a-tooltip>
	</div>
</template>

<script>
	export default {
		props:{
			content:{ //标题内容
				default:''
			},
			maxWidth:{//最大显示宽度
				type:Number,
				default:0
			},
			placement:{//提示位置
				type:String,
				default:'topLeft'
			},
			styleContent:{
				type:Object,
				default:()=>{return {}}
			}
		},
		data(){
			return {
				isOver:false, //是不是超出指定宽度
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
				let dom = document.getElementsByClassName('spanItem'+this.content)[0]
				if(dom?.offsetWidth >=parseInt(this.maxWidth)){
					this.isOver = true;
				}else{
					this.isOver = false;
				}
			},
			clickFunc() {
				this.$emit('clickFunc')
			}
		}
	}
</script>
<style lang='less' scoped="scoped">
	.textOverflow{
		position: absolute;
		left: 70px;
		top:0;
		cursor: pointer;
		text-overflow: ellipsis; 
		overflow: hidden; 
		white-space: nowrap;
	}
</style>
<style lang='less'>
	.text-over-flow-tooltip{
		.ant-tooltip-inner {
			word-break: break-all;
		}
	}
</style>


