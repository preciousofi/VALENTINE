```js
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

    const responseDetails = {
      yes: {
        subject: "❤️ MY HER — SHE SAID YES!",
        title: "SHE SAID YES!!! ❤️",
        message:
          "Mercy chose YES. She wants to go on a Valentine's Day date with you. ❤️",
      },

      no: {
        subject: "💔 MY HER — SHE SAID NO",
        title: "She said no. 💔",
        message:
          "Mercy chose NO. She doesn't want to go on a Valentine's Day date.",
      },

      date: {
        subject: "💌 MY HER — VALENTINE'S DATE CONFIRMED!",
        title: "IT'S A DATE!!! ❤️",
        message: "Mercy chose a Valentine's Day date.",
      },
    };

    const selected = responseDetails[answer];

    let dateName = "";

    if (answer === "date") {
      const dates = {
        dinner: "🍽️ Dinner Date",
        movie: "🎬 Movie Date",
        beach: "🏖️ Beach & Picnic",
      };

      dateName = dates[dateChoice];

      if (!dateName) {
        return res.status(400).json({
          success: false,
          message: "Invalid date choice",
        });
      }
    }

    const emailResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "User-Agent": "my-her-valentine/1.0",
        },

        body: JSON.stringify({
          from: process.env.EMAIL_FROM,
          to: [process.env.EMAIL_TO],
          subject: selected.subject,

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
                    ${selected.title}
                  </h1>

                  <p
                    style="
                      font-size: 17px;
                      line-height: 1.8;
                      color: #d8d0d5;
                    "
                  >
                    ${selected.message}
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
                            ${dateName}
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
        }),
      }
    );

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend error:", data);

      return res.status(500).json({
        success: false,
        message: "Email could not be sent.",
        error: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Response sent successfully.",
      id: data.id,
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
```
