function analyzeResume() {
    const role = document.getElementById("jobRole").value;
    const file = document.getElementById("resumeFile").files[0];

    if (!file) {
        alert("Please upload your resume");
        return;
    }

    // Dummy response (Phase 1)
   async function analyzeResume() {
    const role = document.getElementById("jobRole").value;
    const file = document.getElementById("resumeFile").files[0];

    if (!file) {
        alert("Please upload your resume");
        return;
    }

    // Prepare data to send
    const payload = {
        jobRole: role
    };

    try {
        const response = await fetch("/api/analyzeResume", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Backend error");
        }

        const data = await response.json();

        // Display results from backend
        document.getElementById("score").innerText =
            `ATS Score for ${data.role}: ${data.score} / 100`;

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


    document.getElementById("score").innerText =
        `ATS Score for ${role}: ${score} / 100`;

    const tipsList = document.getElementById("tips");
    tipsList.innerHTML = "";

    tips.forEach(tip => {
        const li = document.createElement("li");
        li.innerText = tip;
        tipsList.appendChild(li);
    });

    document.getElementById("result").classList.remove("hidden");
}
