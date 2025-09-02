// ================= MENU TOGGLE =================
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// ================= LOADER FLOATING CIRCLES =================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const canvas = document.getElementById("circles");
  const ctx = canvas.getContext("2d");
  const profileCircle = document.getElementById("profileCircle");

  // ✅ Assets to float
  const assets = [
    { type: "video", src: "./assets/project-2.mp4", thumb: "./assets/project-1.jpg" },
    { type: "video", src: "./assets/project-3.mp4", thumb: "./assets/project-2.jpg" },
    { type: "video", src: "./assets/project-4.mp4", thumb: "./assets/project-3.jpg" },
    { type: "image", src: "./assets/MY.jpeg" } // profile image
  ];

  let circles = [];

  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Circle object with spring-like floating motion
  class Circle {
    constructor(asset) {
      this.asset = asset;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = 60;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.002 + Math.random() * 0.003;
      this.image = new Image();
      this.image.src = asset.type === "image" ? asset.src : asset.thumb;
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      ctx.restore();
    }

    update() {
      this.angle += this.speed;
      this.x += Math.sin(this.angle) * 0.5;
      this.y += Math.cos(this.angle) * 0.5;
      this.draw();
    }
  }

  // Create circles
  assets.forEach(asset => {
    circles.push(new Circle(asset));
  });

  // Animate floating
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update());
    requestAnimationFrame(animate);
  }
  animate();

  // ✅ After 5s → move profileCircle to center → zoom in → fade loader
  setTimeout(() => {
    // Step 1: Move to center
    profileCircle.style.transition = "all 1.5s ease-in-out";
    profileCircle.style.left = `${window.innerWidth / 2 - profileCircle.offsetWidth / 2}px`;
    profileCircle.style.top = `${window.innerHeight / 2 - profileCircle.offsetHeight / 2}px`;

    // Step 2: Zoom in after move completes
    setTimeout(() => {
      profileCircle.classList.add("focus");

      // Step 3: Fade loader out after zoom
      setTimeout(() => {
        loader.classList.add("fade-out");
        document.body.style.overflow = "auto";
      }, 1500);
    }, 1500);
  }, 5000);
});

// ================= OTHER EXISTING FEATURES =================
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  const sections = document.querySelectorAll("section");
  const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  };
  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });
  sections.forEach(section => sectionObserver.observe(section));

  const profile = document.getElementById("profile");
  if (profile) profile.classList.add("visible");

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
        if (window.innerWidth <= 1200) toggleMenu();
      }
    });
  });

  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
      card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.2)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
      card.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    });
  });

  const arrows = document.querySelectorAll(".arrow");
  arrows.forEach(arrow => {
    arrow.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", () => {
      arrow.style.display = window.scrollY > 500 ? "flex" : "none";
    });
  });

  const profileText = document.querySelector(".section__text__p2");
  if (profileText) {
    profileText.style.animation = "none";
    setTimeout(() => {
      profileText.style.animation =
        "typing 3.5s steps(40, end), blink 0.75s step-end infinite";
    }, 10);
  }

  const projectVideos = document.querySelectorAll(".project-video");
  projectVideos.forEach(video => {
    const container = video.parentElement;
    container.addEventListener("mouseenter", () => video.play());
    container.addEventListener("mouseleave", () => video.pause());
    container.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
    });
  });
});
