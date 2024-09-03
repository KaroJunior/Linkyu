<head>
    <script src='https://cdn.scaledrone.com/scaledrone.min.js'></script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="assets/logo.png" class="icon">
    <link rel="stylesheet" href="styles.css">
    <meta name="description" content="Contact Linkyu: We value your feedback! Reach out to us for support, suggestions, or inquiries. Help us improve your video call experience by sharing your thoughts." />
    <meta name="keywords" content="Linkyu, contact Linkyu, send feedback, contact us, customer support, user feedback, inquiries, suggestions, video call support, improve video call experience" />
    <!-- Open Graph tags for better sharing on social media -->
    <meta property="og:title" content="Contact Linkyu - Send Your Feedback" />
    <meta property="og:description" content="We value your feedback! Reach out to us for support, suggestions, or inquiries. Help us improve your video call experience by sharing your thoughts." />
    <meta property="og:image" content="assets/logo.png" />
    <meta property="og:url" content="https://linkyu.pxxl.space/contact.php" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card tags for better sharing on Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Contact Linkyu - Send Your Feedback" />
    <meta name="twitter:description" content="We value your feedback! Reach out to us for support, suggestions, or inquiries. Help us improve your video call experience by sharing your thoughts." />
    <meta name="twitter:image" content="assets/logo.png" />
    <meta name="author" content="Linkyu">
    <title>Linkyu - Send Feedback</title>
  </head>
  <body>
    <header class="header">
      <div class="left">
        <img src="assets/logo.png" alt="Logo" class="logo">
        <div class="title">LINKYU</div>
      </div>
      <nav class="right" id="right">
        <a href="index.php" class="nav-link">Go Back</a>
        <a href="https://karojunior.pxxl.space" class="nav-link">Contact Developer</a>
      </nav>
      <div class="hamburger" onclick="toggleMenu()">
        <span class="icon">&#9776;</span>
        <span class="icon close">✕</span>
      </div>
    </header>
    <section id="contact" class="section">
      <div class="container" id="bgneeded">
          <h2>Send Feedback</h2>
          <form id="contact-form" action="https://submit-form.com/Ibn3fiYXt" method="post">
              <div class="form-group">
                  <label for="name">Name:</label>
                  <input type="text" id="name" name="name" placeholder="John Doe" required>
              </div>
              <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" placeholder="johndoe@gmail.com" required>
              </div>
              <div class="form-group">
                  <label for="message">Message:</label>
                  <textarea id="message" name="message" placeholder="Type your message here" required></textarea>
              </div>
              <div class="form-group">
                  <button type="submit" class="btn">Send Message</button>
              </div>
          </form>
      </div> 
  </section>
    <script>
      function toggleMenu() {
        const rightNav = document.querySelector('.right');
        rightNav.classList.toggle('open');
      }
    </script>
  </body>
  </html>
  