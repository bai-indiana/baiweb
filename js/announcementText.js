// announcementText.js


(function () {
  // Inject required CSS for animation
  const style = document.createElement("style");
  style.textContent = `
    .letter {
      opacity: 0;
      transition: opacity 0.2s ease-in;
    }
    .letter.visible {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // Reusable function for announcement-style animated text
  function animateAnnouncementText(span, options = {}) {
    const originalText = span.textContent;
    span.dataset.originalText = originalText;

    const typingSpeed = options.speed || 150;
    const showDelay = options.showDelay || 1000;
    const buffer = options.buffer || 1000;
    const cycleDuration = showDelay + (originalText.length * typingSpeed) + buffer;

    function animateOnce() {
      span.textContent = originalText;

      setTimeout(() => {
        span.textContent = "";

        [...originalText].forEach((char, index) => {
          const letterSpan = document.createElement("span");
          letterSpan.textContent = char;
          letterSpan.classList.add("letter");
          span.appendChild(letterSpan);

          setTimeout(() => {
            letterSpan.classList.add("visible");
          }, index * typingSpeed);
        });
      }, showDelay);
    }

    animateOnce();
    setInterval(animateOnce, cycleDuration);
  }

  // Auto-apply to all elements with class 'announcement-text'
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".announcement-text").forEach(span => {
      animateAnnouncementText(span);
    });
  });

  // Expose function globally for manual calls if needed
  window.animateAnnouncementText = animateAnnouncementText;
})();
