const page = window.location.pathname;

let joueur = "";


/* =========================
   DETECTION DU JOUEUR
========================= */

if (page.includes("suro-tracker")) {
    joueur = "suro";
}
else if (page.includes("elyross-tracker")) {
    joueur = "elyross";
}
else if (page.includes("yuuji-tracker")) {
    joueur = "yuuji";
}
else if (page.includes("pingu-tracker")) {
    joueur = "pingu";
}
else if (page.includes("biscotte-tracker")) {
    joueur = "biscotte";
}


/* =========================
   CHARGEMENT DU TRACKER
========================= */

async function chargerTracker() {

    try {

        if (!joueur) {
            throw new Error("Joueur non détecté.");
        }

        const response = await fetch(`/api/${joueur}`);

        if (!response.ok) {
            throw new Error(
                "Erreur API : " + response.status
            );
        }

        const data = await response.json();

        console.log("Données reçues :", data);


        /* =========================
           STATS
        ========================= */

        const stats = data.stats || {};


        /* =========================
           RANG
        ========================= */

        const mmr = data.mmr?.data;

        const rankElement =
            document.getElementById("current-rank");

        const rrElement =
            document.getElementById("current-rr");


        if (
            mmr &&
            mmr.current &&
            mmr.current.tier
        ) {

            rankElement.textContent =
                mmr.current.tier.name || "Inconnu";

            rrElement.textContent =
                mmr.current.rr ?? "--";

        }
        else {

            rankElement.textContent =
                "Non classé";

            rrElement.textContent =
                "--";

        }


        /* =========================
           K/D
        ========================= */

        document.getElementById("kd").textContent =
            stats.kd ?? "--";


        /* =========================
           WINRATE
        ========================= */

        document.getElementById("winrate").textContent =
            stats.winrate ?? "--";


        /* =========================
           HEADSHOT
        ========================= */

        document.getElementById("headshot").textContent =
            stats.headshot ?? "--";


        /* =========================
           VICTOIRES
        ========================= */

        document.getElementById("wins").textContent =
            stats.victories ?? "--";


        /* =========================
           KILLS
        ========================= */

        document.getElementById("kills").textContent =
            stats.kills ?? "--";


        /* =========================
           MORTS
        ========================= */

        document.getElementById("deaths").textContent =
            stats.deaths ?? "--";


        /* =========================
           ASSISTS
        ========================= */

        document.getElementById("assists").textContent =
            stats.assists ?? "--";


        /* =========================
           DERNIERS MATCHS
        ========================= */

        const matchesList =
            document.getElementById("matches-list");

        matchesList.innerHTML = "";


        if (
            Array.isArray(data.matches) &&
            data.matches.length > 0
        ) {

            data.matches.forEach(match => {

                const matchElement =
                    document.createElement("div");

                matchElement.className =
                    match.result === "VICTOIRE"
                        ? "match win"
                        : "match loss";


                matchElement.innerHTML = `

                    <div>

                        <strong>
                            ${match.result || "INCONNU"}
                        </strong>

                        <span>
                            ${match.map || "Inconnue"}
                        </span>

                    </div>

                    <div>

                        <span>
                            ${match.agent || "Inconnu"}
                        </span>

                        <span>
                            ${match.kills ?? 0}
                            /
                            ${match.deaths ?? 0}
                            /
                            ${match.assists ?? 0}
                        </span>

                    </div>

                `;


                matchesList.appendChild(
                    matchElement
                );

            });

        }
        else {

            matchesList.innerHTML = `

                <div class="match">

                    <span>
                        Aucun match trouvé.
                    </span>

                </div>

            `;

        }


        /* =========================
           AGENTS
        ========================= */

        const agentsList =
            document.getElementById("agents-list");

        agentsList.innerHTML = "";


        if (
            Array.isArray(data.agents) &&
            data.agents.length > 0
        ) {

            data.agents.forEach(agent => {

                const agentElement =
                    document.createElement("div");

                agentElement.className =
                    "agent-stat";


                agentElement.innerHTML = `

                    <span>
                        ${agent.agent || "Inconnu"}
                    </span>

                    <strong>
                        ${agent.games ?? 0}
                        partie${agent.games > 1 ? "s" : ""}
                    </strong>

                `;


                agentsList.appendChild(
                    agentElement
                );

            });

        }
        else {

            agentsList.innerHTML = `

                <div class="agent-stat">

                    <span>
                        Aucun agent trouvé.
                    </span>

                </div>

            `;

        }


        console.log(
            `Tracker ${joueur} chargé !`
        );

    }


    catch (error) {

        console.error(
            "Erreur Tracker :",
            error
        );

    }

}


/* =========================
   LANCEMENT
========================= */

chargerTracker();