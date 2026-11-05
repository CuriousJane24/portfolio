const counters = document.querySelectorAll(".metric dd[data-target]");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1200;
  let startTime;

  function update(time) {
    if (startTime === undefined) {
      startTime = time;
    }

    const progress = Math.min((time - startTime) / duration, 1);
    const value = Math.round(progress * target);

    counter.textContent = value.toLocaleString("en-US") + "+";

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}
