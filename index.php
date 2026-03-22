<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hylia Plaza</title>
  
  <!-- CSS -->
  <link rel="stylesheet" href="public/css/main.css" />
  <link rel="stylesheet" href="public/css/animations.css" />
  <link rel="stylesheet" href="public/css/hub.css" />
  <link rel="stylesheet" href="public/css/sidebar.css" />
  <link rel="stylesheet" href="public/css/social.css" />
  <link rel="stylesheet" href="public/css/window.css" />
  <link rel="stylesheet" href="apps/mii_maker/css/mii.css" />
  <link rel="stylesheet" href="public/css/visualizer.css" />
  <link rel="stylesheet" href="public/css/splash.css" />
  <link rel="stylesheet" href="public/css/nowPlaying.css" />
  <link rel="stylesheet" href="public/css/auth.css" />
  <link rel="stylesheet" href="public/css/responsive.css" />
  
  <link rel="icon" type="image/gif" href="public/assets/icons/minilogo.webm" />

  <!-- Three.js and OrbitControls -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/ColladaLoader.js"></script>
</head>

<body>
  <!-- AUTHENTICATION OVERLAY -->
  <?php include 'components/auth_overlay.php'; ?>

  <!-- Background Environment (DISABLED FOR MII PLAZA THEME) -->
  <!-- <video id="bg-video" autoplay loop muted playsinline
    style="position:fixed; top:0; left:0; width:100vw; height:100vh; object-fit:cover; z-index:-10; filter:brightness(0.9); transition: opacity 0.5s; pointer-events:none;"></video> -->

  <!-- MII PLAZA LAYER -->
  <div id="mii-plaza-layer"></div>

  <!-- SOCIAL OVERLAYS -->
  <?php include 'components/social_overlay.php'; ?>

  <!-- TOP NAVIGATION & CLOCK -->
  <?php include 'components/top_navigation.php'; ?>

  <!-- CENTRAL APP GRID -->
  <?php include 'components/app_grid.php'; ?>

  <!-- VISUALIZER -->
  <?php include 'components/visualizer.php'; ?>

  <!-- COMPANION & MARQUEE -->
  <?php include 'components/companion.php'; ?>

  <!-- DYNAMIC OS WINDOWS -->
  <div id="window-layer"></div>

  <!-- SPLASH SCREEN -->
  <div id="app-splash-screen">
    <div class="splash-content">
      <img src="public/assets/icons/logov2.webp" alt="App Logo" id="splash-logo">
    </div>
  </div>

  <!-- APP CONTAINERS (Pre-loaded via PHP instead of JS fetch) -->
  <div id="app-containers" style="display: none;">
    <?php 
       // PHP apps will be natively included here to avoid JS document generation
       // include 'apps/mii_maker/index.php'; 
    ?>
  </div>

  <!-- JS IMPORTS -->
  <script type="module" src="public/js/core/firebase.js"></script>
  <script type="module" src="public/js/core/auth.js"></script>
  <script type="module" src="public/js/core/audio.js"></script>
  
  <script src="public/js/core/windowManager.js" defer></script>
  <script src="public/js/core/themeManager.js" defer></script>
  
  <script>
    window.process = { env: { NODE_ENV: 'production' } };
    window.global = window;
  </script>
  
  <script src="public/js/core/visualizer.js" defer></script>
  <script src="public/js/core/carousel.js" defer></script>
  <script src="public/js/core/social.js" defer></script>
  <script src="public/js/core/app.js" defer></script>
</body>
</html>