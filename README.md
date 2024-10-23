# Azure App Settings Fetcher
A Node.js command-line tool to fetch appsettings.json from an Azure App Service and output it as a local file. This package makes it easy to retrieve configuration files for local development by interacting with the Kudu API. This is useful when you are not using a centralized configuration service like Azure App Configuration or Azure Key Vault, etc.

## Features
- Fetch appsettings.json from a deployed Azure App Service.
- Save the configuration file to any folder on your machine.
- Specify a custom output file name (defaults to appsettings.local.json).

## Installation

You can install this package globally from GitHub, allowing you to use it from anywhere on your machine.

### Global Installation

Example:
```bash
npm install -g santrondavenport/azure-config-fetcher
```

Replace your-username with your actual GitHub username if you're installing directly from the GitHub repo.

## Usage
### Basic Usage

To fetch the appsettings.json file from your Azure App Service and save it as appsettings.local.json in the current directory, run:

```bash
fetch-config <appServiceName>
```

- `<appServiceName>`: The name of your Azure App Service (required).

### Custom Target Folder and Output File Name

You can specify a target folder and output file name if you don't want to use the default settings:

```bash
fetch-config <appServiceName> [targetFolder] [outputFileName]
```
- `<appServiceName>`: The name of your Azure App Service (required).
- `[targetFolder]`: The folder where the output file will be saved (optional; defaults to the current directory).
- `[outputFileName]`: The name of the output file (optional; defaults to appsettings.local.json).

### Example Configuration in Program.cs (or Startup.cs for older .NET versions):

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true)  // Local development, should be in .gitignore
    .AddEnvironmentVariables();

var app = builder.Build();
app.Run();

```

### Examples
1. Fetch appsettings.json and save to the current folder with default name:

```bash
fetch-config my-app-service
```

This will fetch appsettings.json from my-app-service and save it as appsettings.local.json in the current directory.

2. Fetch appsettings.json and save to a custom folder:

```bash
fetch-config my-app-service /path/to/target/folder
```

This will save the configuration file as appsettings.local.json in /path/to/target/folder.

3. Fetch appsettings.json and save with a custom file name:

``` bash
fetch-config my-app-service /path/to/target custom-config.json
```

This will save the configuration file as custom-config.json in /path/to/target.

## Prerequisites
- [node.js](https://nodejs.org/): This tool is built with Node.js, so you need to have it installed on your machine.
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli): This tool uses az to authenticate with Azure, so you need to have the Azure CLI installed and be logged into your Azure account.

Run the following to authenticate:
```bash
az login
``` 
## How It Works
1. Fetches an Azure access token using az account get-access-token.
2. Uses the token to call the Kudu API for your Azure App Service.
3. Saves the appsettings.json file locally in the folder and with the name you specify (or defaults if not specified).

## License
This project is licensed under the MIT License. See the LICENSE file for more details.