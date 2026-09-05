const startInterviewBtn =
    document.getElementById("startInterviewBtn");

const getStartedBtn =
    document.getElementById("getStartedBtn");

const loginBtn =
    document.getElementById("loginBtn");

const learnMoreBtn =
    document.getElementById("learnMoreBtn");

const ctaBtn =
    document.getElementById("ctaBtn");


startInterviewBtn.addEventListener("click", function () {

    window.location.href = "setup.html";

});


getStartedBtn.addEventListener("click", function () {

    window.location.href = "signup.html";

});


loginBtn.addEventListener("click", function () {

    window.location.href = "login.html";

});


learnMoreBtn.addEventListener("click", function () {

    document
        .getElementById("features")
        .scrollIntoView({
            behavior: "smooth"
        });

});


ctaBtn.addEventListener("click", function () {

    window.location.href = "setup.html";

}); 