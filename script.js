(() => {
  // Always start at the top, even after reload/back.
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const animatedEls = Array.from(document.querySelectorAll(".float-up, .scale-in"));
  const revealAll = () => {
    revealEls.concat(animatedEls).forEach((el) => el.classList.add("is-in"));
  };

  if (prefersReducedMotion) {
    revealAll();
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.22 }
    );
    revealEls.forEach((el) => io.observe(el));
    animatedEls.forEach((el) => io.observe(el));
  } else {
    revealAll();
  }

  const scrollCue = document.getElementById("scroll-cue");
  let cueTimer = null;
  let lastScroll = Date.now();

  const hideCue = () => {
    scrollCue?.classList.remove("is-visible");
    if (cueTimer) window.clearTimeout(cueTimer);
    cueTimer = null;
  };

  const scheduleCue = () => {
    if (!scrollCue || prefersReducedMotion) return;
    hideCue();
    const canScroll =
      document.documentElement.scrollHeight - window.innerHeight > 160;
    if (!canScroll) return;
    cueTimer = window.setTimeout(() => {
      if (Date.now() - lastScroll < 800) return;
      scrollCue.classList.add("is-visible");
    }, 1200);
  };

  document.addEventListener(
    "scroll",
    () => {
      lastScroll = Date.now();
      hideCue();
      scheduleCue();
    },
    { passive: true }
  );
  document.addEventListener("pointerdown", hideCue);
  scheduleCue();

  // Gate the demo video: wait for user gesture, then play with sound.
  const recordVideo = document.querySelector(".record__video");
  if (recordVideo) {
    recordVideo.pause();
    recordVideo.muted = false;
    recordVideo.removeAttribute("muted");
    recordVideo.removeAttribute("autoplay");
    const startVideo = () => {
      recordVideo.muted = false;
      recordVideo.play().catch(() => {
        // ignore play rejection (e.g., browser policies)
      });
    };
    const handleActivate = (event) => {
      event.preventDefault();
      startVideo();
    };
    recordVideo.addEventListener("click", handleActivate, { once: true });
    recordVideo.addEventListener(
      "keydown",
      (event) => {
        const key = event.key?.toLowerCase();
        if (key === "enter" || key === " ") {
          handleActivate(event);
        }
      },
      { once: true }
    );
  }

  const dialog = document.getElementById("waitlist-dialog");
  const openButtons = [document.getElementById("waitlist-open-center")].filter(Boolean);
  const closeButton = document.getElementById("waitlist-close");
  const cancelButton = document.getElementById("waitlist-cancel");

  const form = document.getElementById("waitlist");
  const status = document.getElementById("status");
  const email = document.getElementById("email");

  if (!dialog || !form || !status || !email) return;

  const setStatus = (message) => {
    status.textContent = message;
  };

  const openDialog = () => {
    setStatus("");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    window.setTimeout(() => email.focus(), 0);
    hideCue();
  };

  const closeDialog = () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    window.setTimeout(scheduleCue, 600);
  };

  openButtons.forEach((btn) => btn.addEventListener("click", openDialog));
  closeButton?.addEventListener("click", closeDialog);
  cancelButton?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    closeDialog();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = String(email.value || "").trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("Enter a valid email.");
      email.focus();
      return;
    }

    const submit = document.getElementById("waitlist-submit") || form.querySelector('button[type="submit"]');
    submit?.setAttribute("disabled", "true");
    setStatus("Submitting...");

    const endpoint = form.getAttribute("data-endpoint") || "";
    if (!endpoint) {
      setStatus("No waitlist endpoint set.");
      submit?.removeAttribute("disabled");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ email: value, source: "strata-site" })
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setStatus("Thanks. You’re on the list.");
      window.setTimeout(() => {
        submit?.removeAttribute("disabled");
        form.reset();
        closeDialog();
      }, 850);
    } catch (error) {
      setStatus("Something went wrong. Try again?");
      submit?.removeAttribute("disabled");
      console.error(error);
    }
  });
})();
