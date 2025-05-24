function updateBorderProgress(video, wrapper) {
  const top = wrapper.querySelector('.v-top');
  const right = wrapper.querySelector('.v-right');
  const bottom = wrapper.querySelector('.v-bottom');
  const left = wrapper.querySelector('.v-left');

  const width = video.offsetWidth;
  const height = video.offsetHeight;
  const perimeter = 2 * (width + height);

  function animate() {
    if (!video.paused && !video.ended) {
      const percent = (video.currentTime / video.duration) * 100;
      const progressPx = (percent / 100) * perimeter;
      let remaining = progressPx;

      top.style.width = `${Math.min(remaining, width)}px`;
      remaining -= Math.min(remaining, width);

      right.style.height = `${Math.min(remaining, height)}px`;
      remaining -= Math.min(remaining, height);

      bottom.style.width = `${Math.min(remaining, width)}px`;
      remaining -= Math.min(remaining, width);

      left.style.height = `${Math.min(remaining, height)}px`;
      requestAnimationFrame(animate);
    }
  }
  animate();
}

function initMediaCarousel(mediaWidth, mediaHeight, imageDelay) {
  document.documentElement.style.setProperty('--custom-media-width', mediaWidth + 'px');
  document.documentElement.style.setProperty('--custom-media-height', mediaHeight + 'px');

  const container = document.getElementById('custom-carousel-inner');
  const items = container.querySelectorAll('.custom-media-item');
  const dotsContainer = document.getElementById('custom-carousel-dots');
  let currentIndex = 0;
  let timeout = null;

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
        updateBorderProgress(media, media.parentElement);
        media.onended = () => showItem(index + 1);
      }).catch(() => {
        timeout = setTimeout(() => showItem(index + 1), imageDelay);
      });
    }
  }

  document.querySelectorAll('.custom-mute-button').forEach(button => {
    button.addEventListener('click', () => {
      const video = button.previousElementSibling;
      video.muted = !video.muted;
      button.textContent = video.muted ? '🔇' : '🔊';
    });
  });

  showItem(0);
}