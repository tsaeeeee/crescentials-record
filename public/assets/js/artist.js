const detailsContainer = document.getElementById("artistDetails");
const imageContainer = document.getElementById("artistImages");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Cache for preloaded images
const imageCache = new Map();
let isTransitioning = false;

const artistData = [
  {
    name: "Yahya Fadhilah",
    bio: "Yahya (born May 4th, 2000) is the stage name of Yahya Fadhilah, an Indonesian singer-songwriter based in Bandung. His first introduction to music was at the age of 12 as an acoustic fingerstyle guitarist.",
    image: "assets/images/edited/artis_yahya.png",
    socials: {
      instagram : "https://www.instagram.com/yahyafadhilah/",
      spotify: "https://open.spotify.com/artist/2x49HGCVPqbRxecj0PZq2R?si=6CZc7CQ2RCivU9cjqjW-jA",
      youtube: "https://www.youtube.com/@Yahya2000",
    },
    tracks: [
      "https://open.spotify.com/embed/track/3Sbova9DAY3pc9GTAACT4b?si=99a3e285284843fe",
      "https://open.spotify.com/embed/track/2XhXW3bXnbcowuWygaR26a?si=0eaa0f5b58af42f2",
      "https://open.spotify.com/embed/track/1RwKF4H3Bq567IjRdwwYBq?si=c76540e3bc8149ea",
      "https://open.spotify.com/embed/track/4iF9NHQR3Cki2nT3OkbzO8?si=c64e8ec1f0004b41"
    ]
  },
  {
    name: "Pasha Qonia",
    bio: "Pasha Qonia, a 20-year-old solo artist, brings the nostalgic vibes of 90s digital vintage pop to the modern music scene. Pasha's sound is a harmonious blend of past and present. Her evolving musical focus captures the essence of retro pop while infusing it with a contemporary twist. Join Pasha on her musical journey and relive the golden era of pop with every track.",
    image: "assets/images/edited/artis_pasha.png",
    socials: {
      instagram: "https://www.instagram.com/pashaqonia/",
      spotify: "https://open.spotify.com/artist/2D0x2GV8zipTfCn4jZBQPL?si=DjHqUfn5TXaAZzS4JlZDug",
      youtube: "https://www.youtube.com/@pashaqoniamusic"
    },
    tracks: [
      "https://open.spotify.com/embed/track/199kxeohm3PQ8bhkUHE796?si=118eca96caec4ab7",
      "https://open.spotify.com/embed/track/3f4gA5sfmvLjYb6XlH0y7P?si=3f4dd21c46dc4b3a",
      "https://open.spotify.com/embed/track/58JRlCPbZU8d39GP5vnCXj?si=a9a2b19466c94dd8"
    ]
  },
  {
    name: "Cresc",
    bio: "Music producer from Bandung, Indonesia. Specializing in EDM, Cresc craft unique tracks that blend the high-energy vibes of dubstep, house, and hip-hop. His journey began as a music producer started with collaborating with Yahya ‘keepyousafe’, but now he stand solo, he create something his own essentials.",
    image: "assets/images/edited/artis_cresc.png",
    socials: {
      instagram: "https://www.instagram.com/tsabitimanadi/",
      spotify: "https://open.spotify.com/artist/0Epj9WoMxamiSq3liwaR0Q?si=hV-R4RRKQ4G8_SxmL0g-mQ"
    },
    tracks: [
      "https://open.spotify.com/embed/album/6VXdPMGjphrWTQv3XdqBob?si=4bkaLOogSuOr-Q3cCsHp2w",
      "https://open.spotify.com/embed/track/3VDAvdC4jPBp0gPOfW6P1Z?si=6f68559c238542b8"
    ]
  },
  {
    name: "Tania Asyura",
    bio: "Hello universe! I'm Tania Asyura as a singer songwriter from Indonesia. me and my little masterpiece intend to create goodness for world peace through 'Manusia yang Membaik'.",
    image: "assets/images/edited/artis_tania.png",
    socials: {
      instagram: "https://www.instagram.com/taniaasyura/",
      spotify: "https://open.spotify.com/artist/6EIzUVvaIzA1xr8JgtmW6S?si=FsuBq-c7QRaJJwUcgPyoqQ"
    },
    tracks: [
      "https://open.spotify.com/embed/track/5S2dmWAwdz5DyhoPVDCgZq?si=7161acda14ea4ef4"
    ]
  },
  {
    name: "Reby Aqqila",
    bio: "A singer/songwriter/composer who was born on 1999 in Bandung and a music lover since she was a kid. A storyteller through her lyrics and music. She couldn‘t play any instrument but she can made her own music only by her heart and mind.",
    image: "assets/images/edited/artis_reby.png",
    socials: {
      instagram: "https://www.instagram.com/rebyaqqilaa/",
      spotify: "https://open.spotify.com/artist/4t2ITdM4cG9f0RvQJxwAQQ?si=_QimQzxgT6S9zW7kiMPiHQ"
    },
    tracks: [
      "https://open.spotify.com/embed/album/1OYEYIEHIOuiQtCRVKJ4XS?si=wAHwHhPtRF2db7buhhybwg"
    ]
  }
];

