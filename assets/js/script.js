if (document.getElementById('preloader')) {
  setTimeout(() => {
    gsap.to("#preloader", {
      opacity: 0,
      duration: .8,
      ease: "power1.out",
      onComplete: () => {
        document.getElementById("preloader").style.display = "none";
      }
    });
  }, 1000);
}

tl = gsap.timeline();

tl.from('#primaryMenu', {
  display: 'none',
  y: '-100%',
  duration: .7,
  ease: "power4.out"
});

tl.from('.fade_in', {
  opacity: 0,
  stagger: .05,
  x: -20
});

// tl.pause().reverse();

tl.timeScale(1).pause().timeScale(2).reverse();

const toggleBtns = document.querySelectorAll(".primaryMenuToggler");
let isOpen = false;

toggleBtns.forEach(btn => {
  btn.addEventListener("click", function () {

    if (!isOpen) {

      // Open menu timeline
      tl.timeScale(1).play();

      // Menu → Close icon
      gsap.to(".menuIcon", {
        rotate: 90,
        opacity: 0,
        duration: 0.35,
        ease: "power3.out"
      });

      gsap.to(".closeIcon", {
        opacity: 1,
        rotate: 360,
        duration: 0.4,
        ease: "back.out(1.7)"
      });

    } else {

      // Close menu timeline
      tl.timeScale(2).reverse();

      // Close → Menu icon
      gsap.to(".closeIcon", {
        rotate: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in"
      });

      gsap.to(".menuIcon", {
        opacity: 1,
        rotate: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      });

    }

    isOpen = !isOpen;

  });
});

if (document.querySelectorAll(".tab")) {
  const tabs = document.querySelectorAll(".tab"),
    btns = document.querySelectorAll("button");

  function openTab(i) {
    tabs.forEach(t => t.classList.remove("active"));
    btns.forEach(b => b.classList.remove("active"));
    tabs[i].classList.add("active");
    btns[i].classList.add("active");
  }
}

// Two-dot cursor that follows the mouse using GSAP

setTimeout(() => {

  if (typeof gsap === 'undefined') return; // GSAP required
  if ('ontouchstart' in window) return; // skip on touch devices

  const small = document.createElement('div');

  small.className = 'cursor-dot cursor-dot--small';

  // Basic inline styles so no CSS edits needed
  Object.assign(small.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '15px',
    height: '15px',
    'borderRadius': '50%',
    background: '#fff',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    mixBlendMode: 'difference',
    opacity: 0,
  });

  document.body.appendChild(small);

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // Initialize positions using gsap.set for pixel-perfect placement
  gsap.set([small], { x: pos.x, y: pos.y });

  window.addEventListener('mousemove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;

    // Small dot — snappy
    gsap.to(small, {
      opacity: 1,
      x: pos.x,
      y: pos.y,
      duration: .5,
      ease: 'power3.out',
      overwrite: true
    });

  }, { passive: true });

  // Optional: hide when leaving the window
  window.addEventListener('mouseleave', () => {
    gsap.to([small], { opacity: 0, duration: 0.3, overwrite: true });
  });
  window.addEventListener('mouseenter', () => {
    gsap.to([small], { opacity: 1, duration: 0.25, overwrite: true });
  });

}, 5000);

// Gallery Lazy Loading with Infinite Scroll
(function () {
  // Support diary gallery, work gallery, work-post gallery, books gallery, and book-post gallery
  const galleryContainer = document.getElementById('gallery-container') ||
    document.getElementById('work-gallery-container') ||
    document.getElementById('work-post-gallery-container') ||
    document.getElementById('books-gallery-container') ||
    document.getElementById('book-post-gallery-container');
  if (!galleryContainer) return;

  const lazyItems = galleryContainer.querySelectorAll('.lazy-load');
  if (lazyItems.length === 0) return;

  // Intersection Observer for lazy loading
  const observerOptions = {
    root: null,
    rootMargin: '300px', // Start loading 200px before item is visible
    threshold: 0.1
  };

  const loadItem = function (item) {
    const type = item.dataset.type;
    const lazyClass = item.classList.contains('lazy-load');

    if (!lazyClass) return; // Already loaded

    // For work-post/book-post gallery, items are the container themselves
    // For work/books gallery, find the cover container
    const coverContainer = item.querySelector('.work-cover') || item.querySelector('.book-cover') || item;

    if (type === 'image') {
      const src = item.dataset.src;
      const alt = item.dataset.alt || '';
      if (src) {
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.src = src;
        img.alt = alt;
        // Check if this is work-post gallery (has pb-16/pb-32 classes)
        const hasMb12 = item.classList.contains('pb-16') || item.classList.contains('pb-32');
        img.className = hasMb12 ? 'w-full mb-12' : 'w-full';
        coverContainer.innerHTML = '';
        coverContainer.appendChild(img);
        item.classList.remove('lazy-load');
      }
    } else if (type === 'video') {
      const src = item.dataset.src;
      const mime = item.dataset.mime;
      if (src) {
        const video = document.createElement('video');
        video.className = 'w-full';
        video.controls = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('data-video-src', src);

        const source = document.createElement('source');
        source.src = src;
        // Use provided mime type, or fallback to detection from extension
        if (mime) {
          source.type = mime;
        } else {
          const ext = src.split('.').pop().toLowerCase();
          const mimeTypes = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'ogg': 'video/ogg',
            'mov': 'video/quicktime',
            'm4v': 'video/x-m4v'
          };
          source.type = mimeTypes[ext] || 'video/mp4'; // Default to MP4 for Safari compatibility
        }

        video.appendChild(source);
        video.appendChild(document.createTextNode('Your browser does not support the video tag.'));

        // Check if this is work-post gallery (has mb-12 class pattern)
        const hasMb12 = item.classList.contains('pb-16') || item.classList.contains('pb-32');
        if (hasMb12) {
          video.className = 'w-full mb-12';
        }

        coverContainer.innerHTML = '';
        coverContainer.appendChild(video);
        item.classList.remove('lazy-load');
      }
    } else if (type === 'youtube') {
      const youtubeUrl = item.dataset.youtubeUrl;
      if (youtubeUrl) {
        // Extract YouTube video ID from URL
        const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (videoId) {
          const wrapper = document.createElement('div');
          // Check if this is work-post gallery (has mb-12 class pattern)
          const hasMb12 = item.classList.contains('pb-16') || item.classList.contains('pb-32');
          wrapper.className = 'video-wrapper';
          wrapper.style.cssText = 'position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;' + (hasMb12 ? ' margin-bottom: 3rem;' : '');

          const iframe = document.createElement('iframe');
          // Use privacy-enhanced mode to reduce tracking/console errors
          iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0`;
          iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.loading = 'lazy';

          wrapper.appendChild(iframe);
          coverContainer.innerHTML = '';
          coverContainer.appendChild(wrapper);
          item.classList.remove('lazy-load');
        }
      }
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadItem(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all lazy items
  lazyItems.forEach(item => {
    observer.observe(item);
  });
})();

// Suppress YouTube/Google Ads console errors (they don't affect functionality)
(function () {
  const originalError = console.error;
  console.error = function (...args) {
    const message = args.join(' ');
    // Filter out YouTube/Google Ads tracking errors
    if (
      message.includes('googleads.g.doubleclick.net') ||
      message.includes('youtube.com/pagead') ||
      message.includes('CORS policy') && message.includes('youtube')
    ) {
      return; // Suppress these errors
    }
    originalError.apply(console, args);
  };
})();