import assets from "./assets";
import Pipe from "./pipe";
import { Coord, gameLifecycle } from "./utils";

export default class Bird implements gameLifecycle{
    defs: Object;

    pos: Coord;
    velocity_y: number = 0 // vitesse axe y 
    maxvelocity_y: number = 20;
    acceleration_y: number = 1300 // accélération y (gravité)

    constructor(canvas?: HTMLCanvasElement) {
        this.load(canvas);
    }
    load(canvas?: HTMLCanvasElement) { 
        this.pos = {x: 70, y: canvas.height/2 || 500};
    }
    update(dt: number) {
        this.velocity_y += Math.min(this.acceleration_y * dt, this.maxvelocity_y);
        this.pos.y = Math.min(this.pos.y + this.velocity_y * dt,390);
    }
    draw(scr: CanvasRenderingContext2D) {
        scr.drawImage(assets.bird, this.pos.x, this.pos.y);
    }
    moveUp() {
        //console.log("eeee")
        this.velocity_y = -300;
    }
}