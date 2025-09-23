export function getRandomNumberBetween(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);

  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

export function eventTargetInsideElementTag(
  event,
  tags = ["button", "a", "input", "iframe"]
) {
  let targetElement = event.target;

  while (targetElement != null) {
    if (tags.includes(targetElement.nodeName.toLowerCase())) {
      return true;
    }

    targetElement = targetElement.parentNode;
  }

  return false;
}

export const COLLECTION_IDS = {
  CDS: "503978754336",
  VINYL: "503978787104",
  CASSETTES: "503978819872",
  OTHER: "503978852640",
};

export const CDN_URL = "https://w-img.b-cdn.net/rtr";
export const RELEASE_DATE = Date.parse("24 Sep 2025 10:00:00 EDT");

export function isSafari() {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const macOS = /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor);
  const safariDesktop =
    /Safari/.test(ua) && !/Chrome|Chromium|Android/.test(ua);

  return iOS || macOS || safariDesktop;
}

export function isLive() {
  return Date.now() > RELEASE_DATE;
}
