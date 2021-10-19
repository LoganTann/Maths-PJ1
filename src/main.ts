import Game from './ts/game';

document.addEventListener("DOMContentLoaded", function() {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");  
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d"); 
    const game = new Game();

    let lastElapsedTime: DOMHighResTimeStamp = 0;
    function gameloop(elapsedTime: DOMHighResTimeStamp) {
        const dt = (elapsedTime - lastElapsedTime) * 0.001;
        lastElapsedTime = elapsedTime;
        game.update(dt);
        game.draw(ctx);
        requestAnimationFrame(gameloop);  
    }
    game.load(canvas)
        .then(()=> {
            requestAnimationFrame(gameloop);
            document.addEventListener("keydown", game.keyPress.bind(game));
        });
    

});

