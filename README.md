# Voice Assistant with OpenAI, LangChain, and ElevenLabs

This is a simple voice assistant that listens for a keyword, transcribes what it hears, sends the transcription to OpenAI, and plays back the response using the ElevenLabs API. It requires setting up several services and APIs.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have Node.js installed.
- You have an OpenAI account with access to the GPT-3 API.
- You have an ElevenLabs account with API access.
- Create a folder in the directory `audio` to store voice recordings.
- You have a `.env` file set up with the following environment variables:

```plaintext
ELEVENLABS_API_KEY=<YOUR_ELEVENLABS_API_KEY>
ELEVENLABS_VOICE_ID=<YOUR_ELEVENLABS_VOICE_ID>
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/farouqu/magana
cd repository
```

2. Install dependencies:

```bash
npm install
```

## Usage

1. Run the script:

```bash
node index.js
```

2. Once started, the script will continuously listen. To trigger the assistant, say the keyword ("jarvis" in this case). You can modify your keyword. It will record your voice, send it to OpenAI, and play back the generated response.

## Libraries Used

- [mic](https://www.npmjs.com/package/mic): Node.js microphone stream module.
- [sound-play](https://www.npmjs.com/package/sound-play): Audio playback for Node.js.
- [wav](https://www.npmjs.com/package/wav): Read and write WAVE files.
- [stream](https://nodejs.org/api/stream.html): The built-in Node.js stream module.
- [fs](https://nodejs.org/api/fs.html): The built-in Node.js file system module.
- [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file into `process.env`.
- [openai](https://www.npmjs.com/package/openai): Official OpenAI GPT-3 API wrapper.
- [langchain](https://www.npmjs.com/package/langchain): AI Chatbot with pluggable models, supporting OpenAI, GPT-3, etc.
- [elevenlabs-node](https://www.npmjs.com/package/elevenlabs-node): ElevenLabs API wrapper for Node.js.
- [repl](https://nodejs.org/api/repl.html): The built-in Node.js REPL (Read-Eval-Print Loop) module.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.