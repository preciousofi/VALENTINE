import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { answer, dateChoice } = req.body || {};

    const validAnswers = ["yes", "no", "date"];

    if (!validAnswers.includes(answer)) {
      return res.status(400).json({
        success: false,
        message: "Invalid answer",
      });
    }

    let subject = "";
    let title = "";
    let message = "";
    let chosenDate = "";

    if (answer === "yes") {
      subject = "❤️ MY HER — SHE SAID YES!";
      title = "SHE SAID YES!!! ❤️";
      message =
        "Mercy chose YES. She wants to go on a Valentine's Day date with you.";
    }

    if (answer === "no") {
      subject = "💔 MY HER — SHE SAID NO";
      title = "She said no. 💔";
      message =
        "Mercy chose NO. She doesn't want to go on a Valentine's Day date.";
    }

    if (answer === "date") {
      const dates = {
        dinner: "🍽️ Dinner Date",
        movie: "🎬 Movie Date",
        beach: "🏖️ Beach & Picnic",
      };

      if (!dates[dateChoice]) {
        return res.status(400).json({
          success: false,
          message: "Invalid date choice",
        });
      }

      chosenDate = dates[dateChoice];

      subject = "💌 MY HER — VALENTINE'S DATE CONFIRMED!";
      title = "IT'S A DATE!!! ❤️";
      message =
        "Mercy said YES to Valentine's Day and chose the following date:";
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>MY HER ❤️</title>
          </head>
          <body
            style="
              margin: 0;
              padding: 40px 20px;
              background: #080609;
              font-family: Arial, sans-serif;
              color: #ffffff;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 30px;
                background: #151016;
                border-radius: 20px;
                text-align: center;
              "
            >
              <p
                style="
                  font-size: 12px;
                  letter-spacing: 4px;
                  color: #9d929a;
                  text-transform: uppercase;
                "
              >
                MY HER ❤️
              </p>
              <h1
                style="
                  font-size: 34px;
                  margin: 25px 0;
                  color: #ffffff;
                "
              >
                ${title}
              </h1>
              <p
                style="
                  font-size: 17px;
                  line-height: 1.8;
                  color: #d8d0d5;
                "
              >
                ${message}
              </p>
              ${
                answer === "date"
                  ? `
                    <div
                      style="
                        margin: 30px 0;
                        padding: 20px;
                        background: #211822;
                        border-radius: 15px;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 10px;
                          font-size: 12px;
                          letter-spacing: 2px;
                          color: #9d929a;
                          text-transform: uppercase;
                        "
                      >
                        HER CHOICE
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-size: 22px;
                          font-weight: bold;
                          color: #ffffff;
                        "
                      >
                        ${chosenDate}
                      </p>
                    </div>
                  `
                  : ""
              }
              <p
                style="
                  margin-top: 35px;
                  font-size: 12px;
                  color: #777078;
                "
              >
                Response received from the MY HER Valentine's Day website.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Email could not be sent.",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Response sent successfully.",
      id: data.id,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
}