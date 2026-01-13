async function analyzeResume() {
    const role = document.getElementById("jobRole").value;
    const file = document.getElementById("resumeFile").files[0];

    if (!file) {
        alert("Please upload your resume");
        return;
    }

    try {
        const response = await fetch("/api/analyzeResume", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ jobRole: role })
        });

        if (!response.ok) {
            throw new Error("Backend error");
        }

        const data = await response.json();

        // Show score
        document.getElementById("score").innerText =
            `ATS Score for ${data.role}: ${data.score} / 100`;

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
        alert("Error analyzing resume. Please try again.");
        console.error(error);
    }
}
