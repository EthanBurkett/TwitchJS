import { Client, Options, Userstate } from "tmi.js";

export default class TwitchJS extends Client {
  constructor(opts: IOptions, disableMessage?: boolean);
  public setDefaultPrefix(prefix: string): TwitchJS;
}

export interface IOptions extends Options {
  commandsDir: string;
  permissions?: {
    moderator?: {
      // Roles that can use moderator commands
      broadcaster?: boolean = true;
      vip?: boolean = true;
    };
    vip?: {
      // Roles that can use vip commands
      broadcaster?: boolean = true;
      mod?: boolean = true;
    };
    subscriber?: {
      broadcaster?: boolean = true;
      mod?: boolean = true;
      vip?: boolean = true;
    };
  };
  typescript?: boolean;
}

interface ICommandOptions<T> {
  channel: T;
  tags: Userstate;
  message: string;
  args: string[];
  instance: TwitchJS;
}

export interface ICommand {
  name: string;
  moderatorOnly?: boolean;
  vipOnly?: boolean;
  subscriberOnly?: boolean;
  broadcasterOnly?: boolean;
  callback<T>(opts: {
    channel: T;
    tags: Userstate;
    message: string;
    args: string[];
    instance: TwitchJS;
  }): string | null | void;
}
