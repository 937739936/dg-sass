<template>
  <div class="table-statistical-info">
    <a-space :size="24" class="totalRow">
      <div v-for="(item, index) in displayList" :key="index" class="total-row-item">
        <span>{{ item.title }}</span>
        <a-tooltip v-if="item.tip" placement="top">
          <template slot="title">
            <span>{{ item.tip }}</span>
          </template>
          <img class="tip-icon" src="@sub/assets/imgs/common/column_title_tip.png" alt="" />
        </a-tooltip>
        <span class="item-value">{{ thousandthsFormat(item) }}</span>
        <span v-if="item.unit" style="margin-left: 2px;">{{ item.unit }}</span>
      </div>
    </a-space>
  </div>
</template>

<script>
import { formatMoney } from '@sub/filters';

export default {
  name: 'TableStatisticalInfo',
  props: {
    /**
		 * 数据列表
		 {
        title: '票重',
        value: 1000,
        unit: '吨'
        tip: '票重说明',
        isMonetary: false, // 是否是货币单位
      }
		 */
    statisticsList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      totalWeight: 0,
    };
  },
  computed: {
    displayList() {
      return this.statisticsList;
    },
  },
  methods: {
    thousandthsFormat(item) {
      if (item.value === undefined || item.value === null || item.value === '') {
        return '-';
      }
      let formatValue = formatMoney(item.value, 2);
      if (item.isMonetary) {
        formatValue = `¥${formatValue}`;
      }
      return formatValue;
    },
  },
};
</script>

<style lang="less" scoped>
.table-statistical-info {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .total-row-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      line-height: 26px;
      text-align: left;
      font-family: PingFang SC;
      color: #77889d;
      display: inline-block;
    }
    .item-value {
      display: inline-block;
      margin-left: 10px;
      font-style: normal;
      font-family: D-DIN-PRO;
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
      text-align: left;
      color: #f46332;
    }
    .tip-icon {
      margin-left: 4px;
      width: 12px;
      height: 12px;
      cursor: pointer;
    }
  }
}
</style>