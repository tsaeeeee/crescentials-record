document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".pricelist-container");

  container.innerHTML = `
    <div class="left">
      <div class="title-zone">
        <div class="title">Pick Your Packages</div>
      </div>
      <div class="picker-zone">
        <div class="picker" id="picker">
          <div class="picker-item">Full Package</div>
          <div class="picker-item">Compose Only</div>
          <div class="picker-item">Mix & Master</div>
          <div class="picker-item">Live Sequencer Set</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div id="details"></div>
      <div class="notes" id="notes">
        *Terms and conditions apply. Kindly contact us for custom projects. <br>
        *50% upfront payment required, with the remaining balance upon delivery. <br>
        *Standard delivery time is 7–14 working days depending on complexity.
      </div>
    </div>
  `;

  const picker = document.getElementById("picker");
  const items = Array.from(document.querySelectorAll(".picker-item"));
  const detailsBox = document.getElementById("details");
  const notes = document.getElementById("notes");

  const detailsData = [
    {
      price: "IDR 1,25Mio",
      points: [
        "Bring your own demo",
        "Any genre and instruments",
        "Include <span>mixing and mastering service</span>",
        "Get separated stems",
        "Get <span>5x revision</span> (Additional would be charged <span>IDR 75K</span>)",
        "Support until releases process (Optional)",
        "<span>Promo Toolkit</span> (By Request)"
      ]
    },
    {
      price: "IDR 850K",
      points: [
        "Bring your own demo",
        "Any genre and instruments",
        "Get separated stems",
        "Get <span>5x revision</span> (Additional would be charged <span>IDR 75K</span>)"
      ]
    },
    {
      price: "IDR 650K",
      points: [
        "Bring your own stems",
        "Any genre and instruments",
        "Get <span>5x revision</span> (Additional would be charged <span>IDR 75K</span>)"
      ]
    },
    {
      price: "IDR 450K",
      points: [
        "Any songs, any genre and instruments",
        "Include cue and guide",
        "Get separated file stems",
        "Get <span>5x revision</span> (Additional would be charged <span>IDR 75K</span>)"
      ]
    }
  ];

  let currentIndex = 0;
  let isAnimating = false;

  function updatePicker() {
    items.forEach((item, i) => {
      const diff = Math.abs(i - currentIndex);
      if (diff === 0) {
        item.style.opacity = "1";
        item.style.transform = "scale(1.1)";
      } else if (diff === 1) {
        item.style.opacity = "0.5";
        item.style.transform = "scale(1)";
      } else if (diff === 2) {
        item.style.opacity = "0.15";
        item.style.transform = "scale(0.95)";
      } else {
        item.style.opacity = "0";
        item.style.transform = "scale(0.9)";
      }
    });
  }

  function updateDetails(index) {
    const data = detailsData[index];
    const html = `
      <h1 class="price">${data.price}</h1>
      <ul>
        ${data.points.map(p => `<li>${p}</li>`).join("")}
      </ul>
    `;

    gsap.to(detailsBox, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        detailsBox.innerHTML = html;

        const elements = detailsBox.querySelectorAll("h1, li");
        gsap.set(elements, { opacity: 0, y: -20 });

        gsap.to(detailsBox, { opacity: 1, duration: 0.2 });
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out"
        });
      }
    });
  }

  function movePicker(direction) {
    if (isAnimating) return;
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < items.length) {
      currentIndex = newIndex;
      isAnimating = true;

      updateDetails(currentIndex);

      gsap.to(picker, {
        y: -currentIndex * 115,
        duration: 0.4,
        ease: "power3.out",
        onUpdate: updatePicker,
        onComplete: () => {
          isAnimating = false;
        }
      });
    }
  }

  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) movePicker(1);
    else movePicker(-1);
  });

  items.forEach((item, i) => {
    item.addEventListener("click", () => {
      if (i !== currentIndex) {
        currentIndex = i;
        updateDetails(currentIndex);

        gsap.to(picker, {
          y: -currentIndex * 100,
          duration: 0.4,
          ease: "power3.out",
          onUpdate: updatePicker,
          onComplete: () => {
            isAnimating = false;
          }
        });
      }
    });
  });

  // Initial render
  updatePicker();
  updateDetails(currentIndex);

  // Animate notes once on load
  gsap.fromTo(notes, 
    { opacity: 0, y: 20 },
    { opacity: 0.9, y: 0, duration: 1, ease: "power2.out", delay: 0.5 }
  );
});
