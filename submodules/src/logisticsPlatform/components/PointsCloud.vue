<template>
  <a-spin :spinning="loading" tip="加载3D图形中...">
    <div :id="id" class="points-cloud">
      <div v-if="isInventoryCompleted == false">
        <div class="empty-content">
          <img src="@sub/assets/imgs/common/msg-no.png" />
          <span class="empty_tip">正在计算处理中，请稍等</span>
        </div>
      </div>
      <div class="empty-content" v-else-if="loading"></div>
    </div>
  </a-spin>
</template>
<script>
import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  props: {
    id: {
      type: String,
      default: () => "points-clound-" + Math.random().toString(36).slice(2),
    },
    // 盘库状态
    inventoryStatus: {
      type: String,
      default: '',// 'PROCESSING' 'COMPLETED'
    }
  },
  data() {
    return {
      loading: false,
      width: 1366,
      height: 455,
      scene: new THREE.Scene(),
      pcdLoader: new PCDLoader(),
      renderer: new THREE.WebGLRenderer({ antialias: false, alpha: false }),
      camera: null,
    };
  },
  mounted() {
    this.width = document.querySelector(`#${this.id}`).clientWidth;
    this.height = (this.width / 6) * 2;
    setTimeout(() => {
      if (this.isInventoryCompleted) {
        this.init();
      }
    }, 100);
  },
  computed: {
    isInventoryCompleted() {
      return this.inventoryStatus == 'COMPLETED'
    }
  },
  beforeDestroy() {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.content = null;
    this.renderer = null;
    this.camera = null;
    this.pcdLoader = null;
    window.removeEventListener("resize", this.resize, false);
  },
  methods: {
    async init() {
      this.loading = true;
      const scene = this.scene;
      const renderer = this.renderer;
      const points = await this.loadModel();

      const largestDimension = Math.max(
        points.geometry.boundingBox.max.x,
        points.geometry.boundingBox.max.y,
        points.geometry.boundingBox.max.z
      );
      const pos = points.geometry.attributes.position;
      const count = pos.count;
      const color = new THREE.Color(0x3ec4d0);
      const colorsArr = [];
      for (let i = 0; i < count; i++) {
        colorsArr.push(color.r, color.g, color.b, 1);
      }
      const colors = new Float32Array(colorsArr);
      // 设置几何体attributes属性的颜色color属性
      points.geometry.attributes.color = new THREE.BufferAttribute(colors, 4);
      // 3. 设置材质，使用顶点颜色渲染
      points.material.vertexColors = true;
      points.material.transparent = true;
      points.material.opacity = 1;
      points.material.size = 0.3;
      scene.add(points);
      const ambient = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambient);
      //渲染器和相机
      const width = this.width;
      const height = this.height;
      this.camera = new THREE.PerspectiveCamera(10, width / height, 1, 10000);
      const camera = this.camera;
      camera.position.z = largestDimension * 1.2;
      camera.position.set(
        0.5005852742557422,
        -99.49739970242311,
        10.000843306412271
      );
      camera.lookAt(scene.position);

      camera.up = new THREE.Vector3(0, 0, 1);
      camera.updateProjectionMatrix(); // 更新相机的投影矩阵

      renderer.setSize(width, height);
      renderer.setClearColor(0xe5e6eb);
      // renderer.outputEncoding = THREE.outputColorSpace;
      renderer.setPixelRatio(window.devicePixelRatio);
      document.querySelector(`#${this.id}`).appendChild(renderer.domElement);

      this.loading = false;

      const controls = new OrbitControls(camera, renderer.domElement);
      // controls.mouseButtons = {
      //     LEFT: THREE.MOUSE.PAN,
      //     RIGHT:THREE.MOUSE.ROTATE
      //   }
      controls.addEventListener("change", render);
      // 渲染
      function render() {
        renderer.render(scene, camera);
      }
      render();
      // 画布跟随窗口变化
      window.addEventListener("resize", this.resize, false);
    },
    resize() {
      this.width = document.querySelector(`#${this.id}`).clientWidth;
      this.height = (this.width / 6) * 2;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    },
    loadModel() {
      return new Promise((resolve, reject) => {
        this.pcdLoader?.load("/files/PCD25.pcd", function (points) {
          const middle = new THREE.Vector3();
          points.geometry.computeBoundingBox();
          points.geometry.boundingBox.getCenter(middle);
          points.applyMatrix4(
            new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
          );
          resolve(points);
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.points-cloud {
  border-radius: 4px;
  overflow: hidden;
}
.empty-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 160px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(---Line, #e5e6eb);

  img {
    width: 66px;
    height: 66px;
  }
  .empty_tip {
    margin-top: 20px;
    color: rgba(0, 0, 0, 0.25);
    font-size: 14px;
  }
}
</style>