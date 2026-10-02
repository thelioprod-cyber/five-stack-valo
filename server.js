require("dotenv").config();

const express = require("express");
const app = express();

const PORT = 3000;

app.use(express.static(__dirname));


/* =========================================================
   RECUPERATION DES DONNEES VALORANT
========================================================= */

async function getPlayerData(name, tag) {

    const headers = {
        Authorization: process.env.HENRIK_API_KEY
    };

    const n = encodeURIComponent(name);
    const t = encodeURIComponent(tag);


    /* =========================
       COMPTE
    ========================= */

    const accountResponse = await fetch(
        `https://api.henrikdev.xyz/valorant/v1/account/${n}/${t}`,
        { headers }
    );

    const account = await accountResponse.json();

    if (!account.data) {
        throw new Error(
            `Joueur introuvable : ${name}#${tag}`
        );
    }


    /* =========================
       RANG
    ========================= */

    const mmrResponse = await fetch(
        `https://api.henrikdev.xyz/valorant/v3/mmr/eu/pc/${n}/${t}`,
        { headers }
    );

    const mmr = await mmrResponse.json();


    /* =========================
       MATCHS
    ========================= */

    const matchesResponse = await fetch(
        `https://api.henrikdev.xyz/valorant/v3/matches/eu/${n}/${t}?filter=competitive&size=10`,
        { headers }
    );

    const matches = await matchesResponse.json();


    /* =========================
       VARIABLES
    ========================= */

    let kills = 0;
    let deaths = 0;
    let assists = 0;

    let headshots = 0;
    let bodyshots = 0;
    let legshots = 0;

    let victories = 0;
    let games = 0;

    const recentMatches = [];
    const agentCounts = {};


    /* =========================
       TRAITEMENT DES MATCHS
    ========================= */

    if (
        matches.data &&
        Array.isArray(matches.data)
    ) {

        for (const match of matches.data) {

            const players =
                match.players?.all_players || [];


            const player = players.find(
                p => p.puuid === account.data.puuid
            );


            if (!player) {
                continue;
            }


            const stats = player.stats || {};


            /* =========================
               STATS
            ========================= */

            kills += stats.kills || 0;
            deaths += stats.deaths || 0;
            assists += stats.assists || 0;

            headshots += stats.headshots || 0;
            bodyshots += stats.bodyshots || 0;
            legshots += stats.legshots || 0;

            games++;


            /* =========================
               AGENT
            ========================= */

            const agent =
                player.character || "Inconnu";


            if (!agentCounts[agent]) {
                agentCounts[agent] = 0;
            }

            agentCounts[agent]++;


            /* =========================
               VICTOIRE / DEFAITE
            ========================= */

            const team =
                String(player.team || "").toLowerCase();

            const teams =
                match.teams || {};

            const teamKey =
                Object.keys(teams).find(
                    key =>
                        key.toLowerCase() === team
                );

            const teamData =
                teamKey
                    ? teams[teamKey]
                    : null;


            const won =
                teamData?.has_won === true ||
                teamData?.won === true;


            if (won) {
                victories++;
            }


            /* =========================
               MATCH RECENT
            ========================= */

            recentMatches.push({

                map:
                    match.metadata?.map ||
                    "Inconnue",

                mode:
                    match.metadata?.mode ||
                    "Compétitif",

                agent: agent,

                kills:
                    stats.kills || 0,

                deaths:
                    stats.deaths || 0,

                assists:
                    stats.assists || 0,

                result:
                    won
                        ? "VICTOIRE"
                        : "DÉFAITE"
            });
        }
    }


    /* =========================================================
       K/D
    ========================================================= */

    const kd =
        deaths > 0
            ? (kills / deaths).toFixed(2)
            : kills.toFixed(2);


    /* =========================================================
       WINRATE
    ========================================================= */

    const winrate =
        games > 0
            ? Math.round(
                (victories / games) * 100
            )
            : 0;


    /* =========================================================
       HEADSHOT
    ========================================================= */

    const totalShots =
        headshots +
        bodyshots +
        legshots;


    const headshot =
        totalShots > 0
            ? Math.round(
                (headshots / totalShots) * 100
            )
            : 0;


    /* =========================================================
       AGENTS
    ========================================================= */

    const agents =
        Object.entries(agentCounts)
            .sort(
                (a, b) => b[1] - a[1]
            )
            .map(
                ([agent, games]) => ({
                    agent,
                    games
                })
            );


    /* =========================================================
       REPONSE
    ========================================================= */

    return {

        account,

        mmr,

        stats: {

            kd,

            winrate,

            headshot,

            victories,

            games,

            kills,

            deaths,

            assists
        },

        matches: recentMatches,

        agents
    };
}


/* =========================================================
   ROUTES API
========================================================= */


/* =========================
   SURO
========================= */

app.get("/api/suro", async (req, res) => {

    try {

        res.json(
            await getPlayerData(
                "ES SURO",
                "DUO"
            )
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   ELYROSS
========================= */

app.get("/api/elyross", async (req, res) => {

    try {

        res.json(
            await getPlayerData(
                "ES elyross",
                "DUO"
            )
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   YUUJI
========================= */

app.get("/api/yuuji", async (req, res) => {

    try {

        res.json(
            await getPlayerData(
                "Yuuji",
                "QLF"
            )
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   PINGU
========================= */

app.get("/api/pingu", async (req, res) => {

    try {

        res.json(
            await getPlayerData(
                "Pingu",
                "2320"
            )
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================
   BISCOTTE
========================= */

app.get("/api/biscotte", async (req, res) => {

    try {

        res.json(
            await getPlayerData(
                "BiscotteEnStage",
                "3450"
            )
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================================================
   SERVEUR
========================================================= */

app.listen(PORT, () => {

    console.log(
        `Serveur lancé sur http://localhost:${PORT}`
    );

});