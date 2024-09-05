const drone = new ScaleDrone('pXUPdRgMPORJFyCn');
const roomHash = location.hash.substring(1);
const roomName = 'observable-' + roomHash;
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
let room, pc;
let isSearching = false;
let userQueue = [];
let onlineUsers = 0;

const onlineCountElement = document.getElementById('onlineCount');
const searchBtn = document.getElementById('searchBtn');
const skipBtn = document.getElementById('skipBtn');

// Update online user count
function updateOnlineCount() {
  onlineCountElement.textContent = onlineUsers;
}

// Initialize WebRTC
function startWebRTC(isOfferer) {
  pc = new RTCPeerConnection(configuration);
  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({ 'candidate': event.candidate });
    }
  };
  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer().then(localDescCreated).catch(onError);
    };
  }
  pc.onaddstream = event => {
    remoteVideo.srcObject = event.stream;
    remoteVideo.style.backgroundImage = 'none';
  };
  navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
    localVideo.srcObject = stream;
    pc.addStream(stream);
  }, onError);
}

drone.on('open', error => {
  if (error) return console.error(error);
  room = drone.subscribe(roomName);
  room.on('open', error => {
    if (error) return console.error(error);
  });

  room.on('members', members => {
    onlineUsers = members.length;
    updateOnlineCount();
    if (members.length > 1 && isSearching) {
      connectWithRandomUser();
    }
  });
});

function sendMessage(message) {
  drone.publish({ room: roomName, message });
}

function searchUser() {
  if (onlineUsers > 1) {
    isSearching = true;
    searchBtn.disabled = true;
    skipBtn.disabled = false;
    connectWithRandomUser();
  } else {
    alert('No other users are online right now.');
  }
}

function connectWithRandomUser() {
  // Logic to randomly connect with another user
  pc = new RTCPeerConnection(configuration);
  startWebRTC(true);
}

function skipUser() {
  pc.close();
  searchUser();
}

function localDescCreated(desc) {
  pc.setLocalDescription(desc, () => sendMessage({ 'sdp': pc.localDescription }), onError);
}

function onError(error) {
  console.error(error);
}
