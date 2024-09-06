const drone = new ScaleDrone('pXUPdRgMPORJFyCn');
const roomHash = location.hash.substring(1);
const roomName = 'observable-' + roomHash;
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

let room, pc;
let isSearching = false;
let userConnected = false;
let remoteStream = null;

const remoteVideo = document.getElementById('remoteVideo');
const centralText = document.getElementById('centralText');
const searchBtn = document.getElementById('searchBtn');
const skipBtn = document.getElementById('skipBtn');

searchBtn.addEventListener('click', toggleSearch);
skipBtn.addEventListener('click', skipUser);

// Toggle search when the search button is clicked
function toggleSearch() {
  if (!isSearching) {
    startSearch();
  } else {
    endSearch();
  }
}

// Start searching for a user
function startSearch() {
  isSearching = true;
  userConnected = false;
  searchBtn.textContent = 'End';
  centralText.style.display = 'none';  // Hide waiting text
  remoteVideo.style.backgroundImage = 'url("assets/is.svg")';  // Show is.svg during search
  skipBtn.disabled = true;  // Disable skip until user is connected
  connectToRoom();
  console.log('Search started...');
}

// End searching and reset
function endSearch() {
  isSearching = false;
  searchBtn.textContent = 'Start';
  centralText.style.display = 'block';  // Show the waiting text again
  remoteVideo.style.backgroundImage = 'none';  // Hide is.svg
  skipBtn.disabled = true;  // Disable skip
  disconnectFromRoom();
  console.log('Search stopped...');
}

// Skip current user and search for a new one
function skipUser() {
  if (userConnected) {
    console.log('Skipping user...');
    disconnectFromRoom();
    startSearch();  // Restart search after skipping
  }
}

// WebRTC functions

function connectToRoom() {
  room = drone.subscribe(roomName);
  room.on('open', error => {
    if (error) {
      console.error(error);
      return;
    }
    console.log('Connected to room');
    setupWebRTC(true); // Initiate WebRTC connection
  });

  room.on('members', members => {
    console.log('Connected members:', members);
    // If there is only one person in the room, wait for the next person
    if (members.length >= 2) {
      startWebRTC(members[1].id);
    }
  });

  room.on('message', message => {
    if (message.clientId !== drone.clientId) {
      signalingMessage(message.data);
    }
  });
}

function disconnectFromRoom() {
  if (pc) {
    pc.close();  // Close peer connection
    pc = null;  // Reset peer connection object
  }
  if (room) {
    room.unsubscribe();  // Leave the ScaleDrone room
    room = null;  // Reset the room object
  }
}

// Setup WebRTC peer connection
function setupWebRTC(isInitiator) {
  pc = new RTCPeerConnection(configuration);

  pc.onicecandidate = event => {
    if (event.candidate) {
      sendSignalingMessage({ candidate: event.candidate });
    }
  };

  pc.ontrack = event => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
    }
    remoteStream.addTrack(event.track);
    onUserConnected();
  };

  if (isInitiator) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);
        sendSignalingMessage({ sdp: offer });
      });
    });
  }
}

// Handle incoming signaling messages
function signalingMessage(message) {
  if (message.sdp) {
    pc.setRemoteDescription(new RTCSessionDescription(message.sdp)).then(() => {
      if (message.sdp.type === 'offer') {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
          stream.getTracks().forEach(track => pc.addTrack(track, stream));
          pc.createAnswer().then(answer => {
            pc.setLocalDescription(answer);
            sendSignalingMessage({ sdp: answer });
          });
        });
      }
    });
  } else if (message.candidate) {
    pc.addIceCandidate(new RTCIceCandidate(message.candidate));
  }
}

// Send signaling messages via ScaleDrone
function sendSignalingMessage(message) {
  drone.publish({
    room: roomName,
    message: message
  });
}

// When a user connects
function onUserConnected() {
  userConnected = true;
  remoteVideo.style.backgroundImage = 'none';  // Hide is.svg when connected
  centralText.style.display = 'none';  // Hide the central text
  skipBtn.disabled = false;  // Enable skip
  console.log('User connected...');
}

// When a user disconnects
function onUserDisconnected() {
  userConnected = false;
  remoteVideo.style.backgroundImage = 'url("assets/is.svg")';  // Show is.svg when searching again
  centralText.style.display = 'block';  // Show the central text again
  skipBtn.disabled = true;  // Disable skip
  console.log('User disconnected...');
}
