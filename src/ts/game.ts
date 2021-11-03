import Bird from "./bird";
import Pipe from "./pipe";
import { gameLifecycle } from "./utils";
import assets from "./assets";

export default class Game implements gameLifecycle {
    defs = {
        baseGravity: 1.5,
        pipeSpeed: -130,
    }
    
    players: Array<Bird>;
    pipes: Array<Pipe>;
    gameElemsPosX: { bg: number, fg: number };
    static score: number;
    static generation: number = 0;

    private canvas: HTMLCanvasElement;

    async load(canvas ?: HTMLCanvasElement) {
        Game.log("/reset");
        Game.log(" -> Loading assets");
        await assets.load();
        Game.log(" -> Assets loaded");
        Pipe.gameClass = this;
        Bird.gameClass = this;
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        Game.generation++;
        Pipe.closest = 0;
        Game.score = 0;
        this.gameElemsPosX = { bg: 0, fg: 0 };
        this.pipes = new Array();
        for (let i = 0; i < 3; i++) {
            this.pipes.push(new Pipe(this.canvas, i));
        }
        this.players = new Array();
        for (let i = 0; i < 10; i++) {
            this.players.push(new Bird(this.canvas));
        }
        Game.log(" ->> Game (re)loaded");
    }

    update(dt: DOMHighResTimeStamp) {
        for (let pipe of this.pipes) {
            pipe.update(dt);
        }
        
        let allDied = true;
        for (let player of this.players) {
            player.update(dt);
            if (!player.died) {
                allDied = false;
            }
        }
        if (allDied) {
            Game.log(" ->> All died, best score : " + Game.score);
            this.reset();
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

        for (let player of this.players) {
            player.draw(scr);
        }
        scr.font = '14px sans-serif';
        scr.fillStyle = '#000';
        scr.fillText(`Generation: ${Game.generation}`, 10, 450);
        scr.fillText(`Score: ${Game.score}`, 10, 464);
        scr.fillText(`next pipe: ${Pipe.getClosestPipe().id} (last: ${Pipe.getClosestPipe(-1).id})`, 10, 478);
    }
    
    keyPress(event: KeyboardEvent) {
        // tel un dieu on manipule les oiseaux contre leurs grés
        if (event.key === " ") {
            for (let player of this.players) {
                player.moveUp();
            }
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