/* =========================
   FIREBASE
========================= */

import { db } from "./firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


/* =========================
   PAGE SYSTEM
========================= */

let currentPage = 1;
const totalPages = 6;

const pageNumber =
    document.getElementById("pageNumber");


function showPage(number) {

    if (number < 1 || number > totalPages) {
        return;
    }

    const currentPageElement =
        document.getElementById("page" + currentPage);

    const nextPageElement =
        document.getElementById("page" + number);

    if (!currentPageElement || !nextPageElement) {
        console.log("Page tidak ditemukan");
        return;
    }

    currentPageElement.classList.remove("active");

    nextPageElement.classList.add("active");

    currentPage = number;

    if (pageNumber) {
        pageNumber.textContent =
            String(currentPage).padStart(2, "0");
    }
}


/* =========================
   NEXT PAGE
========================= */

function nextPage() {

    console.log("Next button clicked!");

    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

function previousPage() {

    if (currentPage > 1) {
        showPage(currentPage - 1);
    }

}


/* =========================
   QUIZ QUESTIONS
========================= */

const questions = [

    "What's something you're really looking forward to?",

    "What's a random thing you're really passionate or obsessed with?",

    "What's your favorite way to spend time with someone you like being around?",

    "What's one thing you wish more people knew about you?",

    "If we met in person for the first time, what do you think we'd talk about first?",

    "If we could spend an entire day together, what would we do?",

    "What do you like about me?",

    "Another thing... why are you so cute?",

    "And lastly... In what stage we can video call together?",

    "I lied. Lastly fr, why aren't you my girlfriend yet?"
];


let currentQuestion = 0;


/* =========================
   START QUIZ
========================= */

function startQuiz() {

    currentQuestion = 0;

    const questionText =
        document.getElementById("questionText");

    const questionNumber =
        document.getElementById("questionNumber");

    const answer =
        document.getElementById("answer");


    questionText.textContent =
        questions[currentQuestion];


    questionNumber.textContent =
        "01";


    answer.value = "";


    showPage(5);
}


/* =========================
   SAVE ANSWER
========================= */

async function saveAnswer(questionIndex, userAnswer) {

    try {

        const answerRef = doc(
            db,
            "birthday_answers",
            "sanjukta"
        );

        await setDoc(
            answerRef,
            {
                [`answer${String(questionIndex + 1).padStart(2, "0")}`]: {
                    question: questions[questionIndex],
                    answer: userAnswer
                },

                updatedAt: serverTimestamp()
            },
            {
                merge: true
            }
        );

        console.log(
            `Answer ${questionIndex + 1} saved!`
        );

        return true;

    } catch (error) {

        console.error(
            "Firebase error:",
            error
        );

        alert(
            "Oops! Your answer couldn't be saved ♡"
        );

        return false;
    }
}


/* =========================
   NEXT QUESTION
========================= */

async function nextQuestion() {

    const answer =
        document.getElementById("answer");

    const questionText =
        document.getElementById("questionText");

    const questionNumber =
        document.getElementById("questionNumber");


    const userAnswer =
        answer.value.trim();


    /* =========================
       CHECK EMPTY ANSWER
    ========================= */

    if (userAnswer === "") {

        alert(
            "You won't tell me anything? :("
        );

        return;
    }


    /* =========================
       SAVE TO FIREBASE
    ========================= */

    const saved =
        await saveAnswer(
            currentQuestion,
            userAnswer
        );


    /*
       Kalau gagal disimpan,
       jangan pindah pertanyaan.
    */

    if (!saved) {
        return;
    }


    /* =========================
       NEXT QUESTION
    ========================= */

    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;


        questionText.textContent =
            questions[currentQuestion];


        questionNumber.textContent =
            String(
                currentQuestion + 1
            ).padStart(2, "0");


        answer.value = "";

    }


    /* =========================
       QUIZ FINISHED
    ========================= */

    else {

        console.log(
            "Quiz completed!"
        );

        showPage(6);
    }
}

document.querySelectorAll('input[name="girlfriend"]').forEach((radio) => {

    radio.addEventListener("change", async function () {

        const answer = this.value;

        try {

            const answerRef = doc(
                db,
                "birthday_answers",
                "sanjukta"
            );

            await setDoc(
                answerRef,
                {
                    girlfriendAnswer: answer,
                    updatedAt: serverTimestamp()
                },
                {
                    merge: true
                }
            );

            console.log(
                "Girlfriend answer saved:",
                answer
            );

        } catch (error) {

            console.error(
                "Failed to save girlfriend answer:",
                error
            );

        }

    });

});


/* =========================
   SPOTIFY
========================= */

function openSpotify() {

    window.open(
        "https://open.spotify.com/playlist/5uGXaSNUHvGUvBSVPNhz1v",
        "_blank"
    );
}


/* =========================
   MAKE FUNCTIONS AVAILABLE
   TO HTML ONCLICK
========================= */

window.nextPage =
    nextPage;

window.previousPage = previousPage;

window.startQuiz =
    startQuiz;

window.nextQuestion =
    nextQuestion;

window.openSpotify =
    openSpotify;


/* =========================
   TEST
========================= */

console.log(
    "script.js + Firebase berhasil dimuat!"
);
