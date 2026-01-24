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

  if (mac) mac.classList.toggle("is-recommended", preferMac);
  if (win) win.classList.toggle("is-recommended", preferWin);

  if (mac && win) {
    if (preferWin) {
      win.classList.add("btn--primary");
      win.classList.remove("btn--secondary");
      mac.classList.add("btn--secondary");
      mac.classList.remove("btn--primary");
    } else if (preferMac) {
      mac.classList.add("btn--primary");
      mac.classList.remove("btn--secondary");
      win.classList.add("btn--secondary");
      win.classList.remove("btn--primary");
    }
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
