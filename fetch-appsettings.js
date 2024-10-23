#!/usr/bin/env node

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Step 1: Check if appServiceName is provided as an argument
if (process.argv.length < 3) {
    console.error("Error: Missing required argument 'appServiceName'.");
    console.error("Usage: fetch-config <appServiceName> [targetFolder] [outputFileName]");
    process.exit(1);
}

const appServiceName = process.argv[2]; // Get the appServiceName from the arguments

// Step 2: Get the targetFolder argument or default to the current directory
const targetFolder = process.argv[3] ? path.resolve(process.argv[3]) : process.cwd(); // Use current folder if targetFolder is not specified

// Step 3: Get the outputFileName argument or default to appsettings.local.json
const outputFileName = process.argv[4] || 'appsettings.local.json';
const outputFilePath = path.join(targetFolder, outputFileName);

// Step 4: Get Azure access token
console.log("Fetching Azure access token...");
let token = execSync('az account get-access-token --resource https://management.azure.com/ --query accessToken --output tsv').toString().trim();

if (!token) {
    console.error("Failed to retrieve Azure access token.");
    process.exit(1);
}

// Step 5: Fetch appsettings.json from Kudu API
console.log(`Fetching appsettings.json from ${appServiceName}...`);

let options = {
    hostname: `${appServiceName}.scm.azurewebsites.net`,
    path: '/api/vfs/site/wwwroot/appsettings.json',
    headers: { 'Authorization': `Bearer ${token}` }
};

https.get(options, (res) => {
    if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
            // Write to the specified target folder with the specified file name
            fs.writeFileSync(outputFilePath, data);
            console.log(`Successfully fetched appsettings.json and saved it as ${outputFilePath}.`);
        });
    } else {
        console.error(`Failed to fetch appsettings.json from ${appServiceName}. Status code: ${res.statusCode}`);
    }
}).on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
