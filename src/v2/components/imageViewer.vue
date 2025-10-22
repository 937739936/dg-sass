<template>
  <viewer
    :options="options"
    :images="images"
    @inited="inited"
    class="viewer"
    ref="viewer"
  >
    <template slot-scope="scope">
      <img v-for="(src, index) in scope.images" :src="src" :key="index" />
    </template>
  </viewer>
</template>

<script>
import Viewer from "v-viewer/src/component.vue";
import ENV from "@/v2/config/env";

export default {
  components: {
    Viewer,
  },
  data() {
    return {
      images: [],
      options: {
        inline: false,
      },
    };
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(images, isStatic) {
      if (!Array.isArray(images)) {
        throw new Error("参数必须为数组");
      }
      if (!isStatic) {
        images = images.map((item) => {
          return item;
        }
        );
      } else {
        images = images.map(item => `${item}`);
      }
      this.images = images;
      this.$viewer.show();
    },
  },
};
</script>

<style lang="less" scoped>
.viewer {
  display: none;
}
</style>
