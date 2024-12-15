const axios = require('axios');

const fs = require('fs');

const path = require('path');


function saveJsonToFile(mergedJSON, outputFolderPath) {
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
    }
    for (const [fileName, fileContent] of Object.entries(mergedJSON)) {
        const outputPath = path.join(outputFolderPath, fileName);
        fs.writeFileSync(outputPath, JSON.stringify(fileContent, null, 2));
        console.log(`Saved ${fileName} to ${outputPath}`);
    }
}

async function MakeSession(sessionId, folderPath) {

    try {
        const decryptedSessionId = sessionId.split("~")[1].split('').reverse().join('');
        
        const response = await axios.get(`https://pastebin.com/raw/${decryptedSessionId}`);

        await saveJsonToFile(response.data, folderPath)
        console.log("session loaded successfully");

    } catch (error) {

        console.error("An error occurred:", error.message);

    }

}



module.exports = { MakeSession };