<template>
	<div
		:style="styleWrap"
		:class="['canvasfullwrap', isfull ? 'fullwrap' : '']"
	>
		<template v-if="!isEmpty">
			<div
				:id="tagId"
				class="tag"
			></div>
			<div
				:id="id"
				class="canvas-wrap"
				:style="{ height: (isfull ? fullHeight : height) + 'px' }"
			>
				<div class="direction"></div>
				<div
					:class="['full-screen', isfull ? 'isfull' : '']"
					@click="toggleScreen"
					v-if="showFullScreen"
				>
					<maximize v-show="!isfull" />
					<minimize
						v-show="isfull"
						:size="[30]"
					/>
				</div>
			</div>
		</template>
		<template v-else>
			<a-empty description="未配置平面图信息" />
		</template>
	</div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { getStationAndCameraPlaneGraph } from '../api/index';
import maximize from '@sub/components/svg/maximize.vue';
import minimize from '@sub/components/svg/minimize.vue';

import CameraSelectedImage from 'v2/assets/imgs/logisticsPlatform/monitor/test/camera_selected.png';
import CameraOfflineImage from 'v2/assets/imgs/logisticsPlatform/monitor/test/camera_offline.png';
import CameraImage from 'v2/assets/imgs/logisticsPlatform/monitor/test/camera.png';
const cameraW = 64;
const cameraH = 65;
// THREE.TextureLoader.crossOrigin = null;
export default {
	components: {
		minimize,
		maximize
	},
	props: {
		styleWrap: {
			type: String,
			default: () => {
				return '';
			}
		},
		id: {
			type: String,
			default: () => {
				return 'canvas' + Math.random().toString(36).slice(2);
			}
		},
		edit: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		editId: {
			type: String,
			default: () => {
				return '';
			}
		},
		height: {
			type: Number,
			default: () => {
				return 440;
			}
		},
		onPointClick: {
			type: Function,
			default: () => {
				return null;
			}
		},
		showFullScreen: {
			type: Boolean,
			default: () => {
				return true;
			}
		}
	},
	data() {
		return {
			isEmpty: false,
			tagId: 'tag' + Math.random().toString(36).slice(2),
			moveEnd: {
				graphLat: 0,
				graphLon: 0
			},
			data: {
				cameraPlaneGraphList: [],
				planeGraphUrl: ''
			},
			platformImage: new Image(),
			controls: null,
			renderer: null,
			scene: null,
			camera: null,
			tag: null,
			css3Renderer: new CSS2DRenderer(),
			isfull: false,
			fullHeight: this.height
		};
	},
	mounted() {
		this.doFetch();
	},
	methods: {
		reload({ cameraId, graphLat, graphLon }) {
			this.scene.traverse(mesh => {
				if (mesh.isSprite) {
					if (mesh.userData.data && mesh.userData.data?.id === cameraId) {
						mesh.userData.data.graphLat = graphLat;
						mesh.userData.data.graphLon = graphLon;
						mesh.position.x = graphLat - this.w / 2 + cameraW / 2;
						mesh.position.y = -(graphLon - this.h / 2) - cameraH / 2;
					}
				}
			});
		},
		doFetch() {
			getStationAndCameraPlaneGraph().then(async ({ success, data }) => {
				if (!success) {
					return;
				}
				if (!data.planeGraphUrl) {
					this.isEmpty = true;
					return;
				}
				this.data = data;
				this.intPlatformImage(data.planeGraphUrl).then(image => {
					this.w = image.width;
					this.h = image.height;
					this.intCanvas();
				});
			});
		},
		intPlatformImage(src) {
			return new Promise(resolve => {
				const img = new Image();
				img.onload = function () {
					resolve(img);
				};
				img.src = src;
			});

			// new Promise((resolve,reject) => {

			// })
		},
		toggleScreen() {
			const ele = document.querySelector('.canvasfullwrap');
			this.isfull = !this.isfull;
			this.$nextTick(() => {
				this.fullHeight = ele.clientHeight - 2;
				this.$nextTick(() => {
					this.resize();
					this.scene.traverse(mesh => {
						if (mesh.isSprite) {
							if (this.isfull) {
								mesh.scale.set(0.05, 0.05, 1);
							} else {
								mesh.scale.set(0.1, 0.1, 1);
							}
						}
					});
				});
			});
		},
		intCanvas() {
			const id = this.id;
			const ele = document.querySelector('#' + id);
			const width = ele.clientWidth;
			const height = ele.clientHeight;

			this.scene = new THREE.Scene();
			const model = this.initModel();
			this.scene.add(model);
			//设置相机的4个参数
			const max = Math.max(this.w, this.h);
			this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, max * 4);
			this.camera.position.set(0, 0, max);
			this.camera.lookAt(0, 0, 0); //坐标原点

			//创建一个WebGl渲染器
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.outputEncoding = THREE.sRGBEncoding;
			this.renderer.setSize(width, height); //canvas宽高
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setClearColor('#E8EEF1');

			// 创建一个CSS3渲染器CSS2DRenderer
			this.css3Renderer.setSize(width, height);
			this.css3Renderer.domElement.style.position = 'absolute';
			this.css3Renderer.domElement.style.top = '0px'; //具体值根据canvas画布位置来定
			this.css3Renderer.domElement.style.pointerEvents = 'none';
			ele.appendChild(this.renderer.domElement);
			ele.appendChild(this.css3Renderer.domElement);

			//创建一个相机控件对象
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableRotate = false;
			this.controls.maxDistance = max * 4;
			this.controls.minDistance = max / 4;
			this.controls.mouseButtons = {
				LEFT: THREE.MOUSE.PAN,
				RIGHT: THREE.MOUSE.ROTATE
			};

			const dControls = new DragControls(model.children, this.camera, this.renderer.domElement);
			let position;
			let isMove = false;
			const ofx = 0,
				ofy = 0;
			dControls.addEventListener('hoveron', event => {
				const { x, y } = event.object.position.clone();
				this.tag.position.set(x + ofx, y + ofy, 0);
				this.tag.element.innerText = event.object.userData.data.name;
				this.tag.element.classList.add('show');
				this.controls.mouseButtons = {
					LEFT: THREE.MOUSE.ROTATE,
					RIGHT: THREE.MOUSE.PAN
				};
			});

			dControls.addEventListener('hoveroff', event => {
				this.tag.element.classList.remove('show');
				this.controls.mouseButtons = {
					LEFT: THREE.MOUSE.PAN,
					RIGHT: THREE.MOUSE.ROTATE
				};
			});
			dControls.addEventListener('dragstart', event => {
				isMove = false;
				this.tag.element.classList.remove('show');
				this.renderer.domElement.style.cursor = 'pointer';
				position = event.object.position.clone();
			});

			dControls.addEventListener('drag', event => {
				let { x, y } = event.object.position;
				if (!this.edit) {
					event.object.position.set(position.x, position.y, position.z);
				} else {
					if (this.editId) {
						if (this.editId != event.object.userData.data.id) {
							event.object.position.set(position.x, position.y, position.z);
						} else {
							const target = this.handleTargetPosition(x, y);
							event.object.position.set(target.x, target.y, 0);
						}
					}
				}
				if (x != position.x || y != position.y) {
					isMove = true;
				}
				this.tag.position.set(x + ofx, y + ofy, 0);
			});
			dControls.addEventListener('dragend', event => {
				let { x, y } = event.object.position;
				if (!isMove) {
					if (this.onPointClick) {
						this.onPointClick(event.object.userData.data);
						return;
					}
					// event.object.click(model.children)
					this.tag.element.classList.add('show');
				}

				this.moveEnd = {
					graphLat: (x + this.w / 2 - cameraW / 2).toFixed(2),
					graphLon: (Math.abs(y - this.h / 2) - cameraH / 2).toFixed(2)
				};
			});
			this.render();
			window.addEventListener('resize', this.resize, false);
		},
		handleTargetPosition(x, y) {
			let minX = Math.min(Math.abs(x), this.w / 2 - cameraW / 2);
			let minY = Math.min(Math.abs(y), this.h / 2 - cameraH / 2);
			if (x < 0) {
				minX = -minX;
			}
			if (y < 0) {
				minY = -minY;
			}
			return { x: minX, y: minY };
			// return {x,y}
		},
		resize() {
			if (this.isfull) {
				const ele = document.querySelector('.canvasfullwrap');
				this.fullHeight = ele.clientHeight - 2;
				this.$nextTick(this._resize);
				return;
			}
			this._resize();
		},
		_resize() {
			const ele = document.querySelector('#' + this.id);
			if (!ele) {
				return;
			}
			const width = ele.clientWidth;
			const height = ele.clientHeight;
			this.css3Renderer.setSize(width, height);
			this.renderer.setSize(width, height);
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
		},
		render() {
			this.controls.update();
			this.css3Renderer.render(this.scene, this.camera);
			this.renderer.render(this.scene, this.camera);
			requestAnimationFrame(this.render);
		},
		// getPlatformImage(){
		//   return {
		//     width:756,
		//   }
		// },
		initModel() {
			const geometry = new THREE.PlaneGeometry(this.w, this.h);
			const textureLoader = new THREE.TextureLoader();

			const bgMap = textureLoader.load(this.data.planeGraphUrl);
			bgMap.encoding = THREE.sRGBEncoding;
			const material = new THREE.MeshBasicMaterial({
				map: bgMap,
				side: THREE.DoubleSide,
				transparent: true
			});
			const mesh = new THREE.Mesh(geometry, material);

			this.data.cameraPlaneGraphList.forEach(item => {
				const point = this.createCameraMesh({ ...item });
				mesh.add(point);
			});
			const div = document.getElementById(this.tagId);
			// HTML元素转化为threejs的CSS3模型对象
			this.tag = new CSS2DObject(div);
			//标签tag作为mesh子对象，默认受到父对象位置影响
			mesh.add(this.tag);
			return mesh;
		},
		createCameraMesh(data) {
			// const geometry = new THREE.PlaneGeometry(cameraW,cameraH);
			const textureLoader = new THREE.TextureLoader();
			let map = textureLoader.load(CameraImage);
			let z = 0;
			if (this.editId == data.id) {
				this.moveEnd = {
					graphLat: data.graphLat,
					graphLon: data.graphLon
				};
				z = 1;
				map = textureLoader.load(CameraSelectedImage);
			} else {
				if (!data.online) {
					map = textureLoader.load(CameraOfflineImage);
				}
			}

			map.encoding = THREE.sRGBEncoding;
			const material = new THREE.SpriteMaterial({
				map,
				transparent: true,
				sizeAttenuation: false
			});
			const mesh = new THREE.Sprite(material);
			mesh.scale.set(0.1, 0.1, 1);
			// const material = new THREE.MeshBasicMaterial({
			//   map,
			//   transparent:true,
			// })
			// const mesh = new THREE.Mesh(geometry,material)
			mesh.userData.data = data;
			mesh.position.x = data.graphLat - this.w / 2 + cameraW / 2;
			mesh.position.y = -(data.graphLon - this.h / 2) - cameraH / 2;
			mesh.position.z = z;

			// const _this = this;
			// mesh.click = function (children){
			//   if(this.selected){
			//     this.selected = false
			//     this.material.map = this.material.unSelected;
			//   }else{
			//     children.forEach((item) => {
			//       if(item.selected){
			//         item.selected = false;
			//         item.material.map = item.material.unSelected;
			//       }
			//     })
			//     this.selected = true
			//     this.material.map = _this.textureSelected;
			//   }
			// }
			return mesh;
		}
	}
};
</script>
<style lang="less" scoped>
.fullwrap {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1001;
	background-color: #fff;
}
.canvas-wrap {
	position: relative;
	height: 440px;
	border: 1px solid #e5e6eb;
	border-radius: 4px;
	overflow: hidden;

	.direction {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 90px;
		height: 90px;
		background-image: url('~v2/assets/imgs/logisticsPlatform/monitor/test/direction.png');
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		z-index: 12;
	}
}
.tag {
	position: absolute;
	top: -30px;
	padding: 5px 10px;
	color: #000;
	background-color: #fff;
	opacity: 0;
	transition: all 0.1s linear;
	pointer-events: none;
	border-radius: 4px;
	box-shadow: 0 0 5px 0px rgba(#000, 0.4);
	&.show {
		opacity: 1;
	}
}
.full-screen {
	position: absolute;
	top: 20px;
	right: 20px;
	width: 20px;
	height: 20px;
	z-index: 2;
	cursor: pointer;
	&.isfull {
		width: 30px;
		height: 30px;
	}
}
</style>
