const genres = ["Action", "Action Comedy", "Adventure", "Body Horror", "Buddy Cop", "Animated",
    "Chick Flick", "Comedy", "Comedy Drama", "Horror Comedy", "Coming of Age", "Drama",
    "Fantasy", "Heist", "Horror", "Mafia", "Thriller", "Sci Fi", "Crime", "Romance", "Dystopie", "Musical"];
const plots = [
    "Poster ist rot",
    "Poster ist blau",
    "Poster ist grün",
    "Poster ist gelb",
    "Nicht Deutsch oder Englisch",
    "Hat einen Namen im Titel",
    "Buch-verfilmung",
    "Musiker in Hauptrolle",
    "Comedian in Hauptrolle",
    "Remake",
    "> 90min",
    "Weibliche Protagonistin",
    "Oscargewinner",
    "Deutscher Film",
    "Kammerspiel",
    "Regiedebüt",
    "Rewatch",
    "> 3h",
    "Low Budget",
    "Zahl im Titel",
    "Spielt im Fortbewegungsmittel",
    "Durchbricht 4. Wand",
    "< 10 Schauspieler",
    "Hat Stadtnamen im Titel",
    "Weibliche Regisseurin",
    "Kurzfilm",
    "Letterboxd Top 500",
    "Zeitreisen",
    "Tierischer oder Technischer Begleiter",
    "> 100 Reviews auf Letterboxd",
    "Film mit Meme",
    "Aus verschiedenen POVs erzählt",
    "Im Weltall",
    "Hat Willhelm Scream",
    "Mehr als 5 Worte im Titel",
    "Hat keiner deiner Freunde auf Letterboxd gesehen",
    "Hat Bewertung von 2 - 2.9",
    "Hat Bewertung von 3 - 3.9",
    "Hat Bewertung von 4 - 5",
    "Satzzeichen im Titel",
    "Hat Voiceover",



];

const minYearSelect = document.getElementById("minYear");
const maxYearSelect = document.getElementById("maxYear");

const yearReel = document.getElementById("yearReel");
const genreReel = document.getElementById("genreReel");
const plotReel = document.getElementById("plotReel");

const lever = document.querySelector(".lever");
const arm = document.querySelector(".lever-arm");
const machine = document.querySelector(".machine");

const leverSound = new Audio("sounds/lever.mp3");
const spinSound = new Audio("sounds/spin.mp3");
const dingSound = new Audio("sounds/ding.mp3");

leverSound.volume = 0.5;
spinSound.volume = 0.25;
dingSound.volume = 0.8;

let isSpinning = false;

function populateYearSelectors() {
    const currentYear = new Date().getFullYear();

    for (let year = 1950; year <= currentYear; year++) {
        const option1 = document.createElement("option");
        option1.value = year;
        option1.textContent = year;

        const option2 = option1.cloneNode(true);

        minYearSelect.appendChild(option1);
        maxYearSelect.appendChild(option2);
    }

    minYearSelect.value = 1970;
    maxYearSelect.value = currentYear;
}

populateYearSelectors();

function getRandomYear() {
    let min = Number(minYearSelect.value);
    let max = Number(maxYearSelect.value);

    if (min > max) {
        [min, max] = [max, min];
    }

    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function getRandomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function getSlotHeight(reel) {
    return reel.parentElement.getBoundingClientRect().height;
}

function createItem(text, height) {
    const item = document.createElement("div");
    item.className = "reel-item";
    item.textContent = text;
    item.style.height = `${height}px`;
    return item;
}

function showFinalItem(reel, text) {
    const height = getSlotHeight(reel);

    reel.innerHTML = "";
    reel.style.transition = "none";
    reel.style.transform = "translateY(0)";

    reel.appendChild(createItem(text, height));
}

function fillReel(reel, getValue, height) {
    reel.innerHTML = "";
    reel.style.transition = "none";
    reel.style.transform = "translateY(0)";

    for (let i = 0; i < 30; i++) {
        reel.appendChild(createItem(getValue(), height));
    }
}

function spinReel(reel, getValue, duration) {
    const height = getSlotHeight(reel);

    fillReel(reel, getValue, height);

    const finalItem = getValue();
    reel.appendChild(createItem(finalItem, height));

    const distance = (reel.children.length - 1) * height;

    requestAnimationFrame(() => {
        reel.style.transition = `transform ${duration}ms cubic-bezier(.18,.78,.25,1)`;
        reel.style.transform = `translateY(-${distance}px)`;
    });

    setTimeout(() => {
        reel.style.transition = "transform 110ms ease-out";
        reel.style.transform = `translateY(-${distance - 12}px)`;
    }, duration);

    setTimeout(() => {
        reel.style.transition = "transform 70ms ease-in";
        reel.style.transform = `translateY(-${distance}px)`;
    }, duration + 110);

    setTimeout(() => {
        showFinalItem(reel, finalItem);
    }, duration + 190);
}

showFinalItem(yearReel, "1999");
showFinalItem(genreReel, "Thriller");
showFinalItem(plotReel, "Alien Invasion");

lever.addEventListener("click", () => {
    if (isSpinning) return;

    isSpinning = true;

    leverSound.currentTime = 0;
    leverSound.play();

    spinSound.currentTime = 0;
    spinSound.play();

    arm.classList.add("pulled");
    machine.classList.add("lights-on");

    spinReel(yearReel, getRandomYear, 1000);
    spinReel(genreReel, () => getRandomItem(genres), 1400);
    spinReel(plotReel, () => getRandomItem(plots), 1800);

    setTimeout(() => {
        arm.classList.remove("pulled");
    }, 180);

    setTimeout(() => {
        spinSound.pause();
        spinSound.currentTime = 0;

        dingSound.currentTime = 0;
        dingSound.play();

        isSpinning = false;
        machine.classList.remove("lights-on");
    }, 2100);
});