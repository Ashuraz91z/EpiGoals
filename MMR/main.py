import pandas as pd

def calculer_changement(mmr_joueur, mmr_adversaire, score, k_mmr, k_epi, est_victoire):
    resultat_attendu = 1 / (1 + 10 ** ((mmr_adversaire - mmr_joueur) / 2000))
    resultat_reel = 1 if est_victoire else 0

    changement_mmr = k_mmr * (resultat_reel - resultat_attendu)
    changement_epi = k_epi * (resultat_reel - resultat_attendu)

    return changement_mmr, changement_epi

# Paramètres
k_mmr = 30
k_epi = 15
mmr_joueur = 1700
mmr_adversaire = 1000
score = 5  # Exemple de score du match
epi_joueur = 500  # EPI initial du joueur
epi_adversaire = 300  # EPI initial de l'adversaire

est_victoire = score > 0

# Calcul pour le joueur
changement_mmr_joueur, changement_epi_joueur = calculer_changement(mmr_joueur, mmr_adversaire, score, k_mmr, k_epi, est_victoire)
mmr_joueur_apres = mmr_joueur + changement_mmr_joueur
epi_joueur_apres = epi_joueur + changement_epi_joueur

# Calcul pour l'adversaire
changement_mmr_adversaire, changement_epi_adversaire = calculer_changement(mmr_adversaire, mmr_joueur, -score, k_mmr, k_epi, not est_victoire)
mmr_adversaire_apres = mmr_adversaire + changement_mmr_adversaire
epi_adversaire_apres = epi_adversaire + changement_epi_adversaire

# Création du DataFrame
resultats = pd.DataFrame({
    "Joueur": ["Joueur", "Adversaire"],
    "MMR Avant Match": [mmr_joueur, mmr_adversaire],
    "Changement MMR": [changement_mmr_joueur, changement_mmr_adversaire],
    "MMR Après Match": [mmr_joueur_apres, mmr_adversaire_apres],
    "EPI Avant Match": [epi_joueur, epi_adversaire],
    "Changement EPI": [changement_epi_joueur, changement_epi_adversaire],
    "EPI Après Match": [epi_joueur_apres, epi_adversaire_apres]
})

# Exportation en format Excel
resultats.to_excel("resultats_mmr_epi.xlsx", index=False)
