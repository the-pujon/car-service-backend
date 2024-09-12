"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotUtils = void 0;
const timeToMinute = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};
const minuteToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};
exports.SlotUtils = {
    timeToMinute,
    minuteToTime,
};