let currentIndex = 0;

// Preload all images
function preloadImages() {
  artistData.forEach((artist, index) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(index, img);
    };
    img.src = artist.image;
  });
}

// Generate content dynamically without caching
function generateContent(index) {
  const artist = artistData[index];
  
  // Generate socials
  let socialsHTML = '';
  for (const [platform, url] of Object.entries(artist.socials)) {
    const iconMap = {
      instagram: "ri-instagram-line",
      youtube: "ri-youtube-line",
      spotify: "ri-spotify-line"
    };
    if (iconMap[platform]) {
      socialsHTML += `<a href="${url}" target="_blank"><i class="${iconMap[platform]}"></i></a>`;
    }
  }

  // Create content element
  const contentElement = document.createElement('div');
  contentElement.className = 'artist-content';
  contentElement.innerHTML = `
    <h2>${artist.name}</h2>
    <p>${artist.bio}</p>
    <div class="socials">${socialsHTML}</div>
    <h3 class="releases-label" style="margin-bottom: 20px;">Releases</h3>
    <div class="spotify-tracks">
      ${artist.tracks.map((track, trackIndex) => `
        <div class="spotify-track-wrapper" style="opacity: 0; transform: translateY(20px);">
          <div class="spotify-skeleton" style="display: flex;">
            <div class="skeleton-album-art"></div>
            <div class="skeleton-details">
              <div class="skeleton-track-title"></div>
              <div class="skeleton-artist-name"></div>
              <div class="skeleton-playback-bar"></div>
            </div>
          </div>
          <iframe 
            src="${track}" 
            frameborder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            style="opacity: 0; transition: opacity 0.4s ease;"
            onload="this.style.opacity='1'; this.previousElementSibling.style.display='none';"
          ></iframe>
        </div>
      `).join('')}
    </div>
  `;
  
  return contentElement;
}

// Generate image slides dynamically with preloaded images
function setupImageSlides() {
  artistData.forEach((artist, i) => {
    const img = document.createElement("img");
    img.src = artist.image;
    img.style.opacity = '0';
    if (i === 0) {
      img.classList.add("active");
      img.style.opacity = '1';
    }
    imageContainer.appendChild(img);
  });
}

