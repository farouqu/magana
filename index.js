import mic from "mic";
import sound from "sound-play";
import { Writer } from "wav";
import { Writable } from "stream";
import fs, { createWriteStream } from "fs";
import { OpenAI } from "openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import voice from "elevenlabs-node";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI();
const keyword = "jarvis";

let micInstance = mic({rate: "16000", channels: "1", debug: false, exitOnSilence: 6})
let micInputStream = micInstance.getAudioStream();