
    
    // Selecciona etiqueta canvas del HTML
    //const canvas = document.querySelector('canvas');
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    // Asignar dimensiones al canvas
    canvas.width = 700;
    canvas.height = 500;

    ctx.beginPath();
    // .rect(x, y, ancho, largo) relativo  a toplefth
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.closePath();


    var running = false
    var ballRadius = 10;
    // posicion de la pelota 
    var x = Math.floor(Math.random() * canvas.width);
    var y = canvas.height-50;
    // step de la pelota por cada frame
    var dx = 3;
    var dy = -3;

    var paddleHeight = 15;
    var paddleWidth = 80;
    var paddleX = (canvas.width-paddleWidth)/2;
    var paddley = canvas.height - paddleHeight - 10;
    var rightPressed = false;
    var leftPressed = false;

    var brickColumnaCount = 7;
    var brickHileraCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;

    var brickPadding = 10;
    // separacion referencia toplefth de la matriz ladrillos
    var brickOffsetTop = 70;
    // ubicacion eje x donde comienza la matriz, calculo para centrarlo en la pantalla
    var brickOffsetLeft = (canvas.width - ((brickWidth + brickPadding) * brickColumnaCount - brickPadding)) / 2;

    var score = 0;
    var lives = 3;
    var bricks = [];
    var brickColor = ["red", "green", "white", "orange", "yellow", "purple", "pink", "gray"];

    let audioColideLadrillo = new Audio("./sound/m_pared.ogg");
    let audioColideBat = new Audio("./sound/m_bat.ogg");
    let musica = new Audio("./sound/Eminem_The_Real_Slim_Shady.mp3");
    


    // creamos una matriz 
    for(var j=0; j < brickHileraCount; j++) {
        bricks[j] = [];
        for(var i=0; i < brickColumnaCount; i++) {
            var colorRandom = Math.floor(Math.random() * 8) 
            bricks[j][i] = { x: 0, y: 0, status: 1, color: brickColor[colorRandom] };
            //console.log(bricks)
        }
    }

    // obtenemos el evento del teclado y lo pasamos a una funcion
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    // obtenemos el evento del mouse y lo pasamos a una funcion
    document.addEventListener("mousemove", mouseMoveHandler, false);

    

    function botonIzq(){
        console.log("se apreto boton izq")
        paddleX -= paddleWidth/2;
        running = true;
    }
    function botonDer(){
        console.log("se apreto boton Der")
        paddleX += paddleWidth/2;
        running = true;
    }

    function keyDownHandler(e) {
        if(e.code  == "ArrowRight") {
            rightPressed = true;
            running = true ;
        }
        else if(e.code == 'ArrowLeft') {
            leftPressed = true;
            running = true;
        }
        else if (e.code == "Space"){
            running = false
        }
    }

    function keyUpHandler(e) {
        if(e.code == 'ArrowRight') {
            rightPressed = false;
        }
        else if(e.code == 'ArrowLeft') {
            leftPressed = false;
        }
    }


    function mouseMoveHandler(e) {
        // .clientX obtiene la posicion de x del mouse
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 10 && relativeX < canvas.width - paddleWidth -10) {
            paddleX = relativeX ;
        }
    }

    // colicion pelota-ladrillo y borra el bloque cambiando su status
    function collisionDetection() {
        for(var c=0; c<brickHileraCount; c++) {
            for(var r=0; r<brickColumnaCount; r++) {
                var b = bricks[c][r];
                if(b.status == 1) {
                    // evalua si hay colision
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        // ejecuta sonido
                        audioColideLadrillo.play();
                        if(score == brickColumnaCount*brickHileraCount) {
                            alert("hola yani gane!");
                            // carga nuevamente el html
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    // dibujamos los elementos del juego
    // dibujamos la pelota
    function drawBall() {
        ctx.beginPath();
        // .arc ( x, y , radio,  ?, ?)
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#05fa3a";
        ctx.fill();
        ctx.closePath();
    }
    // dibujamos la paleta
    function drawPaddle() {
        ctx.beginPath();
        // .rect(x, y, ancho, largo) relativo  a toplefth
        ctx.rect(paddleX, paddley, paddleWidth, paddleHeight); 
        ctx.fillStyle = "yellow";
        ctx.fill();
        // coloca un borde al objeto, de color a eleccion
        ctx.strokeStyle = "black"
        // coloca un borde al objeto, de color negro
        ctx.stroke();
        ctx.closePath();
    }


    // dibujamos los ladrillos
    function drawBricks() {
        // columnas son tomadas como hileras y rown como columnas
        for(var c=0; c<brickHileraCount; c++) {
            for(var r=0; r<brickColumnaCount; r++) {
                if(bricks[c][r].status == 1) {
                    var brickX = (r*(brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c*(brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;

                    ctx.beginPath();
                    // .rect(x, y, ancho, largo) relativo  a toplefth
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    
                    ctx.fillStyle = bricks[c][r].color ;
                    ctx.fill();
                    // coloca un borde al objeto, de color a eleccion
                    ctx.strokeStyle = "black"
                    // coloca un borde al objeto, de color negro
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }


    // dibujamos el puntaje 
    function drawScore() {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        // .fillText(dato, x, y) relativo a buttonlefth
        ctx.fillText("Score: "+score, 20, 30);
    }
    // dibujamos el contador de vidas
    function drawLives() {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Lives: "+lives, canvas.width-130, 30);
    }

    // dibujamos pausa 
    function pausa() {
        ctx.font = "120px cooper";
        ctx.fillStyle = "black";
        var text = "PAUSA"
        // Devuelve un objeto y donde una de sus propiedades es width
        var large = ctx.measureText(text).width;
        //console.log(ctx.measureText(text))

        // .fillText(dato, x, y) relativo a buttonlefth
        ctx.fillText("PAUSA", canvas.width/2-large/2, canvas.height/2+100);
    }

    //==============================================================================================

    // FUNCION PRINCIPAL QUE FUNCIONA COMO BUCLE 
    function draw() {
        
        console.log("game inicio")
        // borra la pantalla del canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // llama a las funciones para dibular los elementos del juego
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        // comprueba coliciones con los ladrillos
        collisionDetection();

        // Rebote de la pelota con las paredes
        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        // rebote con techo
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        // Rebote de la pelota con la paleta
        if(y + dy > paddley - ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                audioColideBat.play();
            }
        }
        // pelota toca el fondo GAME OVER
        if(y + dy > canvas.height - ballRadius)  {
            lives--;
            running = false
            if(lives <= 0) {
                alert("GAME OVER");
                // Reinicia la lectura del html similar a F5 actualizar
                document.location.reload();
                return 
                
            }
            else {
                // reinicia el juego hasta agotar las vidas
                // obtiene un numero random y lo redondea el entero menor proximo
                x = Math.floor(Math.random() * canvas.width);
                y = canvas.height-50;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
        
        // evaluamos si se preciona alguna flecha de comando
        if(rightPressed && paddleX <= canvas.width - paddleWidth - 15) {
            paddleX += 5;
            //console.log("se presiono la flecha derecha")
        }
        else if(leftPressed && paddleX >= 15) {
            paddleX -= 5;
            //console.log("se presiono la flecha izquierda")
        }


               
        if (running == true) {
            //movimiento de la pelota
            x += dx;
            y += dy;
            musica.play();
            // Establece el volumen 0 a 1
            musica.volume = 0.5;


        } else {
            //console.log("juego pausado");
            pausa();
            // Pausa la reproducción
            musica.pause(); 
            
        }
        
        // CallBack
        requestAnimationFrame(draw); 
    }
    
    
    // llamada a la funcion principal
    draw();
    
    //console.log("game hhhhh")

