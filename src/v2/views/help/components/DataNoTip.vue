<template>
  <div class="no-data-wrap">
    <span class="no-data"></span>
    <p>抱歉，没有找到您期望的内容 建议换个关键词试试</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.no-data-wrap {
  width: 1200px;
  height: 412px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 40px;
  border-radius: 10px;
  .no-data {
    width: 144px;
    height: 158px;
    display: inline-block;
    background-image: url("~@/assets/imgs/helpcenter/no-data.png");
    background-size: contain;
    background-repeat: no-repeat;
  }
  p {
    width: 182px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.40);
    text-align: center;
    margin-top: 27px;
  }
}
</style>