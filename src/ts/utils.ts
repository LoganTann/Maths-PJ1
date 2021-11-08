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

export function getRandomUnit(array) {
    return array[randint(0, array.length - 1)];
}

export function mutateGene (gene, mutationRate) {
    if (Math.random() < mutationRate) {
        let mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
        gene *= mutateFactor;
    }
    return gene;
}