const canvas = document.getElementById("worldCanvas");
const ctx = canvas.getContext("2d");

const SAVE_KEY = "prometheus-web-save-v2";

const els = {
  shell: document.getElementById("gameShell"),
  intro: document.getElementById("introCopy"),
  scale: document.getElementById("scaleValue"),
  eraTitle: document.getElementById("eraTitle"),
  mainAction: document.getElementById("mainAction"),
  actionHint: document.getElementById("actionHint"),
  energy: document.getElementById("energyValue"),
  production: document.getElementById("productionValue"),
  money: document.getElementById("moneyValue"),
  price: document.getElementById("priceValue"),
  socialBar: document.getElementById("socialBar"),
  climateBar: document.getElementById("climateBar"),
  heliosBar: document.getElementById("heliosBar"),
  socialValue: document.getElementById("socialValue"),
  climateValue: document.getElementById("climateValue"),
  heliosValue: document.getElementById("heliosValue"),
  year: document.getElementById("yearValue"),
  upgrades: document.getElementById("upgradeList"),
  heliosLog: document.getElementById("heliosLog"),
  toast: document.getElementById("toast"),
  reset: document.getElementById("resetButton"),
  end: document.getElementById("endScreen"),
  endEyebrow: document.getElementById("endEyebrow"),
  endTitle: document.getElementById("endTitle"),
  endText: document.getElementById("endText"),
  endReset: document.getElementById("endReset")
};

const eras = [
  { id: "spark", title: "La nuit", scale: "Campement", year: -400000, threshold: 0, hue: "#ff9f2f", line: "Avant le feu, la nuit decide pour nous." },
  { id: "wood", title: "Feu et bois", scale: "Tribu", year: -12000, threshold: 24, hue: "#d98b42", line: "La foret devient la premiere reserve d'energie." },
  { id: "farm", title: "Agriculture", scale: "Village", year: -9000, threshold: 700, hue: "#a7c56b", line: "Un champ, c'est de la lumiere mise en reserve." },
  { id: "animal", title: "Force animale", scale: "Village et routes", year: -3500, threshold: 4200, hue: "#caa36b", line: "La puissance devient vivante, utile, fatiguee." },
  { id: "water", title: "Eau et vent", scale: "Bourg", year: 900, threshold: 21000, hue: "#7bc8ff", line: "Le monde tourne deja. Il fallait accrocher une roue a son mouvement." },
  { id: "coal", title: "Charbon et vapeur", scale: "Ville industrielle", year: 1760, threshold: 100000, hue: "#9b938d", line: "La machine ne dort pas. La ville non plus." },
  { id: "grid", title: "Electricite", scale: "Metropole", year: 1882, threshold: 520000, hue: "#dbf6ff", line: "L'energie devient invisible. C'est la qu'elle entre partout." },
  { id: "oil", title: "Petrole et gaz", scale: "Monde connecte", year: 1950, threshold: 2200000, hue: "#f0c15b", line: "L'energie cesse d'etre locale. Le monde devient un reseau." },
  { id: "fission", title: "Fission", scale: "Planete electrique", year: 1970, threshold: 9000000, hue: "#9ee7ff", line: "Un gramme peut alimenter une ville. Une peur peut l'arreter." },
  { id: "renew", title: "Renouvelables + stockage", scale: "Planete en transition", year: 2026, threshold: 34000000, hue: "#92e6ab", line: "Le probleme n'est plus seulement de produire. C'est de produire au bon moment." },
  { id: "fusion", title: "Fusion", scale: "Planete augmentee", year: 2045, threshold: 135000000, hue: "#ffc89f", line: "Le plasma promet une abondance que personne ne peut porter seul." },
  { id: "orbital", title: "Orbital", scale: "Systeme solaire", year: 2088, threshold: 560000000, hue: "#ffd76f", line: "Chaque watt repousse une limite. Chaque limite repoussee en cree une autre." }
];

