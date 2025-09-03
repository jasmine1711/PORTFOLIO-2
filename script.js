// ================= MENU TOGGLE =================
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
// ================= LOADER FLOATING + ORBIT + FOCUS =================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const canvas = document.getElementById("circles");
  const ctx = canvas.getContext("2d");
  const profileCircle = document.getElementById("profileCircle");

  const assets = [
    { type: "video", thumb: "./assets/project-2.mp4" },
    { type: "video", thumb: "./assets/project-3.mp4" },
    { type: "video", thumb: "./assets/project-4.mp4" },
    { type: "image", src: "./assets/MY.jpeg" }
  ];

  let circles = [];
  let centerPhase = false; // flag for convergence

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Circle {
    constructor(asset, index) {
      this.baseRadius = 40 + Math.random() * 20;
      this.radius = this.baseRadius;
      this.orbitRadius = 100 + index * 120 + Math.random() * 40;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.005 + Math.random() * 0.004;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.loaded = false;
      this.cx = 0; // for convergence
      this.cy = 0;

      const palette = ["#DC7684", "#E4CA99", "#EAF2F4", "#2D7F9D", "#A4C9D7"];
      this.color = palette[Math.floor(Math.random() * palette.length)];

      if (asset.type === "image") {
        this.image = new Image();
        this.image.src = asset.src;
        this.image.onload = () => (this.loaded = true);
      } else if (asset.type === "video") {
        this.video = document.createElement("video");
        this.video.src = asset.thumb;
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.loop = true;
        this.video.autoplay = true;
        this.video.oncanplay = () => (this.loaded = true);
        this.video.play().catch(() => {});
      }
    }

    draw() {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      let x, y;
      if (centerPhase) {
        // converge to center
        this.cx += (cx - this.cx) * 0.05;
        this.cy += (cy - this.cy) * 0.05;
        x = this.cx;
        y = this.cy;
      } else {
        x = cx + Math.cos(this.angle) * this.orbitRadius;
        y = cy + Math.sin(this.angle) * this.orbitRadius;
      }

      ctx.save();

      // glow
      ctx.beginPath();
      ctx.arc(x, y, this.radius + 10, 0, Math.PI * 2);
      ctx.fillStyle = this.color + "55";
      ctx.shadowBlur = 40;
      ctx.shadowColor = this.color;
      ctx.fill();

      // clip
      ctx.beginPath();
      ctx.arc(x, y, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (this.loaded) {
        if (this.image) ctx.drawImage(this.image, x - this.radius, y - this.radius, this.radius * 2, this.radius * 2);
        else if (this.video) ctx.drawImage(this.video, x - this.radius, y - this.radius, this.radius * 2, this.radius * 2);
      } else {
        const gradient = ctx.createRadialGradient(x, y, this.radius * 0.2, x, y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.restore();
    }

    update() {
      if (!centerPhase) this.angle += this.speed;
      this.pulsePhase += 0.05;
      this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 8;
      this.draw();
    }
  }

  assets.forEach((a, i) => circles.push(new Circle(a, i)));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(c => c.update());
    requestAnimationFrame(animate);
  }
  animate();

  // sequence: orbit → converge → profile focus → fade
  setTimeout(() => {
    centerPhase = true;

    // after convergence, focus profile
    setTimeout(() => {
      profileCircle.classList.add("focus");

      setTimeout(() => {
        loader.classList.add("fade-out");
        document.body.style.overflow = "auto";
      }, 1500);
    }, 2000); // 2 seconds for convergence
  }, 6000); // 5 seconds orbit
});

// ================= OTHER EXISTING FEATURES =================
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
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
