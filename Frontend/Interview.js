const progressLabel =
    document.getElementById("progressLabel");

const progressFill =
    document.getElementById("progressFill");

const sessionCard =
    document.querySelector(".session-card");

const questionLabel =
    document.getElementById("questionLabel");

const questionText =
    document.getElementById("questionText");

const answerInput =
    document.getElementById("answerInput");

const speakBtn =
    document.getElementById("speakBtn");

const micBtn =
    document.getElementById("micBtn");

const nextBtn =
    document.getElementById("nextBtn");

const exitBtn =
    document.getElementById("exitBtn");


// Read what was chosen on the setup screen.
// Falls back to sensible defaults if someone lands here directly.

const setup = JSON.parse(
    sessionStorage.getItem("interviewSetup") || "{}"
);

const totalQuestions = setup.count || 10;


// Placeholder questions until the backend can read the resume
// and generate real ones. Answers typed here aren't sent
// anywhere yet - this is still frontend-only.

const placeholderQuestions = [
    "Tell me about yourself and walk me through your resume.",
    "What project are you most proud of, and why?",
    "Describe a challenging bug you fixed recently.",
    "How do you approach learning a new technology?",
    "Tell me about a time you disagreed with a teammate.",
    "What's a technical decision you'd make differently now?",
    "How do you prioritize tasks when everything feels urgent?",
    "Explain a concept from your resume as if I'm a beginner.",
    "What are you looking for in your next role?",
    "Do you have any questions for me?"
];


let currentIndex = 0;
const answers = [];


function speakQuestion(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;

    speakBtn.classList.add("is-active");

    utterance.onend = function () {
        speakBtn.classList.remove("is-active");
    };

    window.speechSynthesis.speak(utterance);

}


speakBtn.addEventListener("click", function () {

    speakQuestion(questionText.textContent);

});


function loadQuestion(index) {

    const questionNumber = index + 1;

    progressLabel.textContent =
        "Question " + questionNumber + " of " + totalQuestions;

    progressFill.style.width =
        (questionNumber / totalQuestions) * 100 + "%";

    questionLabel.textContent =
        "QUESTION " + String(questionNumber).padStart(2, "0");

    // Cycle through placeholders if there are more questions
    // than sample questions.
    questionText.textContent =
        placeholderQuestions[index % placeholderQuestions.length];

    answerInput.value = "";

    answerInput.focus();

    nextBtn.textContent = "";

    const label = document.createElement("span");

    label.textContent =
        questionNumber === totalQuestions
            ? "Finish Interview "
            : "Next Question ";

    const arrow = document.createElement("span");

    arrow.textContent = "→";

    nextBtn.appendChild(label);
    nextBtn.appendChild(arrow);

    speakQuestion(questionText.textContent);

}


function showThinking(callback) {

    sessionCard.classList.add("is-thinking");

    nextBtn.disabled = true;

    // Fake "AI is generating the next question" delay.
    // Replace with a real API call once the backend exists.
    setTimeout(function () {

        sessionCard.classList.remove("is-thinking");

        nextBtn.disabled = false;

        callback();

    }, 900);

}


nextBtn.addEventListener("click", function () {

    if (isListening && recognition) {
        recognition.stop();
    }

    answers.push(answerInput.value.trim());

    const isLastQuestion =
        currentIndex + 1 >= totalQuestions;

    if (isLastQuestion) {

        sessionStorage.setItem(
            "interviewAnswers",
            JSON.stringify(answers)
        );

        sessionStorage.setItem(
            "interviewQuestions",
            JSON.stringify(
                Array.from({ length: totalQuestions }, function (_, i) {
                    return placeholderQuestions[
                        i % placeholderQuestions.length
                    ];
                })
            )
        );

        window.location.href = "feedback.html";

        return;

    }

    showThinking(function () {

        currentIndex = currentIndex + 1;

        loadQuestion(currentIndex);

    });

});


// Speech-to-text for the mic button. Only Chrome/Edge support
// this well today (as webkitSpeechRecognition); other browsers
// just won't show the button.

const SpeechRecognitionAPI =
    window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;

if (!SpeechRecognitionAPI) {

    micBtn.style.display = "none";

} else {

    recognition = new SpeechRecognitionAPI();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";

    let baseText = "";

    recognition.addEventListener("start", function () {

        isListening = true;

        baseText = answerInput.value;

        micBtn.classList.add("is-listening");

        micBtn.textContent = "🎤 Listening…";

    });

    recognition.addEventListener("result", function (event) {

        let transcript = "";

        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        answerInput.value =
            (baseText + " " + transcript).trim();

    });

    recognition.addEventListener("end", function () {

        isListening = false;

        micBtn.classList.remove("is-listening");

        micBtn.textContent = "🎤 Speak";

    });

    micBtn.addEventListener("click", function () {

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }

    });

}


exitBtn.addEventListener("click", function () {

    const confirmed = confirm(
        "Leave this interview? Your progress won't be saved."
    );

    if (confirmed) {
        window.location.href = "index.html";
    }

});


loadQuestion(currentIndex);