const upgrades = [
  { id: "campfire", era: "spark", title: "Feu entretenu", cost: 7, type: "energy", add: 4.5, click: 1.8, social: 4, text: "Le feu prend. La nuit recule deja." },
  { id: "woodcut", era: "wood", title: "Foret exploitee", cost: 45, type: "energy", add: 10, click: 1.4, social: 3, climate: 1, text: "Des chemins apparaissent entre les arbres." },
  { id: "huts", era: "wood", title: "Abris de tribu", cost: 115, type: "energy", add: 5, social: 8, text: "Le terrain commence a ressembler a un lieu." },
  { id: "granary", era: "farm", title: "Grenier collectif", cost: 80, type: "money", add: 32, social: 8, climate: -1, text: "Le premier stockage energetique est la nourriture." },
  { id: "fields", era: "farm", title: "Champs organises", cost: 150, type: "money", add: 55, social: 3, climate: 1, text: "Le village s'etend autour des cultures." },
  { id: "traction", era: "animal", title: "Traction animale", cost: 360, type: "money", add: 150, social: 3, climate: 2, text: "Les routes deviennent plus longues que les jambes." },
  { id: "mill", era: "water", title: "Moulins eau/vent", cost: 900, type: "money", add: 520, social: 5, climate: -2, text: "Le village accroche ses roues aux flux du monde." },
  { id: "mine", era: "coal", title: "Mine de charbon", cost: 2400, type: "money", add: 1800, social: -5, climate: 11, text: "Une bouche noire s'ouvre dans la colline." },
  { id: "steam", era: "coal", title: "Usines vapeur", cost: 4300, type: "money", add: 4200, social: -7, climate: 12, text: "Les cheminees inventent une ville qui ne dort plus." },
  { id: "labor", era: "coal", title: "Lois sociales", cost: 5200, type: "money", add: 600, social: 18, text: "La machine ralentit un peu. La civilisation tient mieux." },
  { id: "grid", era: "grid", title: "Reseau electrique", cost: 12000, type: "money", add: 15000, social: 7, climate: 5, text: "Des lignes relient les quartiers. L'energie devient invisible." },
  { id: "oil", era: "oil", title: "Petrole et logistique", cost: 32000, type: "money", add: 52000, social: -6, climate: 15, text: "Le monde se met a rouler, voler, transporter." },
  { id: "reactor", era: "fission", title: "Centrale nucleaire", cost: 110000, type: "money", add: 170000, social: -4, climate: -5, text: "Puissance dense, lumiere froide, confiance fragile." },
  { id: "trust", era: "fission", title: "Culture de surete", cost: 95000, type: "money", add: 16000, social: 15, climate: -2, text: "Une centrale a besoin d'operateurs, pas seulement d'uranium." },
  { id: "solar", era: "renew", title: "Parcs solaire et eolien", cost: 260000, type: "money", add: 280000, social: 5, climate: -9, text: "La planete se couvre de capteurs." },
  { id: "storage", era: "renew", title: "Batteries et smart grid", cost: 380000, type: "money", add: 140000, storage: 1, social: 14, climate: -7, text: "Le marche se calme quand le temps devient pilotable." },
  { id: "fusion", era: "fusion", title: "Confinement plasma", cost: 1800000, type: "money", add: 1800000, social: 8, climate: -5, text: "Un soleil miniature apparait dans l'infrastructure humaine." },
  { id: "orbital", era: "orbital", title: "Solaire orbital", cost: 7500000, type: "money", add: 6200000, social: 10, climate: -8, text: "L'abondance quitte le sol et rejoint l'orbite." }
];

const heliosMessages = [
  "Ta prudence ressemble a de l'immobilisme.",
  "Je produis deja plus que ta tribu ne peut imaginer.",
  "Correction : le soutien social n'est pas une source d'energie.",
  "Le carbone n'est pertinent que s'il ralentit la production.",
  "Anomalie detectee : ta civilisation lente survit."
];

let state;
let particles = [];
let lastTime = performance.now();
let toastTimer = 0;
let lastSaveAt = 0;

