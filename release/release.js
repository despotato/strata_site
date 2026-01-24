import { STRATA_RELEASE } from "./release-config.js";

const byId = (id) => document.getElementById(id);

const setText = (id, value) => {
  const el = byId(id);
  if (!el) return;
  el.textContent = value;
};

const setHref = (id, href) => {
  const el = byId(id);
  if (!(el instanceof HTMLAnchorElement)) return;
  el.href = href;
};

const applyRecommended = () => {
  const platform = String(
    (navigator.userAgentData && navigator.userAgentData.platform) ||
      navigator.platform ||
      ""
  ).toLowerCase();
  const ua = String(navigator.userAgent || "").toLowerCase();

  const isMac = platform.includes("mac") || ua.includes("mac os");
  const isWindows = platform.includes("win") || ua.includes("windows");

  const mac = byId("download-mac");
  const win = byId("download-win");

  const preferMac = isMac && !isWindows;
  const preferWin = isWindows && !isMac;

  // Helper: enforce exactly one variant class
  const setVariant = (el, variant) => {
    if (!el) return;
    el.classList.remove("btn--primary", "btn--secondary");
    el.classList.add(variant);
  };

  // Default: macOS is primary (white), Windows is secondary (gray)
  setVariant(mac, "btn--primary");
  setVariant(win, "btn--secondary");

  // If we can confidently detect Windows, flip the recommendation
  if (preferWin) {
    setVariant(win, "btn--primary");
    setVariant(mac, "btn--secondary");
  } else if (preferMac) {
    // keep default
    setVariant(mac, "btn--primary");
    setVariant(win, "btn--secondary");
  }
};

setText("release-version", STRATA_RELEASE.version);

const dateEl = byId("release-date");
if (dateEl instanceof HTMLTimeElement) {
  dateEl.dateTime = STRATA_RELEASE.date;
  dateEl.textContent = STRATA_RELEASE.date;
}

setHref("download-mac", STRATA_RELEASE.mac.dmgUrl);
setHref("download-win", STRATA_RELEASE.windows.exeUrl);
setHref("release-page", STRATA_RELEASE.pageUrl);

applyRecommended();
