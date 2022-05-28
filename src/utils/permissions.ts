import { Userstate } from "tmi.js";
import { IOptions } from "../../index";

export const isMod = (opts: IOptions, tags: Userstate) => {
  if (opts.permissions?.moderator?.broadcaster) {
    if (tags.badges?.broadcaster == "1") return true;
    else return false;
  }
  if (tags.mod) return true;
  return false;
};

export const isBroadcaster = (tags: Userstate) => {
  return tags.badges?.broadcaster == "1";
};

export const isVip = ({ permissions }: IOptions, tags: Userstate) => {
  if (permissions?.vip?.broadcaster) return tags.badges?.broadcaster == "1";
  if (permissions?.vip?.mod) return tags.mod;
  return tags.badges?.vip == "1";
};

export const isSubscriber = ({ permissions }: IOptions, tags: Userstate) => {
  if (permissions?.subscriber?.broadcaster)
    return tags.badges?.broadcaster == "1";
  if (permissions?.subscriber?.mod) return tags.mod;
  if (permissions?.subscriber?.vip) return tags.badges?.vip == "1";
  return tags.subscriber;
};