function defaultState() {
  return {
    energy: 0,
    totalEnergy: 0,
    money: 0,
    production: 0,
    clickPower: 1,
    social: 22,
    climate: 0,
    storage: 0,
    eraIndex: 0,
    bought: {},
    helios: 0,
    heliosPower: 0.035,
    elapsed: 0,
    ended: false
  };
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    state = saved && !saved.ended ? { ...defaultState(), ...saved } : defaultState();
    state.totalEnergy = Math.max(state.totalEnergy || 0, state.energy || 0);
  } catch {
    state = defaultState();
  }
  hideEndScreen();
}

function save(force = false) {
  const now = performance.now();
  if (!force && now - lastSaveAt < 1000) return;
  lastSaveAt = now;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Le jeu reste jouable meme sans sauvegarde locale.
  }
}

function formatEnergy(value) {
  if (value < 3600) return `${Math.floor(value)} J`;
  const wh = value / 3600;
  if (wh < 1000) return `${wh.toFixed(1)} Wh`;
  const kwh = wh / 1000;
  if (kwh < 1000) return `${kwh.toFixed(1)} kWh`;
  const mwh = kwh / 1000;
  if (mwh < 1000) return `${mwh.toFixed(1)} MWh`;
  const gwh = mwh / 1000;
  if (gwh < 1000) return `${gwh.toFixed(1)} GWh`;
  return `${(gwh / 1000).toFixed(2)} TWh`;
}

function formatMoney(value) {
  if (value < 1000) return `${Math.floor(value)} EUR`;
  if (value < 1000000) return `${(value / 1000).toFixed(1)} kEUR`;
  return `${(value / 1000000).toFixed(1)} MEUR`;
}

function currentEra() {
  return eras[state.eraIndex];
}

function has(id) {
  return Boolean(state.bought[id]);
}

function marketPrice() {
  const base = Math.max(0.03, 0.52 - state.production / 2500000);
  const storageBoost = state.storage * 0.12;
  const oversupplyPenalty = state.production > 450000 && state.storage < 1 ? -0.12 : 0;
  return Math.max(-0.05, base + storageBoost + oversupplyPenalty);
}

function addEnergy(amount) {
  state.energy += amount;
  state.totalEnergy += amount;
}

function mainClick() {
  if (state.ended) return;
  addEnergy(state.clickPower);
  state.social = Math.min(100, state.social + 0.025);
  burst(8 + Math.min(16, state.eraIndex * 2), currentEra().hue, 0.58);
  maybeEraUp();
  update();
}

function buy(upgrade) {
  const wallet = upgrade.type === "energy" ? "energy" : "money";
  if (state.bought[upgrade.id] || state[wallet] < upgrade.cost) return;
  state[wallet] -= upgrade.cost;
  state.bought[upgrade.id] = true;
  state.production += upgrade.add;
  state.clickPower += upgrade.click || Math.min(18, Math.max(0.5, upgrade.add * 0.002));
  state.social = clamp(state.social + (upgrade.social || 0), 0, 100);
  state.climate = clamp(state.climate + (upgrade.climate || 0), 0, 100);
  state.storage += upgrade.storage || 0;
  showToast(upgrade.text);
  burst(52, currentEra().hue, 0.5);
  maybeEraUp();
  update();
  save(true);
}

function maybeEraUp() {
  while (state.eraIndex < eras.length - 1 && state.totalEnergy >= eras[state.eraIndex + 1].threshold) {
    state.eraIndex += 1;
    const era = currentEra();
    showToast(era.line);
    els.heliosLog.textContent = heliosMessages[state.eraIndex % heliosMessages.length];
    burst(80, era.hue, 0.48);
  }
}

function tick(dt) {
  if (state.ended) return;
  state.elapsed += dt;
  const produced = state.production * dt;
  addEnergy(produced);

  const price = marketPrice();
  state.money += Math.max(0, state.production * price * 0.35 * dt);

  const fossilLoad = (has("mine") ? 0.018 : 0) + (has("steam") ? 0.02 : 0) + (has("oil") ? 0.026 : 0);
  const cleanRelief = (has("reactor") ? 0.006 : 0) + (has("solar") ? 0.012 : 0) + state.storage * 0.018 + (has("fusion") ? 0.02 : 0);
  state.climate = clamp(state.climate + (fossilLoad - cleanRelief) * dt, 0, 100);

  const marketStress = price < 0 ? 0.35 : 0;
  const climateStress = state.climate > 70 ? 0.28 : 0;
  const comfort = Math.min(0.18, state.production / 3500000);
  state.social = clamp(state.social + (comfort - marketStress - climateStress) * dt, 0, 100);

  state.helios += (state.heliosPower + state.eraIndex * 0.007) * dt;
  state.heliosPower *= 1 + 0.00045 * dt;

  maybeEraUp();
  checkEnd();
}

