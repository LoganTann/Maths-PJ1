export function randint(min: number, max:number) :number {
    return Math.random() * (max - min) + min;
}

export interface Coord {
    x: number,
    y: number
}

export interface gameLifecycle {
    defs: Object;
    load(canvas ?: HTMLCanvasElement);
    update(dt: DOMHighResTimeStamp);
    draw(scr: CanvasRenderingContext2D);
}