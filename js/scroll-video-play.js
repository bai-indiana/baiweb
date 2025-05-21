function initMediaCarousel(width, height, imageDelay) {
  document.documentElement.style.setProperty('--custom-media-width', width + 'px');
  document.documentElement.style.setProperty('--custom-media-height', height + 'px');

  const container = document.getElementById('custom-carousel-inner');
  const items = container.querySelectorAll('.custom-media-item');
  const dotsContainer = document.getElementById('custom-carousel-dots');
  let currentIndex = 0;
  let timeout = null;

  // Create dots with numbers
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

  function resetProgressBars(progressBars) {
    progressBars.top.style.width = '0';
    progressBars.right.style.height = '0';
    progressBars.bottom.style.width = '0';
    progressBars.left.style.height = '0';
  }

  function updateProgressBars(progressBars, percent) {
    const totalLength = 2 * (width + height - 8);

    let lengthPassed = percent * totalLength;

    if (lengthPassed <= width - 8) {
      progressBars.top.style.width = lengthPassed + 'px';
      resetProgressBarsExcept(progressBars, 'top');
    } else if (lengthPassed <= width - 8 + height - 8) {
      progressBars.top.style.width = (width - 8) + 'px';
      const rightHeight = lengthPassed - (width - 8);
      progressBars.right.style.height = rightHeight + 'px';
      resetProgressBarsExcept(progressBars, 'top', 'right');
    } else if (lengthPassed <= 2 * (width - 8) + height - 8) {
      progressBars.top.style.width = (width - 8) + 'px';
      progressBars.right.style.height = (height - 8) + 'px';
      const bottomWidth = lengthPassed - (width - 8 + height - 8);
      progressBars.bottom.style.width = bottomWidth + 'px';
      resetProgressBarsExcept(progressBars, 'top', 'right', 'bottom');
    } else {
      progressBars.top.style.width = (width - 8) + 'px';
      progressBars.right.style.height = (height - 8) + 'px';
      progressBars.bottom.style.width = (width - 8) + 'px';
      const leftHeight = lengthPassed - (2 * (width - 8) + height - 8);
      progressBars.left.style.height = leftHeight + 'px';
    }
  }

  function resetProgressBarsExcept(progressBars, ...exceptions) {
    if (!exceptions.includes('top')) progressBars.top.style.width = '0';
    if (!exceptions.includes('right')) progressBars.right.style.height = '0';
    if (!exceptions.includes('bottom')) progressBars.bottom.style.width = '0';
    if (!exceptions.includes('left')) progressBars.left.style.height = '0';
  }

  function showItem(index) {
    if (index >= items.length) index = 0;
    currentIndex = index;

    container.style.transform = `translateX(-${index * width}px)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');

    items.forEach(item => {
      item.classList.remove('video-active');
      const video = item.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
        const progressBars = getProgressBars(item);
        if (progressBars) resetProgressBars(progressBars);
      }
    });

    const currentItem = items[index];
    const media = currentItem.querySelector('img, video');

    if (media.tagName === 'IMG') {
      timeout = setTimeout(() => showItem(index + 1), imageDelay);
    } else if (media.tagName === 'VIDEO') {
      currentItem.classList.add('video-active');
      const progressBars = getProgressBars(currentItem);

      function animateProgress() {
        if (media.duration > 0) {
          const progress = media.currentTime / media.duration;
          updateProgressBars(progressBars, progress);
        }
        if (!media.paused && !media.ended) {
          requestAnimationFrame(animateProgress);
        }
      }

      media.play().then(() => {
        animateProgress();
        media.onended = () => {
          resetProgressBars(progressBars);
          showItem(index + 1);
        };
      }).catch(() => {
        // play error (autoplay restrictions etc)
        showItem(index + 1);
      });
    }
  }

  function getProgressBars(item) {
    const rect = item.querySelector('.progress-rect');
    if (!rect) return null;
    return {
      top: rect.querySelector('.progress-top'),
      right: rect.querySelector('.progress-right'),
      bottom: rect.querySelector('.progress-bottom'),
      left: rect.querySelector('.progress-left'),
    };
  }

  // Mute button toggling
  container.querySelectorAll('.custom-mute-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const video = e.target.closest('.custom-video-wrapper').querySelector('video');
      if (video.muted) {
        video.muted = false;
        e.target.textContent = '🔊';
      } else {
        video.muted = true;
        e.target.textContent = '🔇';
      }
    });
  });

  showItem(0);
}