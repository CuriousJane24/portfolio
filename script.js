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


// The Unfolding Portfolio: robust one-time scroll reveal with a safe visible fallback.
const projectPaper = document.querySelector("#projects .project-paper");
const projectPaperFrame = document.querySelector("#projects .project-paper-frame");
const projectPrefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (projectPaper && projectPaperFrame) {
  const revealProjectPaper = () => {
    projectPaper.classList.add("is-unrolled");
    projectPaperFrame.classList.add("is-unrolled");
    projectPaper.inert = false;
  };

  if (
    projectPrefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    // Never hide portfolio content when motion is reduced or observers are unavailable.
    revealProjectPaper();
  } else {
    projectPaper.classList.add("unfold-ready");
    projectPaper.inert = true;

    let hasRevealed = false;
    const projectObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasRevealed) {
          hasRevealed = true;
          observer.unobserve(entry.target);

          // Allow the closed-roll state to paint before starting the reveal.
          requestAnimationFrame(() => {
            requestAnimationFrame(revealProjectPaper);
          });
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "0px"
    });

    projectObserver.observe(projectPaper);
  }
}
