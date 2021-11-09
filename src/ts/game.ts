import Bird from "./bird";
import Pipe from "./pipe";
import { gameLifecycle, randint } from "./utils";
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
    static relativeGeneration = 0;
    static stillAlive: number;

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

    static brainSaves: any = new Array();

    reset() {
        Game.generation++;
        Game.relativeGeneration++;
        Pipe.closest = 0;
        Game.score = 0;
        this.gameElemsPosX = { bg: 0, fg: 0 };
        this.pipes = new Array();
        for (let i = 0; i < 3; i++) {
            this.pipes.push(new Pipe(this.canvas, i));
        }
        if (this.players?.length > 0) {
            return;
        }
        this.players = new Array();
        for (let i = 0; i < 20; i++) {
            this.players.push(new Bird(this.canvas));
        }
    }

    /**
     * Triggers when the population is dead
     */
    beforeReset() {
        const oldPopulation = this.players.sort((a, b) => {
            return b.timeAlive - a.timeAlive;
        });
        this.players = new Array();
        if (Game.relativeGeneration < 2 && Game.score < 1) {
            Game.log(`Generation ${Game.generation}: Nobody went further than 1. Let's restart with a completely random population.`);
            Game.relativeGeneration = 0;
            return;
        }
        Game.brainSaves.push({ score: Game.score, timeAlive: oldPopulation[0].timeAlive, generation: Game.generation, brain: oldPopulation[0] });
        Game.brainSaves.sort((a, b) => {
            if (b.score == a.score) {
                return b.timeAlive - a.timeAlive;
            }
            return b.score - a.score;
        });
        const bestBrain = Game.brainSaves[0];
        Game.log(`Generation ${Game.generation}: Using the brain from gen ${bestBrain.generation} with  score = ${bestBrain.score} (lived ${bestBrain.timeAlive}s)`);
        for (let i = 0; i < 20; i++) {
            let newPlayer = new Bird(this.canvas);
            if (i < 10) {
                // seulement trois prennent les caractéristiques du meilleur
                newPlayer.copyBrainAndMutate(bestBrain.brain,i>0);
                newPlayer.type = i==0?"BB": "B";
            }
            this.players.push(newPlayer);
        }
    }

    update(dt: DOMHighResTimeStamp) {
        for (let pipe of this.pipes) {
            pipe.update(dt);
        }
        
        let allDied = true;
        Game.stillAlive = 0;
        for (let player of this.players) {
            player.update(dt);
            if (!player.died) {
                allDied = false;
                Game.stillAlive++;
            }
        }
        if (allDied) {
            this.beforeReset();
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

        scr.font = '14px sans-serif';
        scr.fillStyle = '#000';
        for (let i in this.players) {
            this.players[i].draw(scr);
        }
        scr.fillText(`Generation: ${Game.relativeGeneration} \t (total: ${Game.generation})`, 10, 450);
        scr.fillText(`Birds alive: ${Game.stillAlive} \t Score: ${Game.score}`, 10, 464);
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