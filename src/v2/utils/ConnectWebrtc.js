//无敌垫片
import "webrtc-adapter";
// import "./js/adapter_core"
const iceServers = [
  {urls:"stun:stun.minisipserver.com"},
  {urls:"stun:stun.voipbuster.com"},
  {urls:"stun:stun.voipstunt.com"},
  {urls:"stun:stun.voip.aebc.com"},
  {urls:"stun:stun.internetcalls.com"},
]
class ConnectWebrtc {
  constructor() {
    this.connection = null;
    this.icecandidateFn = null;
    this.trackFn = null;
    this.removeTrackFn = null;
  }

  //创建RTCPeerConnection实例，同时监听icecandidate，track事件
  create(
    onAddStream,
    onReomveStream,
    onCandidate
  ) {
    this.connection = new RTCPeerConnection({
      iceServers: [
        ...iceServers,
        {
          urls: 'turn:111.67.195.4:3478',
          username:"duhuijie",
          credential:"duhuijie"
        },
      ],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
    });

    this.icecandidateFn = function (event) {
      if (event.candidate) {
        onCandidate(event.candidate);
      } else {
        console.log("End of candidates.");
      }
    };
    this.trackFn = onAddStream;
    this.removeTrackFn = onReomveStream;

    this.connection.addEventListener("icecandidate", this.icecandidateFn);
    this.connection.addEventListener("track",  this.trackFn);
    this.connection.addEventListener("removeTrack", this.removeTrackFn);
  }

  //创建offer sdp
  createOffer(onSessionDescription) {
    if (this.connection) {
      this.connection.createOffer()
        .then((sessionDescription) => {
            if (this.connection) {
              this.connection.setLocalDescription(sessionDescription);
              onSessionDescription(sessionDescription);
            }
        })
        .catch(() => {
          console.log("offer create error");
        });
    }
  }
  
  //创建answer sdp
  createAnswer(onSessionDescription) {
    if (this.connection) {
      this.connection
      .createAnswer()
      .then((sessionDescription) => {
        if (this.connection) {
          this.connection.setLocalDescription(sessionDescription);
        }
        onSessionDescription(sessionDescription);
      })
      .catch(() => {
          console.log("创建answer失败");
      });
    }
  }

  //设置远端描述
  setRemoteDescription(sessionDescription) {
    this.connection?.setRemoteDescription(
      new RTCSessionDescription(sessionDescription)
    );
  }

  //设置候选人
  setCandidate(message) {
    if (this.connection) {
      const candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate,
      });
      this.connection.addIceCandidate(candidate).catch((error) => {
          console.log(error);
      });
    }
  }

  //讲媒体流添加到连接中
  addTrack(stream) {
    if (this.connection) {
      this.connection.addTrack(stream.getVideoTracks()[0], stream);
      // this.connection.addTrack(stream.getAudioTracks()[0], stream);
    }
  }

  //从连接中删除媒体流
  removeTrack() {
    if (this.connection) {
      this.connection.removeTrack(this.connection.getSenders()[0]);
    }
  }
  close(){
    if(!this.connection){
      return
    }
    this.removeTrack();
    this.connection.addEventListener("icecandidate", this.icecandidateFn);
    this.connection.addEventListener("track",  this.trackFn);
    this.connection.addEventListener("removeTrack", this.removeTrackFn);
    this.connection.close();
    this.connection = null;
  }
}

export default ConnectWebrtc;
