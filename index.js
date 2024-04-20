import mic from "mic";
import sound from "sound-play";
import { Writer } from "wav";
import { Writable } from "stream";
import fs, { createWriteStream } from "fs";
import { OpenAI } from "openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import ElevenLabs from "elevenlabs-node";
import dotenv from "dotenv";
import { start } from "repl";
dotenv.config();

const openai = new OpenAI();
const keyword = "jarvis";

const voice = new ElevenLabs({
    apiKey: process.env.ELEVENLABS_API_KEY, // Your API key from Elevenlabs
    voiceId: process.env.ELEVENLABS_VOICE_ID,             // A Voice ID from Elevenlabs
})

let micInstance = mic({ rate: "16000", channels: "1", debug: false, exitOnSilence: 6 })
let micInputStream = micInstance.getAudioStream();
let isRecording = false;
let audioChunks = [];

const startRecordingProcess = () => {
    console.log("starting recording process");
    micInstance.stop();
    micInputStream.unpipe();
    micInstance = mic({ rate: "16000", channels: "1", debug: false, exitOnSilence: 10 })
    micInputStream = micInstance.getAudioStream();
    audioChunks = [];
    isRecording = true;
    micInputStream.pipe(new Writable({
        write(chunk, _, callback) {
            if (!isRecording) return callback();
            audioChunks.push(chunk);
            callback();
        }
    }))
    micInputStream.on('silence', handleSilence);
    micInstance.start();
}

const handleSilence = async () => {
    console.log("Detected silence");
    if (!isRecording) return;
    isRecording = false;
    micInstance.stop();

    const audioFileName = await saveAudio(audioChunks);
    const message = await transcribeAudio(audioFileName);

    if (message && message.toLowerCase().includes(keyword)) {
        console.log("Keyword detected");
        const responseText = await getOpenAIResponse(message);
        const fileName = await convertResponseToAudio(responseText);
        console.log("Playing auido");
        await sound.play('./audio/' + fileName);
        console.log("Playback finished")
    }

    startRecordingProcess();
}

const saveAudio = async (audioChunks) => {
    return new Promise((resolve, reject) => {
        console.log("Saving audio");
        const audioBuffer = Buffer.concat(audioChunks);
        const wavWriter = new Writer({ sampleRate: 16000, channels: 1 });
        const filename = `${Date.now()}.wav`
        const filePath = './audio/' + filename;

        wavWriter.pipe(createWriteStream(filePath));
        wavWriter.on("finish", () => {
            resolve(filename);
        })

        wavWriter.on("error", (err) => {
            reject(err)
        });

        wavWriter.end(audioBuffer);
    })
}

const transcribeAudio = async (audioFileName) => {
    console.log("Transcribing audio...");
    const audioFile = fs.createReadStream('./audio/' + audioFileName);
    const transcriptionResponse = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
    });

    return transcriptionResponse.text;
}

const getOpenAIResponse = async (message) => {
    console.log("Communicating with OpenAI...");
    const chat = new ChatOpenAI();
    const response = await chat.invoke([
        new SystemMessage("You are a helpful AI Assistant"),
        new HumanMessage(message),
    ]);

    return response.content.toString();
}

const convertResponseToAudio = async (text) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceID = process.env.ELEVENLABS_VOICE_ID;

    const filename = `${Date.now()}.mp3`
    console.log("Converting reponses to audio");

    const audioStream = await voice.textToSpeechStream({
        textInput: text,
    });
    const fileWriteStream = fs.createWriteStream("./audio/" + filename);
    audioStream.pipe(fileWriteStream);

    return new Promise((resolve, reject) => {
        fileWriteStream.on("finish", () => {
            console.log("Audio conversion done");
            resolve(filename);
        });

        audioStream.on("error", reject);
    });
}


startRecordingProcess();
process.stdin.resume();