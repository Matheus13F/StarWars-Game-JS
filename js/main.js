let maiorPontuacao = 0;
let controleMP = 0; //controle da maior pontuacao
function start() {
  // Inicio da funçao start()

  $("#inicio").hide();
  $("#btn").hide();

  $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
  $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
  $("#fundoGame").append("<div id='inimigo2'></div>");
  $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");

  //Principais variaveis do jogo

  var podeAtirar = true;
  var fimdejogo = false;
  var pontos = 0;
  var salvos = 0;
  var perdidos = 0;
  var energiaAtual = 3;
  var jogo = {};

  var TECLA = {
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    SPACE: 32, //backspace 8
  };

  var velocidade = 5;
  var posicaoY = parseInt(Math.random() * 334);

  var somDisparo = document.getElementById("somDisparo");
  var somExplosao = document.getElementById("somExplosao");
  var musica = document.getElementById("musica");
  var somGameover = document.getElementById("somGameover");
  var somPerdido = document.getElementById("somPerdido");
  var somResgate = document.getElementById("somResgate");
  let somTieFighter = document.getElementById("somTieFighter");
  let somMainTheme = document.getElementById("somMainTheme");

  //Musica em loop
  musica.addEventListener(
    "ended",
    () => {
      musica.currentTime = 0;
      musica.play();
    },
    false
  );
  musica.play();

  jogo.pressionou = [];

  //verifica se alguma tecla foi pressionada

  $(document).keydown(function (e) {
    jogo.pressionou[e.which] = true;
  });

  $(document).keyup(function (e) {
    jogo.pressionou[e.which] = false;
  });

  //Game Loop

  jogo.timer = setInterval(loop, 30);

  function loop() {
    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
    placar();
    energia();
  } // Fim da funcao loop()

  //Fun��o que movimenta o fundo do jogo

  function movefundo() {
    esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);
  } // fim da fun��o movefundo()

  function movejogador() {
    if (jogo.pressionou[TECLA.W]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo - 12);

      if (topo <= 0) {
        $("#jogador").css("top", topo + 0);
      }
    }

    if (jogo.pressionou[TECLA.S]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo + 12);

      if (topo >= 490) {
        $("#jogador").css("top", topo - 0);
      }
    }
    if (jogo.pressionou[TECLA.A]) {
      var topo = parseInt($("#jogador").css("left"));
      $("#jogador").css("left", topo - 10);

      if (topo <= 7) {
        $("#jogador").css("left", topo - 0);
      }
    }

    if (jogo.pressionou[TECLA.D]) {
      var topo = parseInt($("#jogador").css("left"));
      $("#jogador").css("left", topo + 10);

      if (topo >= 810) {
        $("#jogador").css("left", topo - 0);
      }
    }

    if (jogo.pressionou[TECLA.SPACE]) {
      disparo();
    }
  } // fim da fun��o movejogador()

  function moveinimigo1() {
    posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX - velocidade);
    $("#inimigo1").css("top", posicaoY);

    if (posicaoX <= 0) {
      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }
  } //Fim da fun��o moveinimigo1()

  function moveinimigo2() {
    posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", posicaoX - 3);

    if (posicaoX <= 0) {
      $("#inimigo2").css("left", 775);
    }
  } // Fim da fun��o moveinimigo2()

  function moveamigo() {
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX + 1);

    if (posicaoX > 906) {
      $("#amigo").css("left", 0);
    }
  } // fim da fun��o moveamigo()

  function disparo() {
    if (podeAtirar == true) {
      somDisparo.play();

      podeAtirar = false;

      topo = parseInt($("#jogador").css("top"));
      posicaoX = parseInt($("#jogador").css("left"));
      tiroX = posicaoX + 190;
      topoTiro = topo + 37;
      $("#fundoGame").append("<div id='disparo'></div");
      $("#disparo").css("top", topoTiro);
      $("#disparo").css("left", tiroX);

      var tempoDisparo = window.setInterval(executaDisparo, 30);
    } //Fecha podeAtirar

    function executaDisparo() {
      posicaoX = parseInt($("#disparo").css("left"));
      $("#disparo").css("left", posicaoX + 20);

      if (posicaoX > 900) {
        window.clearInterval(tempoDisparo);
        tempoDisparo = null;
        $("#disparo").remove();
        podeAtirar = true;
      }
    } // Fecha executaDisparo()
  } // Fecha disparo()

  function colisao() {
    var colisao1 = $("#jogador").collision($("#inimigo1"));
    var colisao2 = $("#jogador").collision($("#inimigo2"));
    var colisao3 = $("#disparo").collision($("#inimigo1"));
    var colisao4 = $("#disparo").collision($("#inimigo2"));
    var colisao5 = $("#jogador").collision($("#amigo"));
    var colisao6 = $("#inimigo2").collision($("#amigo"));

    // jogador com o inimigo1
    if (colisao1.length > 0) {
      energiaAtual--;

      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X, inimigo1Y);

      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }

    // jogador com o inimigo2
    if (colisao2.length > 0) {
      energiaAtual--;

      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo2X, inimigo2Y);

      $("#inimigo2").remove();

      reposicionaInimigo2();
    }

    // Disparo com o inimigo1
    if (colisao3.length > 0) {
      pontos = pontos + 100;
      velocidade = velocidade + 0.1;

      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));

      explosao1(inimigo1X, inimigo1Y);
      $("#disparo").css("left", 950);

      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }

    // Disparo com o inimigo2
    if (colisao4.length > 0) {
      pontos = pontos + 50;

      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      $("#inimigo2").remove();

      explosao2(inimigo2X, inimigo2Y);
      $("#disparo").css("left", 950);

      reposicionaInimigo2();
    }

    // jogador com o amigo
    if (colisao5.length > 0) {
      salvos++;
      somResgate.play();
      reposicionaAmigo();
      $("#amigo").remove();
    }

    //Inimigo2 com o amigo
    if (colisao6.length > 0) {
      perdidos++;
      amigoX = parseInt($("#amigo").css("left"));
      amigoY = parseInt($("#amigo").css("top"));
      explosao3(amigoX, amigoY);
      $("#amigo").remove();

      reposicionaAmigo();
    }
  } //Fim da fun��o colisao()

  //Explosao 1
  function explosao1(inimigo1X, inimigo1Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao1'></div");
    $("#explosao1").css("background-image", "url(imgs/explosao.png)");
    let div = $("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao = window.setInterval(removeExplosao, 1000);

    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao = null;
    }
  } // Fim da fun��o explosao1()

  //Reposiciona Inimigo2
  function reposicionaInimigo2() {
    var tempoColisao4 = window.setInterval(reposiciona4, 5000);

    function reposiciona4() {
      window.clearInterval(tempoColisao4);
      tempoColisao4 = null;

      if (fimdejogo == false) {
        $("#fundoGame").append("<div id=inimigo2></div");
        somTieFighter.play();
      }
    }
  } //Fim reposiciona inimigo 2

  //Explos�o2

  function explosao2(inimigo2X, inimigo2Y) {
    somExplosao.play();

    $("#fundoGame").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url(imgs/explosao.png)");
    var div2 = $("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

    function removeExplosao2() {
      div2.remove();
      window.clearInterval(tempoExplosao2);
      tempoExplosao2 = null;
    }
  } // Fim da fun��o explosao2()

  //Reposiciona Amigo
  function reposicionaAmigo() {
    var tempoAmigo = window.setInterval(reposiciona6, 6000);

    function reposiciona6() {
      window.clearInterval(tempoAmigo);
      tempoAmigo = null;

      if (fimdejogo == false) {
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      }
    }
  } // Fim da fun��o reposicionaAmigo()

  //Explos�o3
  function explosao3(amigoX, amigoY) {
    somPerdido.play();
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top", amigoY);
    $("#explosao3").css("left", amigoX);
    var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
    function resetaExplosao3() {
      $("#explosao3").remove();
      window.clearInterval(tempoExplosao3);
      tempoExplosao3 = null;
    }
  } // Fim da fun��o explosao3

  //Placar
  function placar() {
    $("#placar").html(
      "<h2> Pontos: " +
        pontos +
        "| Salvos: " +
        salvos +
        "| Perdidos: " +
        perdidos +
        "</h2>"
    );
  } //fim da fun��o placar()

  //Barra de energia

  function energia() {
    if (energiaAtual == 3) {
      $("#energia").css("background-image", "url(imgs/life3.png)");
    }

    if (energiaAtual == 2) {
      $("#energia").css("background-image", "url(imgs/life2.png)");
    }

    if (energiaAtual == 1) {
      $("#energia").css("background-image", "url(imgs/life1.png)");
    }

    if (energiaAtual == 0) {
      $("#energia").css("background-image", "url(imgs/life0.png)");

      gameOver();
    }

    if (perdidos == 3) {
      gameOverbb8();
    }

    if (pontos >= 10000) {
      venceu();
    }
  } // Fim da funcao energia()

  //Funçao GAME OVER
  function gameOver() {
    fimdejogo = true;
    musica.pause();
    somGameover.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;

    if (controleMP == 0) {
      maiorPontuacao = pontos;
      controleMP++;
    } else {
      if (pontos > maiorPontuacao) {
        maiorPontuacao = pontos;
      }
    }

    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();

    $("#fundoGame").append("<div id='fim'></div>");

    $("#fim").html(
      "<h1> o império venceu! :( </h1><p>Sua pontuaçao foi: " +
        pontos +
        "</p><p>Recorde: " +
        maiorPontuacao +
        "</p>" +
        "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>"
    );
  } // Fim da fun��o gameOver();

  //Funçao GAME OVER
  function gameOverbb8() {
    fimdejogo = true;
    musica.pause();
    somGameover.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;

    if (controleMP == 0) {
      maiorPontuacao = pontos;
      controleMP++;
    } else {
      if (pontos > maiorPontuacao) {
        maiorPontuacao = pontos;
      }
    }

    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();

    $("#fundoGame").append("<div id='fim'></div>");

    $("#fim").html(
      "<h1> Cuide melhor do seu bb8! :( </h1><p>Sua pontuaçao foi: " +
        pontos +
        "</p><p>Recorde: " +
        maiorPontuacao +
        "</p><p>Lembre-se de se aproximar do bb8 para salva-lo!!</p>" +
        "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>"
    );
  } // Fim da funcao gameOver();

  //Funçao VENCER
  function venceu() {
    fimdejogo = true;
    musica.pause();
    somMainTheme.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;

    if (controleMP == 0) {
      maiorPontuacao = pontos;
      controleMP++;
    } else {
      if (pontos > maiorPontuacao) {
        maiorPontuacao = pontos;
      }
    }

    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();

    $("#fundoGame").append("<div id='fim'></div>");

    $("#fim").html(
      "<h1> A galaxia foi salva! Parabens!</h1><p>Sua pontuaçao foi: " +
        pontos +
        "</p><p>Recorde: " +
        maiorPontuacao +
        "</p><p>Tire um print e me marca no tt @oi_gummy</p>" +
        "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>"
    );
  } // Fim da funcao gameOver();
}

//Reinicia o Jogo
function reiniciaJogo() {
  somGameover.pause();
  somMainTheme.pause();
  $("#fim").remove();
  start();
} //Fim da funcao reiniciaJogo
