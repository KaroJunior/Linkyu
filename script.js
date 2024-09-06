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

// Set initial state
centralText.style.display = 'block'; // Show "Waiting to connect..." on load
remoteVideo.style.backgroundImage = 'none'; // No is.svg on load
skipBtn.disabled = true;  // Disable skip on load

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
  centralText.style.display = 'none';  // Hide the waiting text
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
  remoteVideo.style.backgroundImage = 'none';  // Hide is.svg when not searching
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

// Connect to ScaleDrone room
function connectToRoom() {
  room = drone.subscribe(roomName);

  room.on('open', error => {
    if (error) {
      console.error('Error connecting to room:', error);
      return;
    }
    console.log('Connected to room');
    setupWebRTC(true); // Initiate WebRTC connection
  });

  room.on('members', members => {
    console.log('Connected members:', members);
    // If there is more than one person in the room, connect to the first available user
    if (members.length > 1) {
      const otherMember = members.find(member => member.id !== drone.clientId);
      if (otherMember) {
        startWebRTC(otherMember.id);
      }
    }
  });

  room.on('message', message => {
    if (message.clientId !== drone.clientId) {
      signalingMessage(message.data);
    }
  });
}

// Disconnect from ScaleDrone room
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
    console.log('ICE candidate:', event.candidate);
    if (event.candidate) {
      sendSignalingMessage({ candidate: event.candidate });
    }
  };

  pc.ontrack = event => {
    console.log('Track received:', event.track);
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
    }
    remoteStream.addTrack(event.track);
    onUserConnected();
  };

  if (isInitiator) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      console.log('User media obtained:', stream);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);
        sendSignalingMessage({ sdp: offer });
      });
    }).catch(error => {
      console.error('Error accessing user media:', error);
    });
  }
}

// Handle incoming signaling messages
function signalingMessage(message) {
  console.log('Processing signaling message:', message);
  if (message.sdp) {
    pc.setRemoteDescription(new RTCSessionDescription(message.sdp)).then(() => {
      if (message.sdp.type === 'offer') {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
          console.log('User media obtained:', stream);
          stream.getTracks().forEach(track => pc.addTrack(track, stream));
          pc.createAnswer().then(answer => {
            pc.setLocalDescription(answer);
            sendSignalingMessage({ sdp: answer });
          });
        }).catch(error => {
          console.error('Error accessing user media:', error);
        });
      }
    }).catch(error => {
      console.error('Error setting remote description:', error);
    });
  } else if (message.candidate) {
    pc.addIceCandidate(new RTCIceCandidate(message.candidate)).catch(error => {
      console.error('Error adding ICE candidate:', error);
    });
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
  remoteVideo.style.backgroundImage = 'none';  // Hide is.svg when a user is connected
  centralText.style.display = 'none';  // Hide the central text
  skipBtn.disabled = false;  // Enable skip
  console.log('User connected...');
}

// When a user disconnects
function onUserDisconnected() {
  userConnected = false;
  if (isSearching) {
    remoteVideo.style.backgroundImage = 'url("assets/is.svg")';  // Show is.svg again when searching
    centralText.style.display = 'none';  // Keep the waiting text hidden during searching
  } else {
    remoteVideo.style.backgroundImage = 'none';  // Hide is.svg when search is not active
    centralText.style.display = 'block';  // Show the waiting text again
  }
  skipBtn.disabled = true;  // Disable skip
  console.log('User disconnected...');
}
