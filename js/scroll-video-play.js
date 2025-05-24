function initMediaCarousel(mediaWidth, mediaHeight, imageDelay) {
  document.documentElement.style.setProperty('--custom-media-width', mediaWidth + 'px');
  document.documentElement.style.setProperty('--custom-media-height', mediaHeight + 'px');

  const container = document.getElementById('custom-carousel-inner');
  const items = container.querySelectorAll('.custom-media-item');
  const dotsContainer = document.getElementById('custom-carousel-dots');
  let currentIndex = 0;
  let timeout = null;

  // Create dots
  dotsContainer.innerHTML = '';
  items.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.textContent = i + 1;
    dot.addEventListener('click', () => {
      clearTimeout(timeout);
      showItem(i);
    });
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('.dot');

  function showItem(index) {
    if (index >= items.length) index = 0;
    currentIndex = index;

    container.style.transform = `translateX(-${index * mediaWidth}px)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');

    items.forEach(item => {
      item.classList.remove('video-active');
      const video = item.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    const currentItem = items[index];
    const media = currentItem.querySelector('img, video');

    if (media.tagName === 'IMG') {
      timeout = setTimeout(() => showItem(index + 1), imageDelay);
    } else if (media.tagName === 'VIDEO') {
      currentItem.classList.add('video-active');
      media.play().then(() => {
        media.onended = () => showItem(index + 1);
      }).catch(() => {
        timeout = setTimeout(() => showItem(index + 1), imageDelay);
      });
    }
  }

  // Mute/unmute toggle
  document.querySelectorAll('.custom-mute-button').forEach(button => {
    button.addEventListener('click', () => {
      const video = button.previousElementSibling;
      video.muted = !video.muted;
      button.textContent = video.muted ? '🔇' : '🔊';
    });
  });

  showItem(0);
}
