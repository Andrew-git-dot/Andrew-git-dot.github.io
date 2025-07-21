document.addEventListener('DOMContentLoaded', function () {
  // ===== NAVIGATION SCROLL/ACTIVE LINK =====
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const hamburger = document.getElementById('hamburger');
  const dropdownMenu = document.createElement('ul');
  const navRight = document.querySelector('.nav-right');
  const navMenuLinks = document.querySelectorAll('.nav-menu li a');

  dropdownMenu.classList.add('dropdown-menu');
  navRight.appendChild(dropdownMenu);

  navMenuLinks.forEach(link => {
    const clonedLink = link.cloneNode(true);
    const li = document.createElement('li');
    li.appendChild(clonedLink);
    dropdownMenu.appendChild(li);
  });

  function onScroll() {
    const scrollPos = window.scrollY;
    header.classList.toggle('scrolled', scrollPos > 0);

    const scrollMiddle = scrollPos + window.innerHeight / 2;
    sections.forEach(section => {
      if (scrollMiddle >= section.offsetTop && scrollMiddle < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const sectionId = section.getAttribute('id');
          const linkHref = link.getAttribute('href').substring(1);
          if (sectionId !== 'home' && sectionId === linkHref) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  hamburger.addEventListener('click', () => {
    dropdownMenu.classList.toggle('open');
  });

  dropdownMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
      dropdownMenu.classList.remove('open');
    });
  });

  // ===== CAROUSEL FUNCTIONALITY =====
  const carousel = document.getElementById('skills-carousel');
  const slides = carousel.querySelectorAll('.carousel-slide');
  let currentIndex = 0;
  let isTransitioning = false;

  function scrollCarousel(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    const totalSlides = slides.length;
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;

    const slideWidth = carousel.querySelector('.carousel-slide').offsetWidth;

    carousel.scrollTo({
      left: slideWidth * currentIndex,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  // Expose to global for button onclick use
  window.scrollCarousel = scrollCarousel;

  // ===== SWIPE SUPPORT =====
  let startX = 0;
  let endX = 0;

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  });

  carousel.addEventListener('touchend', () => {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        scrollCarousel(1); // swipe left
      } else {
        scrollCarousel(-1); // swipe right
      }
    }
  });

  // ===== LANGUAGE TOGGLE WITH COMPLETE TRANSLATIONS =====
  const switchInput = document.getElementById('language-switch');

  let translations = {};

  fetch('translations.json')
    .then(response => response.json())
    .then(data => {
      translations = data;
      setupLanguageToggle(); // init once data is ready
    })
    .catch(error => console.error('Failed to load translations:', error));

  function setupLanguageToggle() {
    const savedLang = localStorage.getItem('lang') || 'en';
    switchInput.checked = savedLang === 'jp';
    applyLanguage(savedLang);

    switchInput.addEventListener('change', () => {
      const lang = switchInput.checked ? 'jp' : 'en';
      localStorage.setItem('lang', lang);
      applyLanguage(lang);
    });
  }

  function applyLanguage(lang) {
    // Main section headers
    document.getElementById('bodyHeader').textContent = translations[lang].skills;
    document.querySelector("#about h1").textContent = translations[lang].aboutMe;
    document.querySelector("#Projects h1").textContent = translations[lang].projects;
    document.querySelector("#contact h1").textContent = translations[lang].contact;
    
    // Home section
    document.querySelector("#home p").textContent = translations[lang].tagline;
    
    // About section content
    const aboutParagraphs = document.querySelectorAll("#about p");
    aboutParagraphs[0].textContent = translations[lang].welcomeMsg; // Welcome message
    aboutParagraphs[1].textContent = translations[lang].aboutParagraph; // Main about paragraph
    
    // Projects section subtitle
    document.querySelector("#Projects p").textContent = translations[lang].projectsSubtitle;
    
    // Contact section
    document.querySelector("#contact p").textContent = translations[lang].findMe;
    document.querySelector(".resume-button").textContent = translations[lang].resume;

    // Navigation menu
    document.querySelectorAll(".nav-menu li a").forEach((a, i) => {
      a.textContent = translations[lang].nav[i];
    });

    // Dropdown menu
    dropdownMenu.querySelectorAll("li a").forEach((a, i) => {
      a.textContent = translations[lang].nav[i];
    });

    // Carousel slides content
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const skillsData = translations[lang].carouselSkills;
    
    // Update Data Science slide
    if (carouselSlides[0]) {
      const slide1 = carouselSlides[0];
      slide1.querySelector('h3').textContent = skillsData.dataScience.title;
      const slide1Paragraphs = slide1.querySelectorAll('p');
      skillsData.dataScience.items.forEach((item, i) => {
        if (slide1Paragraphs[i]) {
          slide1Paragraphs[i].textContent = item;
        }
      });
    }

    // Update Tools slide
    if (carouselSlides[1]) {
      const slide2 = carouselSlides[1];
      slide2.querySelector('h3').textContent = skillsData.tools.title;
      const slide2Paragraphs = slide2.querySelectorAll('p');
      skillsData.tools.items.forEach((item, i) => {
        if (slide2Paragraphs[i]) {
          slide2Paragraphs[i].textContent = item;
        }
      });
    }

    // Update Languages slide
    if (carouselSlides[2]) {
      const slide3 = carouselSlides[2];
      slide3.querySelector('h3').textContent = skillsData.languages.title;
      const slide3Paragraphs = slide3.querySelectorAll('p');
      skillsData.languages.items.forEach((item, i) => {
        if (slide3Paragraphs[i]) {
          slide3Paragraphs[i].textContent = item;
        }
      });
    }
  }
});