exports = async function(question){
  const isEmpty = require("lodash/isEmpty");
  const agg = [];
  
  if (!isEmpty(question)) {
    const embedding = await context.functions.execute("getEmbedding", question);  

    agg.push({"$vectorSearch": {
          "queryVector": embedding,
          "path": "embedding",
          "numCandidates": 100,
          "limit": 3,
          "index": "default"
        }})
  }
  

  var dbName = "reports";
  var collName = "reports";

  var collection = context.services.get("mongodb-atlas").db(dbName).collection(collName);

  agg.push({
          "$project": {
            "Title": 1,
            "Summary": 1,
            "Report": 1,
            "Background": 1,
            "Consequences": 1,
            "Impact": 1,
            "Question": question,
            "Link": 1,
            "Score": { $meta: "vectorSearchScore" }
        }}
  );
  
  try {
    const documents = await collection.aggregate(agg).toArray();
    return context.functions.execute("getResponse" ,documents);
  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);
    return { error: err.message };
  }
};