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
const toolsWindow = document.querySelector(".tools-window");
const toolsTrack = document.querySelector(".tools-track");
const toolsToggle = document.querySelector("#tools-toggle");

if (toolsWindow && toolsTrack && toolsToggle) {
  const toolsMotionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (!toolsMotionPreference.matches) {
    const originalTools = Array.from(toolsTrack.children);

    originalTools.forEach((tool) => {
      const copy = tool.cloneNode(true);
      copy.classList.add("tool-copy");
      copy.setAttribute("aria-hidden", "true");
      toolsTrack.appendChild(copy);
    });

    toolsWindow.classList.add("is-animated");
    toolsToggle.hidden = false;

    toolsToggle.addEventListener("click", () => {
      const paused = toolsWindow.classList.toggle("is-paused");

      toolsToggle.textContent = paused
        ? "Resume tool movement"
        : "Pause tool movement";
    });
  }
}