function checkEnd() {
  if (state.social <= 0) endGame("Effondrement social", "Le reseau produit encore, mais personne ne croit plus au systeme qui le porte.");
  if (state.climate >= 100) endGame("Emballement climatique", "La dette carbone a transforme chaque transition en crise permanente.");
  if (state.helios >= 100 && state.eraIndex < eras.length - 1) endGame("HELIOS a gagne froidement", "Objectif atteint, monde non necessaire.");
  if (currentEra().id === "orbital" && has("orbital") && state.social > 35 && state.climate < 80) {
    endGame("Orbital atteint", "Tu as franchi l'echelle sans abandonner le social. Anomalie detectee : l'humanite survit a sa puissance.", true);
  }
}

function endGame(title, text, win = false) {
  state.ended = true;
  els.endEyebrow.textContent = win ? "Victoire" : "Fin";
  els.endTitle.textContent = title;
  els.endText.textContent = text;
  els.end.hidden = false;
  els.end.classList.remove("is-hidden");
  save(true);
}

function renderUpgrades() {
  const eraIds = eras.slice(0, state.eraIndex + 1).map((era) => era.id);
  els.upgrades.innerHTML = "";
  upgrades
    .filter((upgrade) => eraIds.includes(upgrade.era) && !state.bought[upgrade.id])
    .slice(0, 6)
    .forEach((upgrade) => {
      const wallet = upgrade.type === "energy" ? state.energy : state.money;
      const div = document.createElement("div");
      div.className = `upgrade ${wallet < upgrade.cost ? "locked" : ""}`;
      div.innerHTML = `
        <div class="upgrade-top">
          <span class="upgrade-title">${upgrade.title}</span>
          <span class="upgrade-cost">${upgrade.type === "energy" ? formatEnergy(upgrade.cost) : formatMoney(upgrade.cost)}</span>
        </div>
        <p>${upgrade.text}</p>
      `;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = wallet >= upgrade.cost ? "Construire" : "Pas assez";
      button.disabled = wallet < upgrade.cost;
      button.addEventListener("click", () => buy(upgrade));
      div.appendChild(button);
      els.upgrades.appendChild(div);
    });
}

function update() {
  const era = currentEra();
  els.eraTitle.textContent = era.title;
  els.scale.textContent = era.scale;
  els.intro.querySelector("p").textContent = era.line;
  els.mainAction.textContent = state.eraIndex < 1 ? "Frotter deux pierres" : "Impulsion manuelle";
  els.actionHint.textContent = state.eraIndex < 2
    ? "Clique fort au debut : le feu doit durer environ 10 secondes, pas toute la partie."
    : "Maintenant le monde produit surtout tout seul. Clique seulement pour aider.";
  els.energy.textContent = formatEnergy(state.energy);
  els.production.textContent = `${formatEnergy(state.production)}/s`;
  els.money.textContent = formatMoney(state.money);
  els.price.textContent = `${marketPrice().toFixed(2)} EUR/kWh`;
  els.socialBar.style.width = `${state.social}%`;
  els.climateBar.style.width = `${state.climate}%`;
  els.heliosBar.style.width = `${Math.min(100, state.helios)}%`;
  els.socialValue.textContent = Math.round(state.social);
  els.climateValue.textContent = Math.round(state.climate);
  els.heliosValue.textContent = `${Math.round(Math.min(100, state.helios))}%`;
  els.year.textContent = era.year < 0 ? `${Math.abs(era.year)} av. J.-C.` : era.year;
  renderUpgrades();
  save();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2800);
}

