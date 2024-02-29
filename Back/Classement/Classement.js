// Définition des plages de rangs avec sous-niveaux pour MMR et EPI
const ranks = [
  { min: 0, max: 99, name: "Fer 4" },
  { min: 100, max: 199, name: "Fer 3" },
  { min: 200, max: 299, name: "Fer 2" },
  { min: 300, max: 399, name: "Fer 1" },
  { min: 400, max: 499, name: "Bronze 4" },
  { min: 500, max: 599, name: "Bronze 3" },
  { min: 600, max: 699, name: "Bronze 2" },
  { min: 700, max: 799, name: "Bronze 1" },
  { min: 800, max: 899, name: "Argent 4" },
  { min: 900, max: 999, name: "Argent 3" },
  { min: 1000, max: 1099, name: "Argent 2" },
  { min: 1100, max: 1199, name: "Argent 1" },
  { min: 1200, max: 1299, name: "Or 4" },
  { min: 1300, max: 1399, name: "Or 3" },
  { min: 1400, max: 1499, name: "Or 2" },
  { min: 1500, max: 1599, name: "Or 1" },
  { min: 1600, max: 1699, name: "Platine 4" },
  { min: 1700, max: 1799, name: "Platine 3" },
  { min: 1800, max: 1899, name: "Platine 2" },
  { min: 1900, max: 1999, name: "Platine 1" },
  { min: 2000, max: 2099, name: "Émeraude 4" },
  { min: 2100, max: 2199, name: "Émeraude 3" },
  { min: 2200, max: 2299, name: "Émeraude 2" },
  { min: 2300, max: 2399, name: "Émeraude 1" },
  { min: 2400, max: 2499, name: "Diamant 4" },
  { min: 2500, max: 2599, name: "Diamant 3" },
  { min: 2600, max: 2699, name: "Diamant 2" },
  { min: 2700, max: 2799, name: "Diamant 1" },
  { min: 2800, max: 3199, name: "Maître" },
  { min: 3200, max: 3599, name: "Grand Maître" },
  { min: 3600, max: Infinity, name: "Challenger" },
];

function getRank(score) {
  const rank = ranks.find((rank) => score >= rank.min && score <= rank.max);
  return rank ? rank.name : "Non classé";
}

function ajustementEPI(mmrScore, epiScore) {
  const epiBaseGain = 20;
  const mmrRank = getRank(mmrScore);
  console.log("Rank MMR :", mmrRank);
  const epiRank = getRank(epiScore);
  console.log("Rank EPI :", epiRank);

  const mmrIndex = ranks.findIndex((rank) => rank.name === mmrRank);
  console.log("MMR Index :", mmrIndex);
  const epiIndex = ranks.findIndex((rank) => rank.name === epiRank);
  console.log("Epi Index:", epiIndex);

  const diff = mmrIndex - epiIndex;
  console.log("Différence de rangs :", diff);

  if (diff > 0) {
    return epiBaseGain + diff * epiBaseGain * 0.05; //si mmr > epi, on augmente le gain de EPI par al différence de rang de 5%
  } else if (diff < 0) {
    return epiBaseGain + diff * epiBaseGain * 0.05; //si mmr < epi, on diminue le gain de EPI par la différence de rang de 5%
  } else {
    return epiBaseGain;
  }
}

module.exports = { getRank, ajustementEPI };
