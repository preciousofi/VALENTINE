export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { response, dateChoice } = req.body;

    if (!response) {
      return res.status(400).json({
        error: "Missing response",
      });
    }

    const dateNames = {
      dinner: "Dinner Date",
      movie: "Movie Date",
      beach: "Beach & Picnic",
    };

    let subject = "";
    let message = "";

    if (response === "YES") {
      subject = "Mercy Said YES to Valentine's Day!";

      message = `
        <h2>SHE SAID YES!</h2>
        <p>Mercy said <strong>YES</strong> to going on a Valentine's Day date with you.</p>
        <p>Now go plan that date. ❤️</p>
      `;
    } else if (response === "NO") {
      subject = "Mercy's Valentine's Day Response";

      message = `
        <h2>Valentine's Day Response</h2>
        <p>Mercy selected <strong>NO</strong>.</p>
        <p>She may still change her mind.</p>
      `;
    } else if (response === "YES - DATE CONFIRMED") {
      const selectedDate =
        dateNames[dateChoice] || "Unknown date option";

      subject = "Valentine's Date Confirmed!";

      message = `
        <h2>IT'S A DATE!</h2>
        <p>Mercy said YES to Valentine's Day.</p>
        <p>
          <strong>Her date choice:</strong>
          ${selectedDate}
        </p>
        <p>Time to make it happen. ❤️</p>
      `;
    } else {
      return res.status(400).json({
        error: "Invalid response",
      });
    }

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
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
      }
    );

    const data = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", data);

      return res.status(500).json({
        error: "Email could not be sent",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}