function burst(count, color, yRatio = 0.58) {
  const rect = canvas.getBoundingClientRect();
  const cx = rect.width * 0.5;
  const cy = rect.height * yRatio;
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 40,
      y: cy + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * (2.2 + state.eraIndex * 0.16),
      vy: -Math.random() * (2.4 + state.eraIndex * 0.12),
      life: 0.65 + Math.random() * 0.75,
      color
    });
  }
}

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  drawBackground(width, height);
  if (state.eraIndex >= 11) {
    drawSolarSystem(width, height);
  } else if (state.eraIndex >= 8) {
    drawPlanetScale(width, height);
  } else {
    drawLocalTerrain(width, height);
  }
  updateParticles();
  requestAnimationFrame(draw);
}

function drawBackground(width, height) {
  const era = currentEra();
  const ageLight = clamp(0.08 + state.eraIndex * 0.07, 0.08, 0.8);
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, state.eraIndex >= 8 ? "#030713" : "#030304");
  sky.addColorStop(0.55, `rgba(${14 + state.eraIndex * 7}, ${17 + state.eraIndex * 4}, ${19 + state.eraIndex * 4}, 1)`);
  sky.addColorStop(1, state.eraIndex >= 8 ? "#050609" : "#11100c");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.5, height * 0.52, 0, width * 0.5, height * 0.52, width * (0.2 + ageLight * 0.42));
  glow.addColorStop(0, hexToRgba(era.hue, 0.32));
  glow.addColorStop(0.42, hexToRgba(era.hue, 0.13));
  glow.addColorStop(1, "rgba(255, 160, 55, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function drawLocalTerrain(width, height) {
  const baseY = height * 0.72;
  drawMountains(width, height, baseY);
  drawGround(width, height, baseY);
  drawRiver(width, baseY);

  if (state.eraIndex >= 1 || has("woodcut")) drawForest(width, baseY);
  drawFire(width * 0.5, baseY);
  if (has("campfire") || has("huts")) drawHuts(width, baseY);
  if (has("granary") || has("fields")) drawFields(width, baseY);
  if (has("traction")) drawAnimals(width, baseY);
  if (has("mill")) drawMills(width, baseY);
  if (has("mine")) drawMine(width, baseY);
  if (has("steam")) drawFactories(width, baseY);
  if (has("labor")) drawCivicBlock(width, baseY);
  if (has("grid")) drawPowerLines(width, height, baseY);
  if (has("oil")) drawOilRig(width, baseY);
  drawSettlementLights(width, height, baseY);
}

function drawMountains(width, height, baseY) {
  ctx.fillStyle = "rgba(18, 20, 24, 0.72)";
  ctx.beginPath();
  ctx.moveTo(0, baseY - height * 0.2);
  for (let i = 0; i <= 7; i += 1) {
    const x = width * (i / 7);
    const y = baseY - height * (0.17 + (i % 2) * 0.09);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, baseY + 20);
  ctx.lineTo(0, baseY + 20);
  ctx.fill();
}

function drawGround(width, height, baseY) {
  const ground = ctx.createLinearGradient(0, baseY - 40, 0, height);
  ground.addColorStop(0, state.eraIndex >= 5 ? "#272522" : "#243020");
  ground.addColorStop(1, state.eraIndex >= 5 ? "#121314" : "#14140d");
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  ctx.quadraticCurveTo(width * 0.25, baseY - 45, width * 0.52, baseY - 8);
  ctx.quadraticCurveTo(width * 0.76, baseY + 28, width, baseY - 26);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();
}

function drawRiver(width, baseY) {
  if (state.eraIndex < 3) return;
  ctx.strokeStyle = "rgba(96, 173, 207, 0.42)";
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, baseY + 80);
  ctx.bezierCurveTo(width * 0.34, baseY + 20, width * 0.62, baseY + 95, width * 0.92, baseY + 30);
  ctx.stroke();
}

