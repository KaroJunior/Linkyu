<head>
  <script src='https://cdn.scaledrone.com/scaledrone.min.js'></script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="assets/logo.png" class="icon">
  <link rel="stylesheet" href="styles.css">
  <meta name="description" content="Linkyu: Seamless video calls with anyone, anywhere, on any device. Simply share the URL to connect instantly. Enjoy high-quality video communication without any hassle." />
  <meta name="keywords" content="Linkyu, video calls, video communication, URL video call, seamless video call, cross-device video call, high-quality video call, video chat, online meetings, virtual meetings" />
  <meta name="author" content="Linkyu">
  <!-- Open Graph tags for better sharing on social media -->
  <meta property="og:title" content="Linkyu - Seamless Video Calls Anywhere, Anytime" />
  <meta property="og:description" content="Linkyu enables you to make video calls with anyone, anywhere, on any device. Share the URL and connect instantly with high-quality video communication." />
  <meta property="og:image" content="assets/logo.png" />
  <meta property="og:url" content="https://linkyu.pxxl.space" />
  <meta property="og:type" content="website" />

  <!-- Twitter Card tags for better sharing on Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Linkyu - Seamless Video Calls Anywhere, Anytime" />
  <meta name="twitter:description" content="Linkyu enables you to make video calls with anyone, anywhere, on any device. Share the URL and connect instantly with high-quality video communication." />
  <meta name="twitter:image" content="assets/logo.png" />
  <title>Linkyu</title>
</head>
<body>
  <header class="header">
    <div class="left">
      <img src="assets/logo.png" alt="Logo" class="logo">
      <div class="title">LINKYU</div>
    </div>
    <nav class="right" id="right">
      <a href="contact.php" class="nav-link">Send Feedback</a>
      <a href="https://karojunior.pxxl.space" class="nav-link">Contact Developer</a>
    </nav>
    <div class="hamburger" onclick="toggleMenu()">
      <span class="icon">&#9776;</span>
      <span class="icon close">✕</span>
    </div>
  </header>
  <div class="copy">Send your URL to a friend to start a video call</div>
  <div class="videocall">
    <video id="remoteVideo" autoplay></video>
    <video id="localVideo" autoplay muted></video>
  </div>
  
  <script src="script.js"></script>
  <script>
    function toggleMenu() {
      const rightNav = document.querySelector('.right');
      rightNav.classList.toggle('open');
    }
  </script>
</body>
</html>
