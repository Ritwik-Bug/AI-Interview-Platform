const scoreNumber =
    document.getElementById("scoreNumber");

const scoreRing =
    document.getElementById("scoreRing");

const scoreHeadline =
    document.getElementById("scoreHeadline");

const scoreSummary =
    document.getElementById("scoreSummary");

const breakdownList =
    document.getElementById("breakdownList");

const homeBtn =
    document.getElementById("homeBtn");

const retryBtn =
    document.getElementById("retryBtn");


const questions = JSON.parse(
    sessionStorage.getItem("interviewQuestions") || "[]"
);

const answers = JSON.parse(
    sessionStorage.getItem("interviewAnswers") || "[]"
);


// No real AI grading yet - this scores based on how complete
// each answer looks (length-based), just as a frontend
// placeholder. Replace with real scores from the backend once
// the AI can actually evaluate answers.

function scoreAnswer(answer) {

    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount === 0) {
        return 0;
    }

    if (wordCount < 10) {
        return 55;
    }

    if (wordCount < 30) {
        return 75;
    }

    return 90;

}


function feedbackNote(score) {

    if (score === 0) {
        return "No answer given - try to attempt every question.";
    }

    if (score < 60) {
        return "A bit brief. Try adding a specific example next time.";
    }

    if (score < 80) {
        return "Solid answer. More detail would make it stronger.";
    }

    return "Great answer - clear and well explained.";

}


function renderBreakdown() {

    let total = 0;

    questions.forEach(function (question, index) {

        const answer = answers[index] || "";

        const score = scoreAnswer(answer);

        total = total + score;

        const item = document.createElement("div");

        item.className = "breakdown-item";

        const top = document.createElement("div");

        top.className = "breakdown-item-top";

        const questionEl = document.createElement("span");

        questionEl.className = "breakdown-question";

        questionEl.textContent =
            "Q" + (index + 1) + ". " + question;

        const scoreEl = document.createElement("span");

        scoreEl.className = "breakdown-score";

        scoreEl.textContent = score + "/100";

        top.appendChild(questionEl);
        top.appendChild(scoreEl);

        const answerEl = document.createElement("p");

        answerEl.className = "breakdown-answer";

        answerEl.textContent =
            answer.trim().length > 0
                ? "\u201c" + answer.trim() + "\u201d"
                : "(no answer given)";

        const noteEl = document.createElement("p");

        noteEl.className = "breakdown-note";

        noteEl.textContent = feedbackNote(score);

        item.appendChild(top);
        item.appendChild(answerEl);
        item.appendChild(noteEl);

        breakdownList.appendChild(item);

    });

    const overall =
        questions.length > 0
            ? Math.round(total / questions.length)
            : 0;

    scoreNumber.textContent = overall;

    scoreRing.style.setProperty("--score", overall);

    if (overall >= 80) {
        scoreHeadline.textContent = "Excellent work!";
    } else if (overall >= 60) {
        scoreHeadline.textContent = "Good effort!";
    } else {
        scoreHeadline.textContent = "Keep practicing!";
    }

    scoreSummary.textContent =
        "You answered " + questions.length + " questions. " +
        "Detailed, specific answers score best.";

}


if (questions.length === 0) {

    // No session data (e.g. someone opened this page directly).
    scoreSummary.textContent =
        "No interview data found - try starting a new interview.";

} else {

    renderBreakdown();

}


homeBtn.addEventListener("click", function () {
    window.location.href = "index.html";
});


retryBtn.addEventListener("click", function () {
    window.location.href = "setup.html";
});