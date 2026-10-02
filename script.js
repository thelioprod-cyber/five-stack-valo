function launchTransition(cardSelector, transitionSelector, destination, duration) {

    const card = document.querySelector(cardSelector);
    const transition = document.querySelector(transitionSelector);

    if (!card || !transition) {
        console.log("Transition introuvable :", cardSelector);
        return;
    }

    card.addEventListener("click", function(event) {

        event.preventDefault();

        transition.classList.add("active");

        setTimeout(function() {
            window.location.href = destination;
        }, duration);

    });
}


/* 💜 CLOVE */
launchTransition(
    ".player.clove",
    "#clove-transition",
    "./joueur/suro.html",
    1000
);


/* 💎 SAGE */
launchTransition(
    ".player.sage",
    "#sage-transition",
    "./joueur/elyross.html",
    1000
);


/* 💨 JETT */
launchTransition(
    ".player.jett",
    "#jett-transition",
    "./joueur/yuuji.html",
    900
);


/* 🌊 HARBOR */
launchTransition(
    ".player.harbor",
    "#harbor-transition",
    "./joueur/pingu.html",
    900
);


/* 👁️ REYNA */
launchTransition(
    ".player.reyna",
    "#reyna-transition",
    "./joueur/biscotte.html",
    1000
);