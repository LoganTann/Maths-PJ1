import assets from "./assets";
import { Coord, gameLifecycle, randint } from "./utils";

export default class Pipe implements gameLifecycle{
    static gap: number = 100;
    static speed: number = -130;
    public static createNewPipe: CallableFunction;
    public static removeLastPipe: CallableFunction;
    
    public static lastCreatedPosY: number;

    defs: {[key: string]: any} = {};

    private position: Coord;  /// position x, y = left, center
    private createdPipe = false;

    constructor(canvas: HTMLCanvasElement) {
        Pipe.lastCreatedPosY = canvas.height/2;
        this.load(canvas);
    }
    load(canvas: HTMLCanvasElement) {
        this.defs.canvasWidth = canvas.width;
        let y = randint(6, 30) * 10;
        y = Math.min(y, Pipe.lastCreatedPosY + 250);
        y = Math.max(y, Pipe.lastCreatedPosY - 250);
        Pipe.lastCreatedPosY = y;
        this.position = {x: this.defs.canvasWidth, y: y};
    }

    centerY: number;
    centerX(): number {
        return this.position.x + assets.pipe.width;
    }

    update(dt) {
        this.position.x += Pipe.speed * dt;
        if (!this.createdPipe && this.position.x < (this.defs.canvasWidth - 180)) {
            this.createdPipe = true;
            Pipe.createNewPipe();
        }
        if (this.position.x < -60) {
            Pipe.removeLastPipe();
        }
    }

    draw(scr) {
        // celle du haut
        scr.drawImage(assets.pipeRev, this.position.x, this.position.y - Pipe.gap/2 - assets.pipe.height);
        // celle du bas
        scr.drawImage(assets.pipe, this.position.x, this.position.y + Pipe.gap/2);
        // objectif
        scr.fillRect(this.centerX()-5,this.position.y-5,10,10); // fill in the pixel at (10,10)
    }

}