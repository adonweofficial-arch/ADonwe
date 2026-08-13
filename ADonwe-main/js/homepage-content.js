// js/homepage-content.js
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// --- Shared helper ---------------------------------------------------------

async function fetchOrFallback(collectionName, fallback) {
  try {
    const q = query(collection(db, collectionName), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return fallback;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn(
      `[homepage-content] Firestore unavailable for "${collectionName}", using fallback data:`,
      err.message
    );
    return fallback;
  }
}

// --- Locations ("Our Presence") --------------------------------------------

const LONG_VIEW_MIN_LIVE_CITIES = 3;

const LOCATIONS_FALLBACK = [
  { id: "patna", name: "Patna", status: "live", tagline: "Bihar's capital — our flagship city with 200+ premium locations across Bailey Road, Boring Road, Fraser Road, and beyond.", stats: ["200+ Sites", "2.5M+ Pop."], image: "images/city_patna.png" },
  { id: "muzaffarpur", name: "Muzaffarpur", status: "soon", tagline: "North Bihar's commercial hub — premium visibility across main market and commercial zones.", image: "images/city_muzaffarpur.png" },
  { id: "gaya", name: "Gaya", status: "soon", tagline: "High-footfall spiritual & tourism city with year-round visitor traffic from across India.", image: "images/city_gaya.png" },
  { id: "patliputra", name: "Patliputra", status: "soon", tagline: "Rapidly growing township district with premium residential and commercial developments.", image: "images/city_patliputra.png" },
  { id: "bhagalpur", name: "Bhagalpur", status: "soon", tagline: "Silk city with growing commercial activity and strong retail advertising potential.", image: "images/city_bhagalpur.png" },
];

function cityCardHtml(loc, featured) {
  const badge = loc.status === "live" ? `<div class="city-badge">Launching Now</div>` : "";
  const statsHtml = loc.stats
    ? `<div class="city-stats">${loc.stats.map((s) => `<span>${s}</span>`).join("")}</div>`
    : "";
  const linkText = loc.status === "live" ? `Explore ${loc.name}` : "Coming Soon";
  const linkIcon = loc.status === "live" ? "fa-arrow-right" : "fa-clock";
  return `
    <div class="city-card${featured ? " featured-city" : ""}" id="${loc.id}Card">
      <img class="city-bg-img" src="${loc.image}" alt="${loc.name} Bihar"/>
      <div class="city-overlay">
        ${badge}
        <div class="city-info">
          <h3>${loc.name}</h3>
          <p>${loc.tagline}</p>
          ${statsHtml}
          <a href="locations.html#${loc.id}" class="city-link">${linkText} <i class="fas ${linkIcon}"></i></a>
        </div>
      </div>
    </div>`;
}

function locationsTeaserHtml(count) {
  return `
    <div class="city-card more-cities" id="moreCitiesCard">
      <img class="city-bg-img" src="images/city_morecities.png" alt="More Cities Bihar"/>
      <div class="city-overlay">
        <div class="city-info">
          <h3>+${count} More ${count === 1 ? "City" : "Cities"}</h3>
          <p>We're expanding fast across Bihar — watch this space.</p>
          <a href="locations.html" class="city-link">View All <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>`;
}

async function renderHomepageLocations() {
  const grid = document.querySelector(".cities-grid");
  if (!grid) return;

  const locations = await fetchOrFallback("locations", LOCATIONS_FALLBACK);
  const live = locations.filter((l) => l.status === "live");
  const upcoming = locations.filter((l) => l.status !== "live");
  const isLongView = live.length >= LONG_VIEW_MIN_LIVE_CITIES;

  grid.classList.toggle("view-short", !isLongView);
  grid.classList.toggle("view-full", isLongView);

  let html = live.map((loc, i) => cityCardHtml(loc, i === 0)).join("");
  if (isLongView) {
    html += upcoming.map((loc) => cityCardHtml(loc, false)).join("");
  } else if (upcoming.length > 0) {
    html += locationsTeaserHtml(upcoming.length);
  }
  grid.innerHTML = html;
}

// --- Services ("What We Offer") ---------------------------------------------

const LONG_VIEW_MIN_SERVICES = 4;

const SERVICES_FALLBACK = [
  { id: "billboard", name: "Billboards & Hoardings", icon: "fa-rectangle-ad", tagline: "Dominate skylines with our premium large-format hoardings across major intersections, highways, and key city arteries.", specs: ["Up to 60×20 ft", "500K+ daily views"], image: "images/service_billboard.png" },
  { id: "metro", name: "Metro & Transit Ads", icon: "fa-train-subway", tagline: "Captivate daily commuters inside metro stations, bus shelters, and transit corridors with high-dwell-time displays.", specs: ["Captive audience", "High dwell time"], image: "images/service_metro.png" },
  { id: "residential", name: "Residential Complexes", icon: "fa-building", tagline: "Reach affluent households in gated communities and residential towers with targeted lifestyle advertising.", specs: ["Premium localities", "High conversion"], image: "images/service_residential.png" },
  { id: "gym", name: "Gym & Fitness", icon: "fa-dumbbell", tagline: "Partner with top gyms to display your brand to health-conscious, high-engagement audiences during peak hours.", specs: ["High engagement", "Quality leads"], image: "images/service_gym.png" },
  { id: "mall", name: "Mall & Retail Spaces", icon: "fa-store", tagline: "Premium in-mall digital displays and static banners that convert browsers into buyers at the point of decision.", specs: ["Point-of-sale", "Retail audience"], image: "images/service_mall.png" },
  { id: "digital", name: "Digital LED Screens", icon: "fa-tv", tagline: "State-of-the-art LED digital boards with remote content management, dynamic ads & real-time campaign switching.", specs: ["Dynamic content", "Remote managed"], image: "images/service_digital_led.png" },
];

function serviceCardHtml(svc, featured) {
  const specsHtml = svc.specs
    ? `<div class="service-specs">${svc.specs.map((s) => `<span>${s}</span>`).join("")}</div>`
    : "";
  return `
    <div class="service-card${featured ? " featured" : ""}" data-service="${svc.id}">
      <div class="service-card-img">
        <img src="${svc.image}" alt="${svc.name} Bihar" loading="lazy"/>
      </div>
      <div class="service-card-body">
        <div class="service-icon-wrap"><i class="fas ${svc.icon}"></i></div>
        <h3>${svc.name}</h3>
        <p>${svc.tagline}</p>
        ${specsHtml}
        <a href="services.html#${svc.id}" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>`;
}

async function renderHomepageServices() {
  const grid = document.querySelector(".services-grid");
  if (!grid) return;

  const services = await fetchOrFallback("services", SERVICES_FALLBACK);
  const isLongView = services.length >= LONG_VIEW_MIN_SERVICES;

  grid.classList.toggle("view-short", !isLongView);
  grid.classList.toggle("view-full", isLongView);

  grid.innerHTML = services.map((svc, i) => serviceCardHtml(svc, i === 0)).join("");
}

// --- Run both on every homepage load ---------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  renderHomepageLocations();
  renderHomepageServices();
});
