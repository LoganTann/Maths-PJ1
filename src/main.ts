import Game from './ts/game';


// dom content loaded
document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.getElementById('btn');
    let started = false;
    actionBtn.addEventListener('click', () => {
        if (started) {
            started = false;
            return;
        } else {
            actionBtn.innerText = 'Kill';
            started = true;
        }

        const canvas = <HTMLCanvasElement> document.getElementById("canvas");  
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d"); 
        const game = new Game();

        let lastElapsedTime: DOMHighResTimeStamp = 0;
        function gameloop(elapsedTime: DOMHighResTimeStamp) {
            const dt = (elapsedTime - lastElapsedTime) * 0.001;
            lastElapsedTime = elapsedTime;
            game.update(dt);
            game.draw(ctx);
            if (started) {
                requestAnimationFrame(gameloop);  
            }
        }
        game.load(canvas)
            .then(()=> {
                requestAnimationFrame(gameloop);
                document.addEventListener("keydown", game.keyPress.bind(game));
            });
    });
});

document.addEventListener("click", function() {
});
