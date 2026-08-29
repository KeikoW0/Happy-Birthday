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

    "What's a random thing you're really passionate or obsessed with? (And/or used to are both alright. It can be anything! Fandoms, activities, something you love, etc.)",

    "What do you like about me? What was your first impression of me, and has it changed?",

    "If we could spend an entire day together for the first time, what would we do or talk about?",

    "And lastly... why are you so cute?",

    "I lied. Lastly, for real... why aren't you my girlfriend yet?"
];


let currentQuestion = 0;


/* =========================
   CURRENT QUIZ ROUND
========================= */

let currentRoundId = null;


/* =========================
   START QUIZ
========================= */

function startQuiz() {

    currentQuestion = 0;

    /*
       Buat ronde baru setiap kali
       quiz dimulai.
    */

    currentRoundId =
        "round_" + Date.now();

    console.log(
        "New quiz round:",
        currentRoundId
    );


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

async function saveAnswer(
    questionIndex,
    userAnswer
) {

    /*
       Jangan simpan kalau belum ada
       ronde yang aktif.
    */

    if (!currentRoundId) {

        console.error(
            "No active quiz round."
        );

        alert(
            "Please start the quiz first."
        );

        return false;
    }


    try {

        const answerRef = doc(
            db,
            "birthday_answers",
            currentRoundId
        );


        await setDoc(
            answerRef,
            {
                [`answer${String(questionIndex + 1).padStart(2, "0")}`]: {

                    question:
                        questions[questionIndex],

                    answer:
                        userAnswer
                },

                updatedAt:
                    serverTimestamp()
            },
            {
                merge: true
            }
        );


        console.log(
            `Answer ${questionIndex + 1} saved to ${currentRoundId}!`
        );


        return true;

    } catch (error) {

        console.error(
            "Firebase error:",
            error
        );


        alert(
            "Your answer couldn't be saved."
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
            "Quiz completed!",
            currentRoundId
        );

        showPage(6);
    }
}


/* =========================
   GIRLFRIEND ANSWER
========================= */

document
    .querySelectorAll(
        'input[name="girlfriend"]'
    )
    .forEach((radio) => {

        radio.addEventListener(
            "change",
            async function () {

                const answer =
                    this.value;


                /*
                   Pastikan user sudah
                   memulai quiz.
                */

                if (!currentRoundId) {

                    console.error(
                        "No active quiz round."
                    );

                    return;
                }


                try {

                    const answerRef =
                        doc(
                            db,
                            "birthday_answers",
                            currentRoundId
                        );


                    await setDoc(
                        answerRef,
                        {
                            girlfriendAnswer:
                                answer,

                            updatedAt:
                                serverTimestamp()
                        },
                        {
                            merge: true
                        }
                    );


                    console.log(
                        "Girlfriend answer saved:",
                        answer,
                        "in",
                        currentRoundId
                    );


                } catch (error) {

                    console.error(
                        "Failed to save girlfriend answer:",
                        error
                    );

                }

            }
        );

    });


/* =========================
   INTERACTIVE LETTER
========================= */

function openLetter() {

    const letterCover =
        document.getElementById("letterCover");

    const letterContent =
        document.getElementById("letterContent");


    if (!letterContent) {
        return;
    }


    letterContent.classList.add("open");


    if (letterCover) {
        letterCover.style.display = "none";
    }
}


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

window.previousPage =
    previousPage;

window.startQuiz =
    startQuiz;

window.nextQuestion =
    nextQuestion;

window.openSpotify =
    openSpotify;

window.openLetter =
    openLetter;


/* =========================
   TEST
========================= */

console.log(
    "script.js + Firebase berhasil dimuat!"
);