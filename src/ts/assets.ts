'use strict';
import Game from "./game";

export default {
    bird: HTMLImageElement = null,
    bg: HTMLImageElement = null,
    fg: HTMLImageElement = null,
    pipe: HTMLImageElement = null,
    pipeRev: HTMLImageElement = null,

    defs: {
        bird: require("../../assets/yellowbird-upflap.png"),
        bg: require("../../assets/background-day.png"),
        fg: require("../../assets/base.png"),
        pipe: require("../../assets/pipe-green.png"),
        pipeRev: require("../../assets/pipe-green-rev.png")
    },

    load() {
        const imagePromises = [];

        const defs = this.defs;
        for (let asset in defs) {
            this[asset] = new Image();
            const field = this[asset];
            imagePromises.push(new Promise(function(resolve, reject) {
                field.onload = resolve;
                field.onerror = reject;
                field.src = defs[asset];
            }));
        }
        
        return Promise.all(imagePromises);
    }
}