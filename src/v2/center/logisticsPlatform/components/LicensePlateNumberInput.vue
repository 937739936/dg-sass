<template>
    <div>
        <a-input
            autocomplete="off"
            ref="carPlateNumberInput"
            style="width:170px;"
            placeholder="请输入车牌号"
            :value="value" 
            @input="inputChange"
            @blur="columnItemChange"
        >
            <div slot="suffix">
                <a-popover placement="right">
                <template slot="content">
                    <div class="vector"> 
                        <ul>
                            <li v-for="item in S.split('')" :key="item" @click="carPlateNumberEnter(item)">{{item}}</li>
                        </ul>
                        <ul>
                            <li v-for="item in N.split('')" :key="item" @click="carPlateNumberEnter(item)">{{item}}</li>
                        </ul>
                        <ul>
                            <li v-for="item in Z.split('')" :key="item" @click="carPlateNumberEnter(item)">{{item}}</li>
                        </ul>
                        <img src="~@/v2/assets/imgs/receive/delete.png" alt="" class="delete-item" @click="carPlateNumberDelEnter()">
                    </div>
                </template>
                <img src="~@/v2/assets/imgs/logisticsPlatform/licensePlateNumber.png" alt="" style="width: 15px;">
                </a-popover>
            </div>
        </a-input>
    </div>
</template>

<script>
let S = "京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领"
let N = "0123456789"
let Z = "ABCDEFGHJKLMNPQRSTUVWXYZ"
export default {
    name: "LicensePlateNumberInput",
    props: {
        value: String,
    },
    data() {
        return {
            S,
            N,
            Z,// 车牌号
            inputValue: '',
        }
    },
    mounted() {
        this.inputValue = this.value
    },
    methods: {
        inputChange(e) {
            this.plateNumberChange(e.target.value);
        },
        carPlateNumberEnter(item){
            let newValue = this.value ? `${this.value}${item}` : item
            this.plateNumberChange(newValue);
        },
        carPlateNumberDelEnter(){
            if(this.value) {
                let newValue = this.value.slice(0,(this.value.length)-1)
                this.plateNumberChange(newValue);
            }
        },
        columnItemChange() {
            this.$emit("columnItemChange");
        },
        plateNumberChange(newValue) {
            this.$emit("input", newValue);
            this.$emit("columnItemChange");
        },

    },
}
</script>

<style lang="less" scoped>
.vector{
  width: 268px;
  height: 410px;
  position: relative;
  color:#000000CC;
  ul{
    display: flex;
    flex-wrap: wrap;
    li{
      margin-right: 16px;
      width: 24px;
      height: 24px;
      font-size: 14px;
      line-height: 24px;
      cursor: pointer;
      border-radius: 4px;
      text-align: center;
      margin-bottom: 14px;
      &:nth-child(7n+7){
        margin-right: 0;
      }
      &:hover{
        background-color: @primary-color;
        color: #ffffff;
      }
    }
  }
  .delete-item{
    height: 12px;
    position: absolute;
    right: 11px;
    bottom: 11px;
    cursor: pointer;
  }
  .status {
    padding: 3px 5px;
    height: 20px;
    line-height: 20px;
    border-radius: 4px;
    font-size: 14px;
    zoom: 0.85;
  }
  .ARRIVED{
    background: #C5ECDD;
    color: #3EB384;
  }
  .UNARRIVED{
    background: #C9DAFF;
    color: #596FA0;
  }
  .PARTARRIVED{
    background: #C1D7FF;
    color: #4682F3;
  }
}

</style>