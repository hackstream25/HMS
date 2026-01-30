app.post("/api/submit", async (req, res) => {
  const {
    teamid,
    title,
    description,
    problem_statement,
    tech_stack,
    github_link,
    demo_link,
    video_link
  } = req.body;

  console.log("Incoming submission:", req.body);

  if (!teamid) {
    return res.status(400).json({ message: "Team ID missing" });
  }

  try {
    const sql = `
      INSERT INTO submissions
      (teamid, title, description, problem_statement, tech_stack,
       github_link, demo_link, video_link, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'submitted')
    `;

    await db.query(sql, [
      teamid,
      title,
      description,
      problem_statement,
      tech_stack,
      github_link,
      demo_link,
      video_link
    ]);

    // OPTIONAL: update dashboard status
    await db.query(
      "UPDATE teams SET submission_status='submitted' WHERE teamid=?",
      [teamid]
    );

    res.json({ message: "Submission successful" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: "Database error" });
  }
});
