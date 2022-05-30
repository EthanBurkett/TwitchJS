# TMI Handler

An extension based off tmi.js that adds a command handler and permission node.

## Usage

`yarn add twitch-handler` or `npm i twitch-handler`

## Initializing the client with tmi.js and the custom integration

```js
const TwitchJS = require("twitch-handler");

new TwitchJS({
  commandsDir: "commands",
  permissions: {
    // Change command permissions
    moderator: {
      // Moderator commands
      broadcaster: true, // Can be used by broadcaster
      vip: false, // Cannot be used by VIPs
    },
    vip: {
      // Vip Commands
      mod: true, // Can be used by mods
      broadcaster: true, // Can be used by broadcaster
    },
    subscriber: {
      broadcaster: true, // Can be used by broadcaster
      mod: true, // Can be used by moderators
      vip: true, // Can be used by VIPs
    },
  },
  // tmi.js settings
  channels: ["channels"],
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: "bot-username",
    password: "bot-oauth-token",
  },
});
```

## With TypeScript

```js
import TwitchJS from "twitch-handler";

new TwitchJS({
  commandsDir: "commands",
  typescript: true,
  permissions: {
    // Change command permissions
    moderator: {
      // Moderator commands
      broadcaster: true, // Can be used by broadcaster
      vip: false, // Cannot be used by VIPs
    },
    vip: {
      // Vip Commands
      mod: true, // Can be used by mods
      broadcaster: true, // Can be used by broadcaster
    },
    subscriber: {
      broadcaster: true, // Can be used by broadcaster
      mod: true, // Can be used by moderators
      vip: true, // Can be used by VIPs
    },
  },
  // tmi.js settings
  channels: ["channels"],
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: "bot-username",
    password: "bot-oauth-token",
  },
});
```

## Creating Commands

### Options with a question mark are NOT required in the object

`commands/ping.js`

```js
module.exports = {
  name: "ping",
  broadcasterOnly?: false,
  moderatorOnly?: false,
  vipOnly?: false,
  subscriberOnly?: false,
  callback({ message, args, channel, tags, instance }) {
    return "Pong!"; // This will send "Pong!" as a message in the channel, you can use different methods of replying with the "instance" variable
  },
};
```

## With Typescript

`commands/ping.ts`

```js
import { ICommand } from "twitch-handler";

export default {
  name: "ping",
  broadcasterOnly?: false,
  moderatorOnly?: false,
  vipOnly?: false,
  subscriberOnly?: false,
  callback({ message, args, channel, tags, instance }) {
    return "Pong!"; // This will send "Pong!" as a message in the channel, you can use different methods of replying with the "instance" variable
  },
} as ICommand;
```

# That's it! Your twitch bot is now ready.

## Assuming you setup your authentication correctly with tmi.js, if you need help, refer to tmi.js docs on generating an OAuth token.
