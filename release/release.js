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

  if (mac) mac.classList.toggle("is-recommended", isMac && !isWindows);
  if (win) win.classList.toggle("is-recommended", isWindows && !isMac);
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

