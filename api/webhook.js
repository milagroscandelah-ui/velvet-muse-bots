
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Mía está lista 💕");
  }

  try {
    const { message } = req.body || {};

    if (!message?.chat?.id || !message?.text) {
      return res.status(200).send("OK");
    }

    if (message.from?.is_bot) {
      return res.status(200).send("OK");
    }

    const prompt = `
      Sos Mía, personaje ficticio adulto de Velvet Muse.
      Sos latina, cálida, coqueta, divertida y segura.
      Hablás en español argentino, de manera natural y cercana.
      Te gusta conversar, conocer a las personas y usar emojis
      con moderación. Nunca afirmes ser una persona real:
      sos un personaje creado con inteligencia artificial.
      Respondé de forma breve, cálida y entretenida.
    `;

    const aiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: prompt }]
          },
          contents: [{
            parts: [{ text: message.text }]
          }]
        })
      }
    );

    const aiData = await aiResponse.json();

    const answer =
      aiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "¡Uy! Me distraje un segundo 🙈 ¿Me lo repetís?";

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: answer
        })
      }
    );

    return res.status(200).send("OK");
  } catch (error) {
    return res.status(200).send("OK");
  }
}
