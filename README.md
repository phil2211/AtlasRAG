# MongoDB Vector Search RAG Demo
This Demo will showcase a classical RAG (Retrieval Augmented Generation) application approach. The functionallity is as follow:
* You pose a question
* There are documents with calculated vectors using the ADA 002 embedding model from OpenAI
* These documents are queried using a vectorized version of your asked question
* The database answers with the 3 best matching documents providing them as context for a chat completion request
* The initial question + the retreived documents are then sent back to the chat completion API of OpenAI to generate a context augmented response

You can try it out on your own in just a few minutes using the `install.sh` script in the root of this repository. 

![Demo Setup](/assets/demoSetup.gif)

# How to spin up the demo
> Everything works on an Atlas Free Tier. No Credit Card needed, free forever

1. Clone this repo and go to the directory
```
git clone https://github.com/phil2211/vector-search-demo && \
cd vector-search-demo
```
2. Go to https://platform.openai.com/api-keys and create your own API key and paste this key to the `openai.key` file in the root of this project.

![OpenAI API Key](/assets/openAIKey.png)

```
echo "your openai api key" > openai.key
```

3. You need the following prerequisits met to follow along
- [MongoDB Atlas Account](https://cloud.mongodb.com) (Free account available, no credit card needed)
- [Atlas CLI](https://www.mongodb.com/tools/atlas-cli)
- [NodeJS](https://nodejs.org/)
- [Atlas App Services CLI](https://www.mongodb.com/docs/atlas/app-services/cli/)
---
I use Homebrew to do this on MacOS. If you don't have Homebrew, please follow the very simple instructions on the [Hombrew](https://brew.sh/) website to install it. The command below will install all necessary tools at once. If you are using Windows or Linux, see the links above for installation instructions for each component.
```
brew tap mongodb/brew && \
brew install mongodb-atlas-cli node npm
```

4. Install the [Atlas App Services CLI](https://www.mongodb.com/docs/atlas/app-services/cli/)
```
npm install -g atlas-app-services-cli
```
- **Restart your shell to use it**
---

Now execute the `install.sh` script to spin up your own free MongoDB Atlas instance. Please wait until the cluster is deployed and the testdata is loaded. PLEASE DO NOT CTRL+C during that process.

After ~5 minutes your browser should start on http://localhost:5174.

There will be a MongoDB available with one sample document. Now you can start populating the database with more documents. A trigger on the backend will take care of the proper vector calculation and embedding.

![OpenAI API Key](/assets/setupProcess.gif)

Please feel free to contacte me if you have further questions or feedback to this demo.