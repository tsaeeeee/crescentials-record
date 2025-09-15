// Auto-update tahun
document.getElementById("year").textContent = new Date().getFullYear();

// Animate elemen utama contact
const mainElements = document.querySelectorAll(
  "#contact .subtitle, #contact h1, #contact .contact-items .row a"
);

gsap.set(mainElements, { y: 10, opacity: 0 });
gsap.to(mainElements, {
  opacity: 1,
  y: 0,
  duration: 0.5,
  stagger: 0.1,
  ease: "power2.out",
  delay: 0.3
});

// Animate footer terpisah
gsap.fromTo(
  "#contact .footer",
  { opacity: 0, y: 10 },
  {
    opacity: 0.8,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    delay: 1.2
  }
);
