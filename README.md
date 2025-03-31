# Twenty Questions

This is a React app in TypeScript for playing the Twenty Questions game.

Note that you will need an OpenAI API account in order to run this.

## Setting up the OpenAI API Key

You need to set up your OpenAI API key as an environment variable. Here's how to do it:

### Windows (PowerShell)
```powershell
$env:REACT_APP_OPENAI_API_KEY="your-api-key-here"
```

### Windows (Command Prompt)
```cmd
set REACT_APP_OPENAI_API_KEY=your-api-key-here
```

### macOS/Linux
```bash
export REACT_APP_OPENAI_API_KEY=your-api-key-here
```

Replace `your-api-key-here` with your actual OpenAI API key. The environment variable must be set before starting the development server.

## Running the Application

In the main directory, you can run:

- `npm install` (run once)
- `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

## Running the Unit Tests
The application includes unit tests for the AI prompt generation and validation functions. These tests ensure that:

- Question prompts are correctly formatted with all necessary information
- Previously used objects are properly tracked and included
- Response validation works as expected for both first and follow-up questions
- Other misc. tests

To run the tests:

- `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.