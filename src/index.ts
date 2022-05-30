import { glob } from "glob";
import { promisify } from "util";
import tmi, { Client, Options, Userstate } from "tmi.js";
import { Collection } from "@discordjs/collection";
import { IOptions, ICommand } from "../index";
import path from "path";
import { isBroadcaster, isMod, isSubscriber, isVip } from "./utils/permissions";
const PG = promisify(glob);

const client = new Client({
  channels: ["chaoticvisionz"],
});

client.on("message", (channel, userstate, message, self) => {});

export default class TwitchJS extends tmi.client {
  private _commands: Collection<string, ICommand> = new Collection();
  private _options: IOptions;
  private _prefix: string;
  private _connection: number;

  constructor(opts: IOptions, disableMessage?: boolean) {
    if (!disableMessage)
      console.log(
        `>>> TwitchJS is an extended package of tmi.js.\nYou can disable this message in the constructor arguments`
      );
    super(opts);
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

  public ensureConnection() {
    if (this._connection == 0) this.connect();
    const readyState = ["Disconnected", "Connecting", "Connected"];
    return readyState[this._connection];
  }

  public get connection() {
    const readyState = ["Disconnected", "Connecting", "Connected"];
    return readyState[this._connection];
  }

  public setDefaultPrefix(prefix: string) {
    this._prefix = prefix;
    return this;
  }

  public get prefix() {
    return this._prefix;
  }

  private async LoadCommands() {
    (
      await PG(
        `${this._options.commandsDir}/**/*.${
          this._options.typescript ? "ts" : "js"
        }`
      )
    ).map((file) => {
      const Command: ICommand = this._options.typescript
        ? require(`${path.join(process.cwd(), file)}`).default
        : require(`${path.join(process.cwd(), file)}`);
      if (!Command) throw new Error(`Error loading ${file}`);
      this._commands.set(Command.name, Command);
    });
    this.connect();
    this.MessageEvent();
  }

  private async MessageEvent() {
    this.on("message", (channel, tags, message, self) => {
      const Channels = this._options.channels!;
      type Channels = typeof Channels[number];
      if (self) return;
      let args = message.split(" ");
      const Prefix = args[0].substring(0, this._prefix.length);
      if (Prefix != this._prefix) return;
      const CommandSent = args[0].substring(
        this._prefix.length,
        args[0].length
      );
      args = args.slice(1);

      const Command = this._commands.get(CommandSent);
      if (!Command) return;
      const cb = Command.callback<Channels>({
        channel,
        args,
        instance: this,
        message,
        tags,
      });

      if (Command.moderatorOnly) {
        if (!isMod(this._options, tags))
          return this.say(channel, "You do not have permission to use this");
      }
      if (Command.broadcasterOnly) {
        if (!isBroadcaster(tags))
          return this.say(channel, "Only the broadcaster can use this command");
      }
      if (Command.vipOnly) {
        if (!isVip(this._options, tags))
          return this.say(channel, "Only VIPs sure can use this command");
      }
      if (Command.subscriberOnly) {
        if (!isSubscriber(this._options, tags))
          return this.say(channel, "Only subscribers can use this command");
      }

      if (typeof cb == "string")
        return this.say(channel, cb).catch(console.log);
      else return cb;
    });
  }
}