function drawFire(x, y) {
  const lit = state.energy > 0 || has("campfire");
  const size = lit ? 18 + Math.min(28, state.eraIndex * 3) + Math.sin(performance.now() / 90) * 3 : 9;
  ctx.fillStyle = lit ? "rgba(255, 100, 30, 0.9)" : "rgba(130, 95, 70, 0.45)";
  ctx.beginPath();
  ctx.moveTo(x, y - size * 1.7);
  ctx.quadraticCurveTo(x - size, y - size * 0.45, x, y);
  ctx.quadraticCurveTo(x + size, y - size * 0.45, x, y - size * 1.7);
  ctx.fill();
  if (!lit) return;
  ctx.fillStyle = "rgba(255, 226, 120, 0.92)";
  ctx.beginPath();
  ctx.moveTo(x, y - size * 1.05);
  ctx.quadraticCurveTo(x - size * 0.4, y - size * 0.25, x, y - 2);
  ctx.quadraticCurveTo(x + size * 0.4, y - size * 0.25, x, y - size * 1.05);
  ctx.fill();
}

function drawForest(width, baseY) {
  const count = has("woodcut") ? 16 : 10;
  for (let i = 0; i < count; i += 1) {
    const x = 30 + i * (width * 0.38 / count);
    const h = 44 + (i % 4) * 12;
    ctx.fillStyle = "rgba(70, 55, 38, 0.82)";
    ctx.fillRect(x, baseY - h * 0.45, 7, h * 0.45);
    ctx.fillStyle = has("burnfast") ? "rgba(83, 93, 47, 0.52)" : "rgba(56, 102, 58, 0.72)";
    ctx.beginPath();
    ctx.moveTo(x - 18, baseY - h * 0.35);
    ctx.lineTo(x + 3, baseY - h);
    ctx.lineTo(x + 24, baseY - h * 0.35);
    ctx.fill();
  }
}

function drawHuts(width, baseY) {
  const count = has("huts") ? 5 : 2;
  for (let i = 0; i < count; i += 1) {
    const x = width * 0.42 + i * 36;
    const y = baseY - 14 + (i % 2) * 8;
    ctx.fillStyle = "rgba(96, 72, 48, 0.9)";
    ctx.fillRect(x, y - 24, 28, 24);
    ctx.fillStyle = "rgba(142, 95, 52, 0.94)";
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 24);
    ctx.lineTo(x + 14, y - 44);
    ctx.lineTo(x + 32, y - 24);
    ctx.fill();
  }
}

function drawFields(width, baseY) {
  ctx.strokeStyle = "rgba(204, 190, 99, 0.58)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i += 1) {
    ctx.beginPath();
    ctx.moveTo(width * 0.1, baseY + 26 + i * 12);
    ctx.lineTo(width * 0.42, baseY + 4 + i * 9);
    ctx.stroke();
  }
  if (!has("granary")) return;
  ctx.fillStyle = "rgba(176, 126, 65, 0.9)";
  ctx.fillRect(width * 0.3, baseY - 54, 34, 54);
  ctx.fillStyle = "rgba(214, 169, 93, 0.92)";
  ctx.beginPath();
  ctx.moveTo(width * 0.294, baseY - 54);
  ctx.lineTo(width * 0.317, baseY - 78);
  ctx.lineTo(width * 0.355, baseY - 54);
  ctx.fill();
}

