export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { response, dateChoice } = req.body;

    console.log("Received:", { response, dateChoice });

    if (!response) {
      return res.status(400).json({
        error: "Missing response",
      });
    }

    let subject = "";
    let message = "";

    if (response === "YES") {
      subject = "Mercy Said YES to Valentine's Day!";
      message = `
        <h2>❤️ SHE SAID YES!</h2>
        <p>Mercy said YES to going on a Valentine's Day date with you.</p>
      `;
    } else if (response === "NO") {
      subject = "Mercy's Valentine's Day Response";
      message = `
        <h2>💔 Valentine's Day Response</h2>
        <p>Mercy selected NO.</p>
      `;
    } else if (response === "YES - DATE CONFIRMED") {
      const dates = {
        dinner: "Dinner Date",
        movie: "Movie Date",
        beach: "Beach & Picnic",
      };

      subject = "Valentine's Date Confirmed!";
      message = `
        <h2>💌 IT'S A DATE!</h2>
        <p>Mercy chose: <strong>${dates[dateChoice] || "Unknown date"}</strong></p>
      `;
    } else {
      return res.status(400).json({
        error: "Invalid response",
      });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [process.env.EMAIL_TO],
        subject,
        html: message,
      }),
    });

    const data = await resendResponse.json();

    console.log("Resend status:", resendResponse.status);
    console.log("Resend response:", data);

    if (!resendResponse.ok) {
      return res.status(500).json({
        error: "Resend rejected the email",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      resendId: data.id,
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}