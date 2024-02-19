exports = async function(changeEvent) {
    const cheerio = require('cheerio');
  
    // Function to strip HTML using Cheerio
    function stripHtml(html) {
        return cheerio.load(html).text();
    }

    // Function to recursively strip HTML from all string fields in an object
    function cleanHtmlInDocument(doc) {
        for (const key in doc) {
            if (typeof doc[key] === 'string') { // Strip HTML if the field is a string
                doc[key] = stripHtml(doc[key]);
            } else if (typeof doc[key] === 'object' && doc[key] !== null) { // Recurse if the field is an object or an array
                doc[key] = cleanHtmlInDocument(doc[key]);
            }
        }
        return doc;
    }
    
    async function embedVector(doc) {
      // Define the OpenAI API url and key.
      const url = 'https://api.openai.com/v1/embeddings';
      // Use the name you gave the value of your API key in the "Values" utility inside of App Services
      const openai_key = context.values.get("openAI_value");
      try {
          console.log(`Processing document with id: ${doc._id}`);
          // Call OpenAI API to get the embeddings.
          let response = await context.http.post({
              url: url,
               headers: {
                  'Authorization': [`Bearer ${openai_key}`],
                  'Content-Type': ['application/json']
              },
              body: JSON.stringify({
                  input: `Title: ${doc.Title}\n\nContent: ${doc.Report}\n\nBackground: ${doc.Background}\n\nConsequences: ${doc.Consequences}\n\nImpact: ${doc.Impact}`,
                  model: "text-embedding-ada-002"
              })
          });
            // Parse the JSON response
          let responseData = EJSON.parse(response.body.text());
            // Check the response status.
          if(response.statusCode === 200) {
              console.log("Successfully received embedding.");
              doc.embedding = responseData.data[0].embedding;
              console.log("Successfully embedded the vectors.");
          } else {
              console.log(`Failed to receive embedding. Status code: ${JSON.stringify(response)}`);
          }
        } catch(err) {
          console.error(err);
      }
      return doc;
    }

    const fullDocument = changeEvent.fullDocument;
    const cleanedDocument = cleanHtmlInDocument(fullDocument);
    const embeddedVector = await embedVector(cleanedDocument);
    
    // MongoDB Atlas connection and document update
    const collection = context.services.get("mongodb-atlas").db("reports").collection("reports");
    await collection.updateOne({ _id: fullDocument._id }, { $set: embeddedVector });

    console.log(`Successfully updated document with _id: ${fullDocument._id}`);
};
