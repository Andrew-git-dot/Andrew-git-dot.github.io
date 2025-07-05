<script>
  document.addEventListener("DOMContentLoaded", function () {
    let currentSlide = 0;
    const container = document.getElementById('skills-carousel');
    const slides = container.querySelectorAll('.carousel-slide');

    function scrollCarousel(direction) {
      const slideWidth = slides[0].offsetWidth;
      currentSlide = Math.min(Math.max(currentSlide + direction, 0), slides.length - 1);
      container.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      });
    }

    // Expose to global scope so onclick works
    window.scrollCarousel = scrollCarousel;
  });
</script>