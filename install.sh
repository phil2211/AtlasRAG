#Check all dependencies
if ! command -v atlas &> /dev/null
then
    echo "atlas could not be found, please install it"
    exit
fi

if ! command -v appservices &> /dev/null
then
    echo "appservices could not be found, please install it"
    exit
fi

if ! command -v npm &> /dev/null
then
    echo "npm could not be found, please install it"
    exit
fi

#Create Atlas Project
atlas auth login -P AtlasRAG && \
atlas config set -P AtlasRAG org_id `atlas organizations -P atlasrag ls | awk 'NR==2 {print $1}'` && \
atlas projects create AtlasRAG -P AtlasRAG && \
atlas config set -P AtlasRAG org_id `atlas organizations -P atlasrag ls | awk 'NR==2 {print $1}'` && \
atlas config set -P AtlasRAG project_id `atlas project ls -P AtlasRAG | grep AtlasRAG | awk '{ print $1 }'` && \
atlas quickstart --skipMongosh --skipSampleData --provider AWS --region EU_CENTRAL_1 --tier M0 --username admin --password Passw0rd --accessListIp "0.0.0.0/0" --clusterName AtlasRAG -P AtlasRAG --force && \
mongosh $(atlas cluster connectionstrings describe AtlasRAG -P AtlasRAG | grep "mongodb+srv")/reports --apiVersion 1 --username admin --password Passw0rd --eval 'db.reports.insertOne({_id: 1});' && \
atlas clusters search indexes create -P AtlasRAG -f "./vectorSearchMapping.json" --clusterName AtlasRAG && \
atlas project apiKeys create --desc appservices --role GROUP_OWNER -P AtlasRAG > AtlasAPIKeys.txt && \
appservices login --api-key $(cat AtlasAPIKeys.txt | grep "Public API Key" | awk '{ print $4 }') --private-api-key $(cat AtlasAPIKeys.txt | grep "Private API Key" | awk '{ print $4 }') -y --profile AtlasRAG && \
appservices apps create -y --profile AtlasRAG -n AtlasRAG --provider-region aws-eu-central-1 -d LOCAL --local DeleteMe && \
mv DeleteMe/.mdb/meta.json backend/.mdb/ && \
appservices secrets create --profile AtlasRAG -a AtlasRAG -n OpenAI_secret -v $(cat openai.key) && \  
appservices push --local "backend" --include-package-json -y --profile AtlasRAG && \
echo "VITE_REALM_APP_ID="$(appservices apps list --profile AtlasRAG | grep -i AtlasRAG | awk '{print $1}') > .env.local && \
mongosh $(atlas cluster connectionstrings describe AtlasRAG -P AtlasRAG | grep "mongodb+srv")/reports --apiVersion 1 --username admin --password Passw0rd --eval 'db.reports.updateOne({_id: 1},{$set: {_id:1,Title:"Hello World",Summary:"",Report:"",Background:"",Consquences:"",Impact:""}});' && \
rm -rf DeleteMe && \
npm install && npm run dev