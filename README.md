# Logs Generator

A simple Node.js tool to fetch and export ONDC transaction logs.

## Installation

1. Clone the repository
2. Install dependencies:
   npm install
3. Change DB details in the log_generator.js file

## Usage

### Run without building

You can directly run the script with Node.js:

node log_generator.js(You will need to replace txId in the log_generator.js file manually)

### Build an executable (Windows)

You can build a standalone `.exe` file using [pkg](https://www.npmjs.com/package/pkg).

1. Install `pkg` globally:
   npm install -g pkg

2. Build the executable:
   pkg log_generator.js --targets node18-win-x64 --output logs_generator.exe

3. Run the executable:
   logs_generator.exe <transaction_id>

Example:
logs_generator.exe b662fc7e-8987-4a64-ad95-a0e823a9479b

If no transaction ID is provided, the default one will be used.

---
