// Shared by login.html and signup.html. Detects which form is
// present on the page and wires up the matching validation.
// No backend yet - a successful submit just simulates login by
// redirecting to the homepage.

function showError(inputEl, errorEl, message) {

    errorEl.textContent = message;

    if (message) {
        inputEl.classList.add("has-error");
    } else {
        inputEl.classList.remove("has-error");
    }

}


function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");


if (loginForm) {

    const email = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    const password = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let isValid = true;

        if (!isValidEmail(email.value.trim())) {
            showError(email, emailError, "Enter a valid email address.");
            isValid = false;
        } else {
            showError(email, emailError, "");
        }

        if (password.value.length === 0) {
            showError(password, passwordError, "Enter your password.");
            isValid = false;
        } else {
            showError(password, passwordError, "");
        }

        if (!isValid) {
            return;
        }

        // Placeholder: no backend to authenticate against yet.
        alert("Login works! (No backend yet - this is a placeholder.)");

    });

}


if (signupForm) {

    const name = document.getElementById("name");
    const nameError = document.getElementById("nameError");

    const email = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    const password = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");

    const confirmPassword = document.getElementById("confirmPassword");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let isValid = true;

        if (name.value.trim().length === 0) {
            showError(name, nameError, "Enter your name.");
            isValid = false;
        } else {
            showError(name, nameError, "");
        }

        if (!isValidEmail(email.value.trim())) {
            showError(email, emailError, "Enter a valid email address.");
            isValid = false;
        } else {
            showError(email, emailError, "");
        }

        if (password.value.length < 8) {
            showError(password, passwordError, "Use at least 8 characters.");
            isValid = false;
        } else {
            showError(password, passwordError, "");
        }

        if (confirmPassword.value !== password.value || confirmPassword.value === "") {
            showError(confirmPassword, confirmPasswordError, "Passwords don't match.");
            isValid = false;
        } else {
            showError(confirmPassword, confirmPasswordError, "");
        }

        if (!isValid) {
            return;
        }

        // Placeholder: no backend to create an account against yet.
        alert("Sign up works! (No backend yet - this is a placeholder.)");

    });

}