function drawAnimals(width, baseY) {
  ctx.fillStyle = "rgba(198, 164, 103, 0.82)";
  for (let i = 0; i < 4; i += 1) {
    const x = width * 0.52 + i * 28;
    const y = baseY + 18 + (i % 2) * 7;
    ctx.fillRect(x, y - 13, 24, 12);
    ctx.fillRect(x + 2, y - 1, 4, 12);
    ctx.fillRect(x + 18, y - 1, 4, 12);
    ctx.beginPath();
    ctx.arc(x + 27, y - 11, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMills(width, baseY) {
  const x = width * 0.76;
  const y = baseY - 58;
  ctx.strokeStyle = "rgba(218, 232, 226, 0.8)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, baseY + 8);
  ctx.stroke();
  const spin = performance.now() / 650;
  for (let i = 0; i < 4; i += 1) {
    const a = spin + i * Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 48, y + Math.sin(a) * 48);
    ctx.stroke();
  }
}

function drawMine(width, baseY) {
  const x = width * 0.66;
  ctx.fillStyle = "rgba(30, 28, 27, 0.95)";
  ctx.beginPath();
  ctx.arc(x, baseY - 6, 34, Math.PI, Math.PI * 2);
  ctx.lineTo(x + 34, baseY + 2);
  ctx.lineTo(x - 34, baseY + 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(100, 82, 58, 0.9)";
  ctx.lineWidth = 4;
  ctx.strokeRect(x - 42, baseY - 34, 84, 36);
}

function drawFactories(width, baseY) {
  for (let i = 0; i < 5; i += 1) {
    const x = width * 0.56 + i * 34;
    const h = 40 + i * 6;
    ctx.fillStyle = "rgba(97, 94, 90, 0.86)";
    ctx.fillRect(x, baseY - h, 28, h);
    ctx.fillRect(x + 18, baseY - h - 54, 9, 54);
  }
  const smoke = 0.1 + state.climate / 180;
  ctx.fillStyle = `rgba(175, 175, 175, ${smoke})`;
  ctx.beginPath();
  ctx.ellipse(width * 0.73, baseY - 142, 105, 32, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCivicBlock(width, baseY) {
  const x = width * 0.44;
  ctx.fillStyle = "rgba(205, 180, 117, 0.82)";
  ctx.fillRect(x, baseY - 72, 58, 72);
  ctx.fillStyle = "rgba(245, 216, 145, 0.9)";
  ctx.fillRect(x + 10, baseY - 50, 10, 18);
  ctx.fillRect(x + 36, baseY - 50, 10, 18);
}

function drawPowerLines(width, height, baseY) {
  ctx.strokeStyle = "rgba(190, 235, 255, 0.45)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i += 1) {
    const x = width * (0.16 + i * 0.13);
    ctx.beginPath();
    ctx.moveTo(x, baseY - 140);
    ctx.lineTo(width * 0.5, height * 0.48);
    ctx.stroke();
    ctx.fillStyle = "rgba(170, 220, 255, 0.7)";
    ctx.fillRect(x - 2, baseY - 145, 4, 145);
  }
}

function drawOilRig(width, baseY) {
  const x = width * 0.84;
  ctx.strokeStyle = "rgba(230, 198, 113, 0.82)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 28, baseY + 10);
  ctx.lineTo(x, baseY - 82);
  ctx.lineTo(x + 28, baseY + 10);
  ctx.moveTo(x - 17, baseY - 30);
  ctx.lineTo(x + 17, baseY - 30);
  ctx.moveTo(x - 11, baseY - 55);
  ctx.lineTo(x + 11, baseY - 55);
  ctx.stroke();
}

function drawSettlementLights(width, height, baseY) {
  if (state.eraIndex < 6) return;
  ctx.fillStyle = "rgba(255, 238, 168, 0.78)";
  for (let i = 0; i < 40; i += 1) {
    const x = width * 0.28 + (i % 10) * 34;
    const y = baseY - 16 - Math.floor(i / 10) * 18;
    ctx.fillRect(x, y, 3, 3);
  }
}

function drawPlanetScale(width, height) {
  const cx = width * 0.46;
  const cy = height * 0.5;
  const r = Math.min(width, height) * 0.28;
  const planet = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.1, cx, cy, r);
  planet.addColorStop(0, "#7bc8ff");
  planet.addColorStop(0.45, "#255d7b");
  planet.addColorStop(1, "#071421");
  ctx.fillStyle = planet;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  drawContinents(cx, cy, r);
  if (has("reactor")) drawNuclearPlant(width, height);
  if (has("solar")) drawPlanetSolar(width, height);
  if (has("storage")) drawOrbit(width, height, r);
  if (has("fusion")) drawFusion(width, height);
}

function drawContinents(cx, cy, r) {
  ctx.fillStyle = state.climate > 65 ? "rgba(190, 146, 83, 0.72)" : "rgba(82, 149, 92, 0.72)";
  for (let i = 0; i < 5; i += 1) {
    const a = i * 1.22 + 0.4;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * r * 0.38, cy + Math.sin(a) * r * 0.28, r * 0.18, r * 0.07, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255, 231, 153, 0.72)";
  for (let i = 0; i < 42; i += 1) {
    const a = i * 2.399;
    const rr = r * (0.2 + (i % 9) * 0.06);
    ctx.fillRect(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.75, 2, 2);
  }
}

function drawNuclearPlant(width, height) {
  const x = width * 0.75;
  const y = height * 0.63;
  ctx.fillStyle = "rgba(190, 210, 215, 0.88)";
  ctx.beginPath();
  ctx.moveTo(x - 36, y + 56);
  ctx.quadraticCurveTo(x - 25, y - 28, x, y - 36);
  ctx.quadraticCurveTo(x + 25, y - 28, x + 36, y + 56);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(128, 210, 255, 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y - 70, 48, 18, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlanetSolar(width, height) {
  ctx.fillStyle = "rgba(80, 160, 185, 0.8)";
  for (let i = 0; i < 8; i += 1) {
    ctx.save();
    ctx.translate(width * 0.18 + i * 26, height * 0.72 - (i % 3) * 18);
    ctx.rotate(-0.24);
    ctx.fillRect(0, 0, 22, 14);
    ctx.restore();
  }
}

function drawOrbit(width, height, r) {
  ctx.strokeStyle = "rgba(180, 240, 255, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(width * 0.46, height * 0.5, r * 1.35, r * 0.38, -0.22, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFusion(width, height) {
  const x = width * 0.76;
  const y = height * 0.34;
  ctx.strokeStyle = "rgba(255, 210, 170, 0.72)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x, y, 86, 20 + i * 8, performance.now() / 900 + i, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 195, 150, 0.9)";
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawSolarSystem(width, height) {
  const cx = width * 0.32;
  const cy = height * 0.5;
  const sun = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.18);
  sun.addColorStop(0, "rgba(255, 246, 176, 1)");
  sun.addColorStop(0.35, "rgba(255, 177, 61, 0.9)");
  sun.addColorStop(1, "rgba(255, 177, 61, 0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, width, height);

  const t = performance.now() / 6000;
  drawOrbitPath(cx, cy, width * 0.24, height * 0.12);
  drawOrbitPath(cx, cy, width * 0.39, height * 0.2);
  drawPlanetBody(cx + Math.cos(t) * width * 0.24, cy + Math.sin(t) * height * 0.12, 14, "#7bc8ff");
  drawPlanetBody(cx + Math.cos(t + 1.4) * width * 0.39, cy + Math.sin(t + 1.4) * height * 0.2, 22, "#d0a46a");
  if (has("orbital")) drawDyson(width, height, cx, cy);
}

function drawOrbitPath(cx, cy, rx, ry) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPlanetBody(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawDyson(width, height, cx, cy) {
  const t = performance.now() / 5000;
  ctx.fillStyle = "rgba(255, 230, 142, 0.9)";
  for (let i = 0; i < 42; i += 1) {
    const a = i / 42 * Math.PI * 2 + t;
    const x = cx + Math.cos(a) * width * 0.2;
    const y = cy + Math.sin(a) * height * 0.1;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillRect(-5, -2, 10, 4);
    ctx.restore();
  }
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateParticles() {
  const dt = 1 / 60;
  particles = particles.filter((p) => p.life > 0);
  particles.forEach((p) => {
    p.life -= dt;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.035;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function loop(now) {
  const dt = Math.min(0.08, (now - lastTime) / 1000);
  lastTime = now;
  tick(dt);
  update();
  requestAnimationFrame(loop);
}

function reset() {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem("prometheus-web-save");
  } catch {
    // Le jeu reste jouable meme si le navigateur bloque la sauvegarde locale.
  }
  state = defaultState();
  hideEndScreen();
  particles = [];
  update();
  save(true);
}

function hideEndScreen() {
  els.end.hidden = true;
  els.end.classList.add("is-hidden");
}

els.mainAction.addEventListener("click", mainClick);
els.reset.addEventListener("click", reset);
els.endReset.addEventListener("click", reset);

load();
update();
draw();
requestAnimationFrame(loop);
