exports = async function(input){
  const openai_key = context.values.get("openAI_value");
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const data = {
        messages: [
          {
            "role": "system",
            "content": "Du bist ein Berater der Abteilung eForsight."
          },
          {
            "role": "user",
            "content": createPrompt(input)
          }
        ],
        model: "gpt-4-turbo-preview"
      }
      
  // Call OpenAI API to get the completion.
  let response = await context.http.post({
      url,
      headers: {
        'Authorization': [`Bearer ${openai_key}`],
        'Content-Type': ['application/json']
      },
      encodeBodyAsJSON: true,
      body: data
  });
  
  if(response.statusCode === 200) {
      return EJSON.parse(response.body.text());
  } else {
      throw new Error(`Failed to get answer. Response: ${JSON.stringify(response)}`);
  }
}


function createPrompt(dataArray) {
  // Map each item to a formatted string
  const contextStrings = dataArray.map(item => {
    return `URL der Quelle: ${item.Link}\n
Titel: ${item.Title}\n
Zusammenfassung: ${item.Summary}\n
Bericht: ${item.Report}\n
Hintergrund: ${item.Background}\n
Konsequenzen: ${item.Consequences}\n
Einfluss: ${item.Impact}`;
  });

  // Join all strings into one, separated by a newline for readability
  const combinedContext = contextStrings.join("\n\n");

  // Create the final prompt with an introduction to what the AI should do
  const prompt = `
\n\nBeantworte mit dem oben folgenden Kontext die folgende Frage: ${dataArray[0].Question}
\n\n${combinedContext}
\n\nBitte fasse deine Antwort in maximal 5 Sätzen zusammen und verwende für die formatierung des Textes Markdown als Formatierungssprache
\n\nFühre am Ende eine unsortierte Liste aller URLs der Quellen auf welche anklickbar sind.
\n\nDeine Antwort soll immer in deutscher Sprache verfasst sein und dein Zielpublikum sind Entscheidungsträger von Finanzinstituten in der Schweiz
`;
console.log(JSON.stringify(prompt));
  return prompt;
}