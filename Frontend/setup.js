const uploadZone =
    document.getElementById("uploadZone");

const resumeInput =
    document.getElementById("resumeInput");

const uploadTitle =
    document.getElementById("uploadTitle");

const uploadHint =
    document.getElementById("uploadHint");

const countPills =
    document.querySelectorAll("#countGroup .pill");

const summaryEl =
    document.getElementById("setupSummary");

const startBtn =
    document.getElementById("startBtn");

const loginBtn =
    document.getElementById("loginBtn");


const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB


const selection = {
    resumeFile: null,
    count: 10 // default question count
};


// pre-select the default question count pill
document
    .querySelector('#countGroup .pill[data-count="10"]')
    .classList.add("selected");


function formatFileSize(bytes) {

    const kb = bytes / 1024;

    if (kb < 1024) {
        return kb.toFixed(0) + " KB";
    }

    return (kb / 1024).toFixed(1) + " MB";

}


function handleFile(file) {

    if (!file) {
        return;
    }

    const isAllowedType =
        /\.(pdf|doc|docx)$/i.test(file.name);

    if (!isAllowedType) {

        alert("Please upload a PDF or Word document.");

        return;

    }

    if (file.size > MAX_FILE_SIZE_BYTES) {

        alert("File is too large. Max size is 5MB.");

        return;

    }

    selection.resumeFile = file;

    uploadZone.classList.add("has-file");

    uploadTitle.textContent = file.name;

    uploadHint.textContent =
        formatFileSize(file.size) + " \u00b7 click to change";

    updateSummary();

}


// click-to-browse (the hidden input opens via the <label for="...">)

resumeInput.addEventListener("change", function () {

    handleFile(resumeInput.files[0]);

});


// drag and drop

uploadZone.addEventListener("dragover", function (event) {

    event.preventDefault();

    uploadZone.classList.add("drag-over");

});


uploadZone.addEventListener("dragleave", function () {

    uploadZone.classList.remove("drag-over");

});


uploadZone.addEventListener("drop", function (event) {

    event.preventDefault();

    uploadZone.classList.remove("drag-over");

    handleFile(event.dataTransfer.files[0]);

});


// question count pills

countPills.forEach(function (pill) {

    pill.addEventListener("click", function () {

        countPills.forEach(function (node) {
            node.classList.remove("selected");
        });

        pill.classList.add("selected");

        selection.count = Number(pill.dataset.count);

        updateSummary();

    });

});


function updateSummary() {

    const ready = Boolean(selection.resumeFile);

    startBtn.disabled = !ready;

    if (!ready) {

        summaryEl.textContent =
            "Upload your resume to continue.";

        return;

    }

    summaryEl.textContent =
        selection.resumeFile.name +
        " \u00b7 " +
        selection.count +
        " questions";

}


startBtn.addEventListener("click", function () {

    if (startBtn.disabled) {
        return;
    }

    // Frontend-only for now: the actual resume file would be
    // sent to the backend so the AI can read it. We can't
    // persist a File object across pages without a backend,
    // so we stash just the metadata the next screen needs.
    sessionStorage.setItem(
        "interviewSetup",
        JSON.stringify({
            resumeName: selection.resumeFile.name,
            count: selection.count
        })
    );

    window.location.href = "interview.html";

});


loginBtn.addEventListener("click", function () {

    window.location.href = "login.html";

});