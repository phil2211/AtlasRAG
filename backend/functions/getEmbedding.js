exports = async function(query){
    const openai_key = context.values.get("openAI_value");
    const url = 'https://api.openai.com/v1/embeddings';

    // Call OpenAI API to get the embeddings.
    let response = await context.http.post({
        url,
        headers: {
          'Authorization': [`Bearer ${openai_key}`],
          'Content-Type': ['application/json']
        },
        body: JSON.stringify({
          input: query,
          model: "text-embedding-ada-002"
        })
    });
    
    if(response.statusCode === 200) {
        return JSON.parse(response.body.text()).data[0].embedding;
    } else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
}