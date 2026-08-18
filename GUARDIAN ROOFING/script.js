const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.site-nav a');
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxTitle = document.querySelector('.lightbox-title');

function setHeaderState() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

function setActiveNavLink() {
  const scrollPos = window.scrollY + 140;
  let currentSection = 'home';

  document.querySelectorAll('main section[id]').forEach((section) => {
    if (scrollPos >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentSection}`;
    link.classList.toggle('active', isActive);
  });
}

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('show');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 760) {
      siteNav.classList.remove('show');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
});

window.addEventListener('scroll', () => {
  setHeaderState();
  setActiveNavLink();
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    siteNav.classList.remove('show');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
});

setHeaderState();
setActiveNavLink();

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    galleryCards.forEach((card) => {
      const category = card.dataset.category;
      const type = card.dataset.type || 'image';
      const matchesType = filter === 'images' ? type === 'image' : filter === 'videos' ? type === 'video' : true;
      const matchesCategory = filter === 'all' || filter === 'images' || filter === 'videos' ? true : category === filter;
      card.style.display = matchesType && matchesCategory ? 'flex' : 'none';
    });
  });
});

galleryCards.forEach((card) => {
  card.addEventListener('click', () => {
    const type = card.dataset.type || 'image';
    lightboxMedia.innerHTML = '';

    if (type === 'video') {
      const videoSrc = card.dataset.videoSrc || card.dataset.videoUrl;
      if (videoSrc && videoSrc.toLowerCase().endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.muted = false;
        video.style.maxHeight = '100%';
        lightboxMedia.appendChild(video);
      } else {
        const iframe = document.createElement('iframe');
        iframe.src = videoSrc || card.dataset.videoUrl;
        iframe.allow = 'autoplay; fullscreen';
        iframe.allowFullscreen = true;
        lightboxMedia.appendChild(iframe);
      }
      lightboxMedia.classList.add('has-video');
    } else {
      const image = document.createElement('img');
      image.src = card.dataset.mediaSrc || card.querySelector('img')?.getAttribute('src');
      image.alt = 'Gallery image';
      lightboxMedia.appendChild(image);
      lightboxMedia.classList.remove('has-video');
    }

    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

lightboxClose.addEventListener('click', () => {
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxMedia.innerHTML = '';
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxMedia.innerHTML = '';
  }
});

// Carousel functionality
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track || track.children.length === 0) return;
  
  let currentIndex = 0;
  const totalCards = track.children.length;
  
  function slideCarousel() {
    currentIndex = (currentIndex + 1) % totalCards;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  
  // Start carousel after a short delay to ensure DOM is ready
  setTimeout(() => {
    slideCarousel();
    setInterval(slideCarousel, 4500);
  }, 100);
}

// Contact form WhatsApp integration
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const whatsappNumber = '233549835040';
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = (formData.get('name') || '').trim() || 'Customer';
    const phone = (formData.get('phone') || '').trim() || 'N/A';
    const location = (formData.get('location') || '').trim() || 'N/A';
    const message = (formData.get('message') || '').trim() || 'No message provided';
    
    const whatsappMessage = `Hello Guardian Roofing,\n\nMy name is ${name}.\nPhone: ${phone}\nLocation: ${location}\n\nMessage: ${message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    contactForm.reset();
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initContactForm();
  });
} else {
  initCarousel();
  initContactForm();
}
