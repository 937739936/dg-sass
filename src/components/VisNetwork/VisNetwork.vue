<template>
  <div class="vis-network-wrapper" ref="visNetworkWrapper">
    <div
      v-if="isFullscreen"
      class="fullscreen-icon"
      @click="toggle"
      :class="fullscreen ? 'is-fullscreen' : ''">
      <a-tooltip
        placement="bottom"
        overlayClassName="test123123123"
        :getPopupContainer="getPopupContainer"
        :title="fullscreen ? '退出全屏' : '全屏'">
        <a-icon :type="fullscreen ? 'fullscreen-exit' : 'fullscreen'" />
      </a-tooltip>
    </div>
    <div ref="myNetwork" class="vis-network"></div>
  </div>
</template>
<script>
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { api as fullscreen } from 'vue-fullscreen';
import {debounce} from 'lodash';
import { getPopupContainer } from '@/untils/factory.js';

export default {
  name: 'VisNetwork',
  props: {
    data: {
      type: String,
      default: () => {},
    },
    graphData: {
      type: Array,
      default: () => [],
    },
    graphRelation: {
      type: Array,
      default: () => [],
    },
    isFullscreen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      getPopupContainer,
      fullscreen: false,
      network: null,
    };
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHanlder);
  },
  created() {
    // create an array with nodes
    // console.log('visDatavisDatavisDatavisDatavisDatavisData', Network)
    /* const nodes = new DataSet([
      { id: 7, label: '一级节点100', level: 1 },
      { id: 8, label: '一级节点200', level: 1 },
      { id: 9, label: '一级节点300', level: 1 },
      { id: 10, label: '一级节点400', level: 1 },
      { id: 11, label: '一级节点500', level: 1 },
      { id: 12, label: '一级节点600', level: 1 },

      { id: 1, label: '全业务线关系图谱（二级节点）', level: 2 },
      { id: 2, label: '三级节点', level: 3 },
      { id: 3, label: '四级节点', level: 4 },
      { id: 4, label: '五级节点', level: 5 },
      { id: 5, label: '六级节点', level: 6 },
    ]);

    const edges = new DataSet([
      { from: 10, to: 1 },
      { from: 11, to: 1 },
      { from: 12, to: 1 },
      { from: 7, to: 1 },

      { from: 1, to: 2 },
      { from: 8, to: 1 },
      { from: 9, to: 1 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ]); */
    const nodes = new DataSet(this.graphData);

    const edges = new DataSet(this.graphRelation);
    this.networkData = {
      nodes,
      edges,
    };
    // 全局配置
    this.options = {
      autoResize: true, // 网络将自动检测其容器的大小调整，并相应地重绘自身
      interaction: {
        dragNodes: false,
      },
      // scaling: {
      //   min: 10,
      //   max: 30,
      //   label: {
      //     enabled: false,
      //     min: 14,
      //     max: 30,
      //     maxVisible: 30,
      //     drawThreshold: 5,
      //   },
      // },
      layout: {
        // randomSeed: 2, // 配置每次生成的节点位置都一样，参数为数字1、2等
        hierarchical: {
          direction: 'LR', // UD:上下 DU:下上 LR:左右 RL:右左
          // sortMethod: 'directed',
        }, // 层级结构显示
      },
      // // 边线配置
      edges: {
        // width: 1,
        // length: 200,
        arrows: { to: true },
        // 箭头指向to
      },
      nodes: {
        margin: 10,
        // widthConstraint: false,
        widthConstraint: 80,
        // widthConstraint: {
        //   maximum: 20000,
        // },
        color: {
          background: '#ffffff', // 节点背景颜色
        },
        font: {
          size: 10, // px
        },
        shape: 'box',
        // shapeProperties: {
        //   borderRadius: 1000,
        // },
        shapeProperties: {
          borderRadius: 5, // only for box shape
        },
      },
    };
  },
  mounted() {
    this.container = this.$refs.myNetwork;
    this.network = new Network(this.container, this.networkData, this.options);
    // this.bindEvent();
  },
  methods: {
    toggle() {
      fullscreen.toggle(this.$refs.visNetworkWrapper, {
        teleport: this.teleport,
        callback: (isFullscreen) => {
          this.fullscreen = isFullscreen;
          setTimeout(() => {
            this.network = new Network(this.container, this.networkData, this.options);
          }, 300);
        },
      });
    },
    bindEvent() {
      this.resizeHanlder = debounce(() => {
        if (this.network) {
          this.network.fit();
        }
      }, 300);
      window.addEventListener('resize', this.resizeHanlder);
    },
  },
};
</script>
<style lang="less" scoped>
.vis-network-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  ::v-deep .fullscreen-icon{
    position: absolute;
    z-index: 1;
    right: 5px;
    top: 5px;
    font-size: 18px;
    cursor: pointer;
    padding: 3px 7px;
    &:hover {
      background: #F5F5F5;
    }
    >div{
      width: 100px !important;
    }
  }
  .vis-network{
    position: relative;
    overflow: hidden;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
  .fullscreen-icon.is-fullscreen{
    top: 25px;
    right: 25px;
  }
}
</style>
