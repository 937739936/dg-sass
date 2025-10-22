<template>
    <a-modal :visible="visible" title="字段排序选择" width="776px" @cancel="cancel" cancelText="取消" okText="保存" class="sortBody" @ok="handleOk">
        <p>已选字段</p>
        <div class="selectedBox">
            <draggable class="list-group" element="ul" v-model="selectedList" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
                <transition-group type="transition" :name="'flip-list'">
                    <li class="list-group-item" v-for="element in selectedList" :key="element.key">
                        {{element.title}}
                        <a-icon type="check" />
                    </li>
                </transition-group>
            </draggable>
        </div>
        <p style="margin-top:15px;">待选择字段</p>
        <div class="unselectedBox">
            <draggable element="span" v-model="unselectedList" :options="dragOptions" :move="onMove">
                <transition-group name="no" class="list-group" tag="ul">
                    <li class="list-group-item" v-for="element in unselectedList" :key="element.key">
                        {{element.title}}
                    </li>
                </transition-group>
            </draggable>
        </div>
    </a-modal>
  </template>
  
  <script>
  import draggable from "vuedraggable";
  import {API_SaveTableSorter,API_GetTableSorter} from "api";
  import { mapGetters } from 'vuex'
  export default {
    name: "SortField",
    components: {
      draggable
    },
    data() {
      return {
        visible:false,
        selectedList: [],
        unselectedList: [],
        editable: true,
        isDragging: false,
        delayedDragging: false
      };
    },
    props: ['flag','arr','menuType'],
    mounted(){},
    computed: {
        ...mapGetters('user', {
            VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
        }),
        dragOptions() {
            return {
            animation: 0,
            group: "description",
            disabled: !this.editable,
            ghostClass: "ghost"
            };
        }
    },
    watch: {
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true;
                return;
            }
            this.$nextTick(() => {
                this.delayedDragging = false;
            });
        },
        flag: function () {
            this.visible = this.flag
            if (this.visible) {
                this.getSorter()
            }
        }
    },
    methods: {
        cancel (e) {
            this.$emit('cancel', false)
        },
        onMove({ relatedContext, draggedContext }) {
            const relatedElement = relatedContext.element;
            const draggedElement = draggedContext.element;
            return ((!relatedElement || !relatedElement.fixed) && !draggedElement.fixed);
        },
        getSorter(){ // 获取表格字段排序内容  带操作参考sell.vue,不带操作参考PickupGoodsApplyList.vue
            let data ={}
            data.menuType = this.menuType
            data.companyId = this.VUEX_ST_COMPANYSUER.companyId
            API_GetTableSorter(data).then(res => {
                if(res.success){
                    if(res.result == null) {
                        this.selectedList= this.arr
                    } else {
                        this.selectedList = res.result.selected
                        this.unselectedList = (res.result.unselected == null)? []: res.result.unselected
                    }
                } else {
                    this.$message.error('网络异常，请稍后重试！');
                }
            })
        },
        handleOk (e) {
            this.$emit('cancel', false)
            let data = {};
            data.selected = this.selectedList
            data.unselected = this.unselectedList
            data.menuType = this.menuType
            data.companyId = this.VUEX_ST_COMPANYSUER.companyId
            API_SaveTableSorter(data).then(res => {
                if(res.success){
                    this.$emit('reload',this.selectedList)
                } else {
                    this.$message.error('保存失败，请稍后重试！');
                }
            })

        }
    }
  };
  </script>
  
  <style lang="less">
    .sortBody{
        .ant-modal-body{
            text-align: left!important;
            padding: 15px 0 15px 26px!important;
            p{
                margin-bottom:26px!important;
            }
            .unselectedBox,.selectedBox{
                border-bottom:1px solid #ccc;
                min-height:120px;
                ul.list-group{
                    width:100%;
                    .list-group-item{
                        display: inline-block;
                        text-align:center;
                        width:124px;
                        height:40px;
                        padding:0 2px;
                        line-height:40px;
                        color:#1677FF;
                        border:1px solid #1677FF;
                        border-radius:4px;
                        margin:0 26px 26px 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        position: relative;
                        i{
                            position: absolute;
                            right:0;
                            bottom:0;
                            display: inline-block;
                            color:#fff;
                            width: 0px;
                            height: 0px;
                            border-color: transparent #1677FF #1677FF transparent;
                            border-width: 9px 9px 9px 9px;
                            border-style: solid;
                            svg{
                                position: relative;
                                top:-2px;
                                left:-1px;
                                font-size:10px;
                            }
                        }
                    }
                }
                
            }
            .unselectedBox{
                border-bottom:none;
                min-height:100px;
                ul.list-group{
                    .list-group-item{
                        border-color:#ddd;
                        color:#333;
                    }
                }
            }
        }
    }
  </style>
  