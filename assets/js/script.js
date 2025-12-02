if (document.querySelector(".counter")) {
  let count = { value: 0 };

  gsap.to(count, {
    value: 100,
    duration: 2,
    ease: "power4.out",
    onUpdate: () => {
      document.querySelector(".counter").textContent = Math.floor(count.value) + "%";
    }
  });

  const tl1 = gsap.timeline({ delay: 1.8 });

  tl1.to(".reveal", {
    height: "100%",
    duration: 1,
    ease: "expo.inOut"
  })
    .to("#loader", {
      y: "-100%",
      duration: 1,
      ease: "expo.inOut"
    })
    .set("body", { overflow: "auto" });
}

tl2 = gsap.timeline();

tl2.from('#primaryMenu', {
  display: 'none',
  y: '-100%',
  duration: .7,
  ease: "power4.out"
});

tl2.from('.fade_in', {
  opacity: 0,
  stagger: .1,
  x: -10
});

tl2.pause().reverse();

const toggleBtns = document.querySelectorAll(".primaryMenuToggler");
let isOpen = false;

toggleBtns.forEach(btn => {
  btn.addEventListener("click", function () {

    if (!isOpen) {

      // Open menu timeline
      tl2.play();

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
      tl2.reverse();

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
  const big = document.createElement('div');

  small.className = 'cursor-dot cursor-dot--small';
  big.className = 'cursor-dot cursor-dot--big';

  // Basic inline styles so no CSS edits needed
  Object.assign(small.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '8px',
    height: '8px',
    'borderRadius': '50%',
    background: '#fff',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    mixBlendMode: 'difference',
    opacity: 0,
  });

  Object.assign(big.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '40px',
    height: '40px',
    'borderRadius': '50%',
    border: '2px solid #fff',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    mixBlendMode: 'difference',
    opacity: 0,
  });

  document.body.appendChild(big);
  document.body.appendChild(small);

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // Initialize positions using gsap.set for pixel-perfect placement
  gsap.set([small, big], { x: pos.x, y: pos.y });

  window.addEventListener('mousemove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;

    // Small dot — snappy
    gsap.to(small, {
      opacity: 1,
      x: pos.x,
      y: pos.y,
      duration: 0.08,
      ease: 'power3.out',
      overwrite: true
    });

    // Big dot — trailing
    gsap.to(big, {
      opacity: 1,
      x: pos.x,
      y: pos.y,
      duration: 0.38,
      ease: 'power3.out',
      overwrite: true
    });
  }, { passive: true });

  // Optional: hide when leaving the window
  window.addEventListener('mouseleave', () => {
    gsap.to([small, big], { opacity: 0, duration: 0.3, overwrite: true });
  });
  window.addEventListener('mouseenter', () => {
    gsap.to([small, big], { opacity: 1, duration: 0.25, overwrite: true });
  });

}, 5000);

// Load random image once on page load
(() => {
  const randomImageElement = document.getElementById('randomImage');
  if (!randomImageElement) return;

  // Array of 10 images
  const images = [
    'assets/images/image-1.webp',
    'assets/images/image-2.webp',
    'assets/images/image-3.webp',
    'assets/images/image-4.webp',
    'assets/images/image-5.webp',
    'assets/images/image-6.webp',
    'assets/images/image-7.webp',
    'assets/images/image-8.webp',
    'assets/images/image-9.webp',
    'assets/images/image-10.webp',
  ];

  // Select random image
  const randomIndex = Math.floor(Math.random() * images.length);
  const randomImagePath = images[randomIndex];

  // Set the image source
  randomImageElement.src = randomImagePath;
})();

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother = ScrollSmoother.create({
  smooth: 2,
  effects: true
});