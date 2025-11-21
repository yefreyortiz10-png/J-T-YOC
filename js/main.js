document.addEventListener('DOMContentLoaded', () => {
    const pixelBot = document.getElementById("pixel-bot");
    const juegoContenedor = document.getElementById("juego-contenedor");
    const mensajeJuego = document.getElementById("mensaje-juego");
    const puntuacionDisplay = document.getElementById("puntuacion");
    const suelo = document.getElementById("suelo");
    const nivelDisplay = document.getElementById("nivel");
    const nicknameDisplay = document.getElementById("nickname");

    let isJumping = false;
    let botBottom = 30;
    let score = 0;
    let level = 1;
    let gameOver = true;
    let obstacleInterval;

    let nickname = "";

    const fondos = [
        "#87CEEB",
        "#363636ff"
    ];

    const gameWidth = 900;

    /*--------*/
    function pedirNickname() {
        nickname = prompt("Escribe tu Nombre:");
        if (!nickname) nickname = "Jugador";
        nicknameDisplay.textContent = "Jugador: " + nickname;
    }

    function jump() {
        if (isJumping) return;
        isJumping = true;

        let jumpHeight = 150;
        let jumpSpeed = 10;
        let currentJumpHeight = 0;

        const upTimerId = setInterval(() => {
            if (currentJumpHeight >= jumpHeight) {
                clearInterval(upTimerId);
                const downTimerId = setInterval(() => {
                    if (botBottom <= 30) {
                        clearInterval(downTimerId);
                        botBottom = 30;
                        pixelBot.style.bottom = botBottom + "px";
                        isJumping = false;
                    }
                    botBottom -= jumpSpeed;
                    pixelBot.style.bottom = botBottom + "px";
                }, 20);
            }
            botBottom += jumpSpeed;
            currentJumpHeight += jumpSpeed;
            pixelBot.style.bottom = botBottom + "px";
        }, 20);
    }

    /*--------*/
    function actualizarNivel() {
        level = Math.floor(score / 5) + 1;
        nivelDisplay.textContent = "Nivel: " + level;

        if (score > 0 && score % 5 === 0) {
            let fondoIndex = (level - 1) % fondos.length;
            juegoContenedor.style.backgroundColor = fondos[fondoIndex];
        }
    }

    function generarObstaculo() {
        if (gameOver) return;

        let obstaclePosition = gameWidth;
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstaculo");
        juegoContenedor.appendChild(obstacle);

        const moverObstaculo = setInterval(() => {
            if (obstaclePosition < -30) {
                clearInterval(moverObstaculo);
                juegoContenedor.removeChild(obstacle);
                score++;
                puntuacionDisplay.textContent = "Puntuación: " + score;
                actualizarNivel();
            }

            if (
                obstaclePosition > 50 && obstaclePosition < 100 &&
                botBottom < 80
            ) {
                clearInterval(moverObstaculo);
                clearInterval(obstacleInterval);
                gameOver = true;
                mensajeJuego.innerHTML = `
                    GAME OVER! <br>
                    Puntuación final: ${score} <br>
                    Jugador: ${nickname} <br>
                    Nivel alcanzado: ${level} <br><br>
                    Presione ESPACIO para reiniciar
                `;
                mensajeJuego.style.display = 'block';
                suelo.style.animationPlayState = "pause";
            }

            obstaclePosition -= 10;
            obstacle.style.left = obstaclePosition + "px";
        }, 20);
    }

    function iniciarJuego() {
        pedirNickname();

        document.querySelectorAll(".obstaculo").forEach(o => o.remove());
        /*--------*/
        score = 0;
        level = 1;

        puntuacionDisplay.textContent = "Puntuación: 0";
        nivelDisplay.textContent = "Nivel: 1";

        juegoContenedor.style.backgroundColor = fondos[0];

        botBottom = 30;
        pixelBot.style.bottom = "30px";
        gameOver = false;
        mensajeJuego.style.display = "none";

        suelo.style.animationPlayState = "running";

        obstacleInterval = setInterval(generarObstaculo, 2000);
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            if (gameOver) iniciarJuego();
            else jump();
        } else {
            jump();
        }
    });

    mensajeJuego.style.display = "block";
    suelo.style.animationPlayState = "pause";
});
