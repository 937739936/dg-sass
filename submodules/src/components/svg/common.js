
export const create = function ({initWidth=10,initHeight=10,initColor="var(--primary-color)"}){
  return {
    props:{
      color:{
        type:String,
        default(){
          return initColor
        }
      },
      size:{
        type:Array,
        default(){
          return [initWidth,initHeight]
        }
      }
    },
    data(){
      let [width,height] = this.size;
      height = height??width
      return {
        style:`transform: scale(${width / initWidth},${height / initHeight})`
      }
    }
  }
}