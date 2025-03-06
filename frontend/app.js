// Simuler des créneaux disponibles en fonction du motif
const disponibilites = {
    consultation: ["09:00", "10:00", "11:30", "14:00"],
    suivi: ["10:30", "15:00", "16:30"],
    vaccination: ["09:30", "12:00", "13:30", "17:00"]
};

// Fonction de connexion
function login() {
    let username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Veuillez entrer un nom d'utilisateur.");
        return;
    }

    // Sauvegarder le nom de l'utilisateur
    localStorage.setItem("username", username);

    // Afficher le tableau de bord
    document.getElementById("userDisplay").innerText = username;
    document.getElementById("login").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
}

// Fonction pour restaurer l'utilisateur au rechargement
function restaurerUtilisateur() {
    let username = localStorage.getItem("username");
    if (username) {
        document.getElementById("userDisplay").innerText = username;
        document.getElementById("login").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
    }
}

// Fonction pour afficher la section prise de rendez-vous
function afficherPriseRdv() {
    document.getElementById("rdvSection").style.display = "block";
}

// Fonction pour afficher les créneaux disponibles
function afficherDisponibilites() {
    let motif = document.getElementById("motifRdv").value;
    let liste = document.getElementById("listeDisponibilites");
    liste.innerHTML = ""; // Vider la liste avant d'ajouter de nouveaux éléments

    if (!motif) {
        alert("Veuillez choisir un motif.");
        return;
    }

    // Afficher la section des disponibilités
    document.getElementById("disponibilites").style.display = "block";

    // Boucle pour afficher chaque créneau
    disponibilites[motif].forEach(horaire => {
        let li = document.createElement("li");
        li.innerText = horaire;

        // Créer un bouton dynamiquement
        let btn = document.createElement("button");
        btn.innerText = "Réserver";

        // Ajouter un événement au bouton
        btn.addEventListener("click", function (event) {
            prendreRdv(horaire, event);
        });

        // Ajouter le bouton et l'élément li à la liste
        li.appendChild(btn);
        liste.appendChild(li);
    });

    // Charger les rendez-vous après l'affichage des créneaux
    setTimeout(chargerRdvs, 100);
}


// Fonction pour prendre un RDV (et bloquer l’horaire)
function prendreRdv(horaire, event) {
    console.log(`→ Fonction prendreRdv appelée avec : ${horaire}`);
    alert(`Rendez-vous réservé à ${horaire} !`);

    // Désactiver le bouton cliqué
    let bouton = event.target;
    bouton.innerText = "Réservé";
    bouton.disabled = true;
    bouton.style.backgroundColor = "gray";

    // Sauvegarder le créneau réservé dans localStorage
    let rdvs = JSON.parse(localStorage.getItem("rdvs")) || [];
    rdvs.push(horaire);
    localStorage.setItem("rdvs", JSON.stringify(rdvs));
}

// Fonction pour charger les rendez-vous et désactiver les créneaux réservés
function chargerRdvs() {
    let rdvs = JSON.parse(localStorage.getItem("rdvs")) || [];

    document.querySelectorAll("#listeDisponibilites li").forEach(li => {
        let bouton = li.querySelector("button");
        if (rdvs.includes(li.firstChild.textContent.trim())) {
            bouton.innerText = "Réservé";
            bouton.disabled = true;
            bouton.style.backgroundColor = "gray";
        }
    });
}


// Appeler cette fonction au chargement de la page
restaurerUtilisateur();
