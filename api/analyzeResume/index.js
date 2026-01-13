module.exports = async function (context, req) {

    const role = req.body?.jobRole || "Software Developer";

    const response = {
        role: role,
        score: 75,
        matchedSkills: ["JavaScript", "Git", "HTML"],
        suggestions: [
            "Add more role-specific projects",
            "Include cloud or DevOps tools",
            "Optimize keywords for ATS"
        ]
    };

    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: response
    };
};
