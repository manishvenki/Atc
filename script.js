async function analyzeResume() {
    const role = document.getElementById("jobRole").value;
    const file = document.getElementById("resumeFile").files[0];

    if (!role) {
        alert("Please select a job role");
        return;
    }

    if (!file) {
        alert("Please upload your resume");
        return;
    }

    try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobRole", role);

        const response = await fetch("/api/uploadResume", {
            method: "POST",
            body: formData   // ❗ NO headers here
        });

        if (!response.ok) {
            throw new Error("Backend error");
        }

        const data = await response.json();

        // Show score
        document.getElementById("score").innerText =
            `ATS Score: ${data.score} / 100`;

        // Show suggestions
        const tipsList = document.getElementById("tips");
        tipsList.innerHTML = "";

        data.suggestions.forEach(tip => {
            const li = document.createElement("li");
            li.innerText = tip;
            tipsList.appendChild(li);
        });

        document.getElementById("result").classList.remove("hidden");

    } catch (error) {
        console.error(error);
        alert("Resume upload or analysis failed");
    }
}
