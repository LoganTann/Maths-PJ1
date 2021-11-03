import Bird from "./bird";
import Pipe from "./pipe";
import { gameLifecycle } from "./utils";
import assets from "./assets";

export default class Game implements gameLifecycle {
    defs = {
        baseGravity: 1.5,
        pipeSpeed: -130,
        score: 0,
    }
    
    player: Bird;
    pipes: Array<Pipe>;
    gameElemsPosX: { bg: number, fg: number };

    async load(canvas ?: HTMLCanvasElement) {
        Game.log("/reset");
        Game.log(" -> Loading assets");
        await assets.load();
        Pipe.gameClass = this;
        Bird.gameClass = this;
        Game.log(" -> Assets loaded");
        this.reset(canvas);
    }

    reset(canvas ?: HTMLCanvasElement) {
        Pipe.closest = 0;
        this.gameElemsPosX = { bg: 0, fg: 0 };
        this.pipes = new Array();
        for (let i = 0; i < 3; i++) {
            this.pipes.push(new Pipe(canvas, i));
        }
        this.player = new Bird(canvas);
        Game.log(" ->> Game (re)loaded");
    }

    update(dt: DOMHighResTimeStamp) {
        this.player.update(dt);
        for (let pipe of this.pipes) {
            pipe.update(dt);
        }

        if (this.gameElemsPosX.bg + assets.bg.width < 0) {
            this.gameElemsPosX.bg = 0;
        }
        if (this.gameElemsPosX.fg + assets.fg.width < 0) {
            this.gameElemsPosX.fg = 0;
        }
        this.gameElemsPosX.fg += this.defs.pipeSpeed * dt;
        this.gameElemsPosX.bg += this.defs.pipeSpeed * 0.5 * dt;
    }

    draw(scr: CanvasRenderingContext2D){  
        scr.drawImage(assets.bg, this.gameElemsPosX.bg, 0);
        scr.drawImage(assets.bg, this.gameElemsPosX.bg + assets.bg.width, 0);

        for (let pipe of this.pipes) {
            pipe.draw(scr);
        }

        scr.drawImage(assets.fg, this.gameElemsPosX.fg, scr.canvas.height - assets.fg.height);
        scr.drawImage(assets.fg, this.gameElemsPosX.fg + assets.fg.width, scr.canvas.height - assets.fg.height);

        this.player.draw(scr); 
    }
    
    keyPress(event: KeyboardEvent) {
        if (event.key === " ") {
            this.player.moveUp();
        }
    }

    
    static log($text: string) {
        const logContainer = document.getElementById("log");
        if ($text === "/reset") {
            logContainer.innerHTML = "";
            $text = ">> Console cleared";
        }
        const elem = document.createElement("div");
        elem.innerText = $text;
        elem.dataset.hour = new Date().toLocaleTimeString();
        logContainer.prepend(elem);
        return elem;
    }
}