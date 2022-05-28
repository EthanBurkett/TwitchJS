"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubscriber = exports.isVip = exports.isBroadcaster = exports.isMod = void 0;
const isMod = (opts, tags) => {
    var _a, _b, _c;
    if ((_b = (_a = opts.permissions) === null || _a === void 0 ? void 0 : _a.moderator) === null || _b === void 0 ? void 0 : _b.broadcaster) {
        if (((_c = tags.badges) === null || _c === void 0 ? void 0 : _c.broadcaster) == "1")
            return true;
        else
            return false;
    }
    if (tags.mod)
        return true;
    return false;
};
exports.isMod = isMod;
const isBroadcaster = (tags) => {
    var _a;
    return ((_a = tags.badges) === null || _a === void 0 ? void 0 : _a.broadcaster) == "1";
};
exports.isBroadcaster = isBroadcaster;
const isVip = ({ permissions }, tags) => {
    var _a, _b, _c, _d;
    if ((_a = permissions === null || permissions === void 0 ? void 0 : permissions.vip) === null || _a === void 0 ? void 0 : _a.broadcaster)
        return ((_b = tags.badges) === null || _b === void 0 ? void 0 : _b.broadcaster) == "1";
    if ((_c = permissions === null || permissions === void 0 ? void 0 : permissions.vip) === null || _c === void 0 ? void 0 : _c.mod)
        return tags.mod;
    return ((_d = tags.badges) === null || _d === void 0 ? void 0 : _d.vip) == "1";
};
exports.isVip = isVip;
const isSubscriber = ({ permissions }, tags) => {
    var _a, _b, _c, _d, _e;
    if ((_a = permissions === null || permissions === void 0 ? void 0 : permissions.subscriber) === null || _a === void 0 ? void 0 : _a.broadcaster)
        return ((_b = tags.badges) === null || _b === void 0 ? void 0 : _b.broadcaster) == "1";
    if ((_c = permissions === null || permissions === void 0 ? void 0 : permissions.subscriber) === null || _c === void 0 ? void 0 : _c.mod)
        return tags.mod;
    if ((_d = permissions === null || permissions === void 0 ? void 0 : permissions.subscriber) === null || _d === void 0 ? void 0 : _d.vip)
        return ((_e = tags.badges) === null || _e === void 0 ? void 0 : _e.vip) == "1";
    return tags.subscriber;
};
exports.isSubscriber = isSubscriber;
