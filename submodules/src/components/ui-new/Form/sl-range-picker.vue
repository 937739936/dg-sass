<template>
  <div class="form-date">
    <div>{{addonBeforeTitle}}</div>
     <a-range-picker
      :class="value ? 'range special':'range'"
      :value='value'
      v-bind="$attrsAll"
      v-on="$listenersAll"
      ref="picker"
      @change="changeDate"
      :getCalendarContainer="getCalendarContainer()"
      :placeholder="['开始时间  ～  结束时间']"
      :allowClear="false"
    >
      <Calendar slot="suffixIcon"></Calendar>
       <div slot="renderExtraFooter" v-if="$attrsAll.extraFooter !== false">
         <a-space :size="24" class="picker-btn">
           <span @click="pickerTime(1)">今日</span>
           <span @click="pickerTime(-1)">昨日</span>
           <span @click="pickerTime(7)">近七日</span>
           <span @click="pickerTime(30)">近一月</span>
         </a-space>
       </div>
    </a-range-picker>
  </div>
</template>

<script>
import moment from 'moment'
import {Calendar} from "../../svg"
export default {
  components:{
    Calendar
  },
  props: {
    addonBeforeTitle:{
      type:String,
      default:() => ""
    },
    value: {
      type:Array,
    },
    rangesFormat:{
      type:String,
      default:() => "YYYY-MM-DD"
    }
  },
  data() {
    return {}
  },
  computed: {
    $attrsAll() {
      return {
        value: this.value,
        ...this.$attrs,
      }
    },
    $listenersAll() {
      return Object.assign({}, this.$listeners)
    }
  },
  mounted() {
  },
  methods: {
    changeDate(value) {
      this.$emit('input', value)
    },
    getCalendarContainer() {
      return triggerNode=>triggerNode.parentNode
    },
    pickerTime(mark) {
      let t = moment().day(moment().day()).format(this.rangesFormat) //今天
      let y = moment().day(moment().day() - 1).format(this.rangesFormat) //昨天
      let w = moment().day(moment().day() - 6).format(this.rangesFormat) //近一周
      let m = moment().subtract(1, 'months').format(this.rangesFormat) //近一月
      switch (mark) {
        case 1:
          this.$refs.picker.$refs.picker.sOpen = false
          this.changeDate([t, t])
          this.$emit('change',[t,t])
          break;
        case -1:
          this.$refs.picker.$refs.picker.sOpen = false
          this.changeDate([y, y])
          this.$emit('change',[y,y])
          break;
        case 7:
          this.$refs.picker.$refs.picker.sOpen = false
          this.changeDate([w, t])
          this.$emit('change',[w,t])
          break;
        case 30:
          this.$refs.picker.$refs.picker.sOpen = false
          this.changeDate([m, t])
          this.$emit('change',[m,t])
          break;
      }
      }
    },

}
</script>

<style scoped lang='less'>
.form-date:hover {
  border-color: #CED1DD;
}
.form-date.focus {
  border-color: @primary-color;
}
.form-date {
  display: flex;
  align-items: center;
  background: #fff;
  padding-left: 12px;
  border-radius: 4px;
  color: rgba(0,0,0,0.4);
  border: 1px solid #E5E6EB;
  height: 34px;
  .range {
    height: 100%;
    flex: 1;
    position: relative;
    ::v-deep.ant-calendar-picker-input {
      padding-left: 0;
      border: 0;
      .ant-calendar-range-picker-input:first-child {
        width: 100%!important;
        padding-left: 12px;
      }
      .ant-calendar-range-picker-input:nth-child(3) {
        width: 0!important;
      }
      .ant-calendar-range-picker-separator {
        width: 0!important;
        min-width: 0!important;
        display: none!important;
      }
    }
    &.special {
      ::v-deep{
        .ant-calendar-picker-input {
          .ant-calendar-range-picker-input {
            width: 45%!important;
          }
          .ant-calendar-range-picker-separator {
            width: 6%!important;
            min-width: 6%!important;
            display: inline-block!important;
          }
        }
      }
    }
    
  }
  ::v-deep.ant-calendar-picker:focus .ant-calendar-picker-input:not(.ant-input-disabled) {
    border: none;
    box-shadow: none;
  }
  ::v-deep.ant-calendar-input-wrap {
    display: none!important;
  }
  
  ::v-deep .anticon-close-circle {
    font-size: 16px;
  }
  
  
  // @media screen and (max-width: 1440px)  {
  //   .range {
  //     ::v-deep.ant-calendar-picker-input {
  //       // padding: 0 26px 0 12px!important;
  //     }
  //   }
  //   .range.special {
  //     ::v-deep.ant-calendar-picker-input {
  //       .ant-calendar-range-picker-input:first-child {
  //         width: 52%!important;
  //       }
  //       .ant-calendar-range-picker-input:nth-child(3) {
  //         width: 38%!important;
  //         overflow: hidden;
  //         text-overflow: ellipsis;
  //         white-space: nowrap;
  //       }
  //     }
  //   }
  //   ::v-deep .ant-calendar-range-picker-separator {
  //     width: 6%!important;
  //     min-width: 6%!important;
  //   }
  // }
  // @media screen and (min-width: 1920px)  {
  //   .range.special {
  //     ::v-deep.ant-calendar-picker-input {
  //       .ant-calendar-range-picker-input:nth-child(3) {
  //         padding-left: 12px!important;
  //       }
  //     }
  //   }
  // }

  @media screen and (max-width: 1560px)  {
    .range.special {
      ::v-deep.ant-calendar-picker-input {
        padding-left: 1px;
        padding-right: 1px;
        .ant-calendar-range-picker-input:first-child {
          padding-left: 1px;
          text-align: center!important;
        }
      }
      ::v-deep.ant-calendar-picker-clear, .ant-calendar-picker-icon {
        right: 3px;
      }
    }
  }
  @media screen and (max-width: 1440px)  {
    .range.special {
      ::v-deep.ant-calendar-picker-input {
        padding-left: 0px;
        padding-right: 0px;
        .ant-calendar-range-picker-input:first-child {
          padding-left: 0px;
          text-align: center!important;
        }
        svg {
          display: none;
        }
      }
    }
  }
}
::v-deep .ant-calendar-picker-icon {
  cursor: pointer;
}
::v-deep .ant-calendar-range-picker-separator {
  line-height: 30px;
}
::v-deep.ant-calendar-range-picker-input {
  text-align: left!important;
}
  ::v-deep .ant-input-group-addon {
    border: 0;
    background: #fff;
  }
  ::v-deep .ant-input {
    border: none !important;;
    background: #fff;
    height: 32px;
    padding: 0 12px;
    &:focus {
      border: none;
      box-shadow: none;
    }
  }
  input::-webkit-input-placeholder {
    color:rgba(0,0,0,0.25);
  }
  input::-moz-placeholder {
    color:rgba(0,0,0,0.25);
  }
  input:-ms-input-placeholder{
    color:rgba(0,0,0,0.25);
  }
  input::placeholder{
    color:rgba(0,0,0,0.25);
  }

.picker-btn{
  span{
    cursor: pointer;
    color:@primary-color;
  }
}

</style>