function showImage(index, direction) {
  const images = document.querySelectorAll("#artistImages img");
  if (isTransitioning || index === currentIndex || !images.length) return;
  
  isTransitioning = true;
  const current = images[currentIndex];
  const next = images[index];

  // Update content immediately when transition starts
  updateContent(index);

  // Smoother image transition with overlap
  gsap.timeline()
    .to(current, { 
      x: direction === 'next' ? '-100%' : '100%', 
      opacity: 0, 
      duration: 0.6,
      ease: "power2.inOut"
    })
    .fromTo(next, 
      { 
        x: direction === 'next' ? '100%' : '-100%', 
        opacity: 0 
      },
      { 
        x: '0%', 
        opacity: 1, 
        duration: 0.6,
        ease: "power2.inOut"
      }, 
      "-=0.3" // Start next image animation 0.3s before current finishes
    )
    .call(() => {
      current.classList.remove("active");
      next.classList.add("active");
      currentIndex = index;
      isTransitioning = false;
      updateButtonStates(); // Re-enable buttons
    });
}

function updateContent(index) {
  // Clean up existing iframes to prevent memory leaks
  const existingIframes = detailsContainer.querySelectorAll('iframe');
  existingIframes.forEach(iframe => {
    iframe.src = 'about:blank';
    iframe.remove();
  });
  
  // Generate fresh content each time
  const newContent = generateContent(index);
  const textElements = newContent.querySelectorAll("h2, p, .socials, .releases-label");
  const spotifyWrappers = newContent.querySelectorAll(".spotify-track-wrapper");
  
  // Set initial state for animation
  gsap.set(textElements, { opacity: 0, y: 20 });
  gsap.set(spotifyWrappers, { opacity: 0, y: 30 });
  
  // Fade out current content
  const currentElements = detailsContainer.querySelectorAll("h2, p, .socials, .releases-label, .spotify-track-wrapper");
  
  if (currentElements.length > 0) {
    gsap.to(currentElements, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        // Replace content
        detailsContainer.innerHTML = '';
        detailsContainer.appendChild(newContent);
        
        // Animate in text content first
        gsap.to(textElements, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out"
        });
        
        // Animate in Spotify tracks with longer stagger for smoother feel
        gsap.to(spotifyWrappers, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out"
        });
      }
    });
  } else {
    // First load - no fade out needed
    detailsContainer.innerHTML = '';
    detailsContainer.appendChild(newContent);
    
    // Animate in text content first
    gsap.to(textElements, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.out"
    });
    
    // Animate in Spotify tracks with longer stagger
    gsap.to(spotifyWrappers, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      delay: 0.2,
      ease: "power2.out"
    });
  }
}

// Throttled navigation to prevent rapid clicking
let lastNavigationTime = 0;
const navigationThrottle = 800; // Minimum time between navigations

// Add loading indicator
function updateButtonStates() {
  const buttons = document.querySelectorAll('.artist-nav button');
  buttons.forEach(btn => {
    btn.disabled = isTransitioning;
    if (isTransitioning) {
      btn.style.opacity = '0.5';
    } else {
      btn.style.opacity = '1';
    }
  });
}

prevBtn.addEventListener("click", () => {
  const now = Date.now();
  if (now - lastNavigationTime < navigationThrottle || isTransitioning) return;
  lastNavigationTime = now;
  
  let nextIndex = (currentIndex - 1 + artistData.length) % artistData.length;
  updateButtonStates();
  showImage(nextIndex, 'prev');
});

nextBtn.addEventListener("click", () => {
  const now = Date.now();
  if (now - lastNavigationTime < navigationThrottle || isTransitioning) return;
  lastNavigationTime = now;
  
  let nextIndex = (currentIndex + 1) % artistData.length;
  updateButtonStates();
  showImage(nextIndex, 'next');
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    prevBtn.click();
  } else if (e.key === 'ArrowRight') {
    nextBtn.click();
  }
});

// Initialize everything
function initializeArtistSection() {
  preloadImages();
  setupImageSlides();
  updateContent(0);
  updateButtonStates();
}

document.addEventListener('DOMContentLoaded', initializeArtistSection);

// If DOM is already loaded
if (document.readyState === 'loading') {
  // Do nothing, event listener above will handle it
} else {
  initializeArtistSection();
}
