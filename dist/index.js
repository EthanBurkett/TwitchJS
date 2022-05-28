"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const util_1 = require("util");
const tmi_js_1 = __importStar(require("tmi.js"));
const collection_1 = require("@discordjs/collection");
const path_1 = __importDefault(require("path"));
const permissions_1 = require("./utils/permissions");
const PG = (0, util_1.promisify)(glob_1.glob);
const client = new tmi_js_1.Client({
    channels: ["chaoticvisionz"],
});
client.on("message", (channel, userstate, message, self) => { });
class TwitchJS extends tmi_js_1.default.client {
    constructor(opts, disableMessage) {
        if (!disableMessage)
            console.log(`>>> TwitchJS is an extended package of tmi.js.\nYou can disable this message in the constructor arguments`);
        super(opts);
        this._commands = new collection_1.Collection();
        this._options = opts;
        this._prefix = "!";
        /**
         *  0 - Disconnected
         *  1 - Connecting
         *  2 - Connected
         */
        this._connection = 0;
        this.on("connecting", () => (this._connection = 1));
        this.on("connected", () => (this._connection = 2));
        this.on("disconnected", () => (this._connection = 0));
        this.LoadCommands();
    }
    ensureConnection() {
        if (this._connection == 0)
            this.connect();
        const readyState = ["Disconnected", "Connecting", "Connected"];
        return readyState[this._connection];
    }
    get connection() {
        const readyState = ["Disconnected", "Connecting", "Connected"];
        return readyState[this._connection];
    }
    setDefaultPrefix(prefix) {
        this._prefix = prefix;
        return this;
    }
    LoadCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            (yield PG(`${this._options.commandsDir}/**/*.${this._options.typescript ? "ts" : "js"}`)).map((file) => {
                const Command = this._options.typescript
                    ? require(`${path_1.default.join(process.cwd(), file)}`).default
                    : require(`${path_1.default.join(process.cwd(), file)}`);
                if (!Command)
                    throw new Error(`Error loading ${file}`);
                this._commands.set(Command.name, Command);
            });
            this.connect();
            this.MessageEvent();
        });
    }
    MessageEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.on("message", (channel, tags, message, self) => {
                const Channels = this._options.channels;
                if (self)
                    return;
                let args = message.split(" ");
                const Prefix = args[0].substring(0, this._prefix.length);
                if (Prefix != this._prefix)
                    return;
                const CommandSent = args[0].substring(this._prefix.length, args[0].length);
                args = args.slice(1);
                const Command = this._commands.get(CommandSent);
                if (!Command)
                    return;
                const cb = Command.callback({
                    channel,
                    args,
                    instance: this,
                    message,
                    tags,
                });
                if (Command.moderatorOnly) {
                    if (!(0, permissions_1.isMod)(this._options, tags))
                        return this.say(channel, "You do not have permission to use this");
                }
                if (Command.broadcasterOnly) {
                    if (!(0, permissions_1.isBroadcaster)(tags))
                        return this.say(channel, "Only the broadcaster can use this command");
                }
                if (Command.vipOnly) {
                    if (!(0, permissions_1.isVip)(this._options, tags))
                        return this.say(channel, "Only VIPs sure can use this command");
                }
                if (Command.subscriberOnly) {
                    if (!(0, permissions_1.isSubscriber)(this._options, tags))
                        return this.say(channel, "Only subscribers can use this command");
                }
                if (typeof cb == "string")
                    return this.say(channel, cb).catch(console.log);
                else
                    return cb;
            });
        });
    }
}
exports.default = TwitchJS;
