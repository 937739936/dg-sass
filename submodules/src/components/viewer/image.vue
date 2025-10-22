<template>
  <viewer :options="options" :images="images" @inited="inited" class="viewer" ref="viewer">
    <template slot-scope="scope">
      <img v-for="(src, index) in scope.images" :src="src" :key="index" />
    </template>
  </viewer>
</template>

<script>
import { filePreview } from '@sub/utils/file';
import Viewer from 'v-viewer/src/component.vue';

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
    show(images) {
      if (!Array.isArray(images)) {
        throw new Error('参数必须为数组');
      }
      images = images.map((item) => {
        return item;
      });
      this.images = images;
      this.$viewer.show();
    },
    showFile(Obj) {
      filePreview(Obj, this.show);
    },
    downFile(Obj) {
      filePreview(Obj, this.show);
    },
  },
};
</script>

<style lang="less" scoped>
.viewer {
  display: none;
}
</style>
