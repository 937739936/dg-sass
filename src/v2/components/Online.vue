<template>
	<div></div>
</template>
<script>
import * as io from 'socket.io-client';
import { mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import ENV from 'v2/config/env.js';
import ConnectWebrtc from "v2/utils/ConnectWebrtc";

let streamCount = 0;
export default {
	data() {
		let url = ENV.MONITOR_SOCKET_API;
		return {
			url,
			socket: null,
      webrtc:{},
      stream:null,
			address: {}
		};
	},
	created() {

		if(!location.origin.includes("shdatalink.com")){
			return
		}
		if (!this.url) {
			return;
		}
		if(this.socket){
			return
		}
		this.socket = io(this.url+"/socket/rest", { path: '/socket/socket.io' });
		this.getLocation();
		this.taskSend();
		this.socket.on('disconnect', this.disconnect);
		this.socket.on('refresh', this.send.bind(this));
		this.socket.on('user', this.sendUser.bind(this));
		this.socket.on('create', this.webrtcCreate.bind(this));
		this.socket.on('offer', this.webrtcOffer.bind(this));
		this.socket.on('answer', this.webrtcAnswer.bind(this));
		this.socket.on('candidate', this.webrtcCandidate.bind(this));
		this.socket.on('webrtcClose', this.webrtcClose.bind(this));

	},
	beforeDestroy(){
		this.socket?.close();
		this.socket?.destroy();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	methods: {
		getLocation() {
			const self = this;
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					var response = JSON.parse(xhr.responseText);
					self.address = response.data;
				}
			};

			xhr.open('GET', 'https://monitor.shanghaishulian.com/rapi/user/address', true);
			xhr.send();
		},
   
		taskSend() {
			this.send();
			setInterval(() => {
				this.send();
			}, 1000 * 10);
		},
		sendUser(data) {
			data = this.decode(data);
			this.encode({
				targetId: data.targetId,
				user: this.VUEX_ST_PERSONALLINFO,
				currentCompany:this.VUEX_ST_COMPANYSUER,
				token: this.VUEX_ST_TOKEN
			}).then((data) => {
				this.socket.emit('user',data);
			})
			
		},
		send() {
			let user = {};
			if(this.VUEX_ST_PERSONALLINFO.name && this.VUEX_ST_COMPANYSUER.companyId){
				user.name = this.VUEX_ST_PERSONALLINFO.name
				user.companyName = this.VUEX_ST_COMPANYSUER.companyName
				user.companyType = this.VUEX_ST_COMPANYSUER.companyType
			}
			const data = {
				// eslint-disable-next-line no-undef
				deviceId: reportUtil.deviceId,
				socketId: this.socket.id,
				user,
				update: moment().format('YYYY-MM-DD HH:mm:ss'),
				address: this.address,
				login: Object.keys(this.VUEX_ST_COMPANYSUER).length > 0,
				currentPage: window.location.href,
				streamCount,
				supportShare:navigator.mediaDevices != null
			};
			this.encode(data).then((data) => {
				this.socket.emit('online', data);
			})
			
		},
		decode(binaryData){
			// 创建一个 Uint8Array 来读取 ArrayBuffer 中的字节
			const uint8Array = new Uint8Array(binaryData);
			// 将字节转换为字符串
			let jsonString = "";
			for (var i = 0; i < uint8Array.length; i++) {
					jsonString += String.fromCharCode(uint8Array[i]);
			}
			// 解析 JSON 字符串为 JavaScript 对象
			return JSON.parse(jsonString);
		},
		encode(data) {
			return new Promise((resolve) => {
					// // 将对象转换为JSON字符串
				const jsonString = JSON.stringify(data);
				// 创建 Blob 对象
				const blob = new Blob([jsonString], { type: "application/json" });
				// 创建 FileReader 对象用于读取 Blob 数据
				const reader = new FileReader();
				// 读取 Blob 数据
				reader.readAsArrayBuffer(blob);
				// 当读取完成时
				reader.onload = function() {
						// 读取到的数据存储在 reader.result 中
						const binaryData = reader.result;
						resolve(binaryData)
				};
			})
		},
		calculateByteSize(str) {
			let byteSize = 0;
			for (let i = 0; i < str.length; i++) {
				const charCode = str.charCodeAt(i);
				if (charCode <= 0x7f) {
					byteSize += 1; // 1 字节
				} else if (charCode <= 0x7ff) {
					byteSize += 2; // 2 字节
				} else if (charCode <= 0xffff) {
					byteSize += 3; // 3 字节
				} else {
					byteSize += 4; // 4 字节
				}
			}
			return byteSize;
		},
		disconnect() {
			console.log('不允许链接，请联系管理员配置');
			// this.$message.error("不允许链接，请联系管理员配置")
		},
    
    async webrtcCreate(data){
			data = this.decode(data)
      this.webrtc[data.targetId] = new ConnectWebrtc();
      this.webrtc[data.targetId].create(
        () => {},
        () => {},
        (candidate) => {
					this.encode({targetId:data.targetId,sdp: {
            label: candidate.sdpMLineIndex,
            id: candidate.sdpMid,
            candidate: candidate.candidate,
          }}).then((data) => {
						this.socket.emit("candidate",data)
					})
         
        }
      );
      this.stream = await this.getShareStream()
      if(!this.stream){
        return
      }
			streamCount++
      //优先将媒体流添加到连接中
      this.webrtc[data.targetId].addTrack(this.stream);
      this.webrtc[data.targetId].createOffer((sdp) => {
				this.encode({sdp,targetId:data.targetId}).then((data) => {
					this.socket.emit(sdp.type,data)
				})
        
      });
    },
    webrtcOffer(data){
    },
    webrtcAnswer(data){
			data = this.decode(data)
      this.webrtc[data.targetId].setRemoteDescription(data.sdp);
    },
    webrtcCandidate(data){
			data = this.decode(data)
      this.webrtc[data.targetId].setCandidate(data.sdp);
    },
    webrtcClose(data){
			if(!this.stream){
				this.webrtc[data.targetId] = null
				return;
			}
			data = this.decode(data)

      this.webrtc[data.targetId]?.close();
			this.webrtc[data.targetId] = null;
			streamCount--;
			if(streamCount > 1){
				return;
			}
			
      this.stream?.getTracks().forEach((tracks) => {
				tracks.stop();
			} )
			this.stream = null;
    },
    async getShareStream(){
			if(this.stream){
				return this.stream;
			}
      let stream;
      try{
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: {max: 1280},
            height: {max: 720},
            frameRate: {ideal: 15}
          },
					audio:true
        });
				stream.getVideoTracks()[0].onended = () => {
					
					this.socket.emit("webrtcError",{code:1})
					streamCount = 0;
				}
				// stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      }catch(e){
				this.socket.emit("webrtcError",{code:2,error:e})
      }
      return stream;
    }
	}
};
</script>
