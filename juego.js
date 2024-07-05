var fondo;
var carro;
var cursores;
var enemigos;
var timer;

var gasolinas;
var timerGasolina;

var puntos;
var txtPuntos;

var vidas;
var txtVidas;

var Portada = {
  create: function() {
    var estiloTitulo = { font: 'bold 30px Arial', fill: '#fff', align: 'center' };
    var estiloMensaje = { font: '20px Arial', fill: '#fff', align: 'center' };

    var titulo = juego.add.text(juego.width / 2, 100, 'Franco Del Castillo', estiloTitulo);
    titulo.anchor.setTo(0.5);

    var mensaje = juego.add.text(juego.width / 2, 200, 'U19211467', estiloMensaje);
    mensaje.anchor.setTo(0.5);

    juego.time.events.add(Phaser.Timer.SECOND * 2, function() {
      juego.state.start('Juego');
    }, this);
  }
};

var Juego = {
  preload: function () {
    juego.load.image("bg", "img/bg.png");
    juego.load.image("carro", "img/carro_verde.png");
    juego.load.image("carroMalo", "img/carro_rosa.png");
    juego.load.image("gasolina", "img/gas.png");
    juego.forceSingleUpdate = true;
  },

  create: function () {
    fondo = juego.add.tileSprite(0, 0, 290, 540, "bg");
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    carro = juego.add.sprite(juego.width / 2, 496, "carro");
    carro.anchor.setTo(0.5);

    juego.physics.arcade.enable(carro, true);

    enemigos = juego.add.group();
    enemigos.enableBody = true;
    juego.setBodyType = Phaser.Physics.ARCADE;
    enemigos.createMultiple(20, "carroMalo");
    enemigos.setAll("anchor.x", 0.5);
    enemigos.setAll("anchor.y", 0.5);
    enemigos.setAll("outOfBoundsKill", true);
    enemigos.setAll("checkWorldBounds", true);

    gasolinas = juego.add.group();
    gasolinas.enableBody = true;
    juego.setBodyType = Phaser.Physics.ARCADE;

    gasolinas.createMultiple(20, "gasolina");
    gasolinas.setAll("anchor.x", 0.5);
    gasolinas.setAll("anchor.y", 0.5);
    gasolinas.setAll("outOfBoundsKill", true);
    gasolinas.setAll("checkWorldBounds", true);

    //puntaje en pantalla
    puntos = 0;
    juego.add.text(20, 20, "Puntos: ", { font: "14px Arial", fill: "#FFF" });
    txtPuntos = juego.add.text(80, 20, "0", {
      font: "14px Arial",
      fill: "#FFF",
    });

    //contador de vidas
    vidas = 1;
    juego.add.text(200, 20, "Vidas: ", { font: "14px Arial", fill: "#FFF" });
    txtVidas = juego.add.text(240, 20, "1", {
      font: "14px Arial",
      fill: "#FFF",
    });

    mensajeGameOver = juego.add.text(juego.width / 2, juego.height / 2, "VUELVE A INTENTARLO", {
      font: "20px Arial",
      fill: "#FFF",
      align: "center"
    });

    mensajeGameOver.anchor.setTo(0.5);
    mensajeGameOver.visible = false;

    timer = juego.time.events.loop(1500, this.crearCarroMalo, this);

    timerGasolina = juego.time.events.loop(200, this.crearGasolina, this);

    cursores = juego.input.keyboard.createCursorKeys();
  },

  update: function () {
    fondo.tilePosition.y += 3;
    if (cursores.right.isDown && carro.position.x < 245) {
      carro.position.x += 5;
    } else if (cursores.left.isDown && carro.position.x > 45) {
      carro.position.x -= 5;
    }
    puntos++;
    txtPuntos.text = puntos;

    //colision
    juego.physics.arcade.overlap(carro, enemigos, this.colision, null, this);
    juego.physics.arcade.overlap(carro, gasolinas, this.colision, null, this);
  },

  crearCarroMalo: function () {
    var posicion = Math.floor(Math.random() * 3) + 1;
    var enemigo = enemigos.getFirstDead();
    enemigo.physicsBodyType = Phaser.Physics.ARCADE;
    enemigo.reset(posicion * 73, 0);
    enemigo.body.velocity.y = 200;
    enemigo.anchor.setTo(0.5);
  },

  crearGasolina: function () {
    var posicion = Math.floor(Math.random() * 3) + 1;
    var gasolina = gasolinas.getFirstDead();
    gasolina.physicsBodyType = Phaser.Physics.ARCADE;
    gasolina.reset(posicion * 73, 0);
    gasolina.body.velocity.y = 200;
    gasolina.anchor.setTo(0.5);
  },

  colision: function (b, m) {
    console.log("COLISION");
    b.kill();
    m.kill();
    juego.state.start("GAMEOVER");
    setTimeout(function () {
      juego.state.start("Juego");
    }, 1000);
  },
};

var Terminado = {
  create: function () {
    var estiloMensaje = { font: 'bold 30px Arial', fill: '#fff', align: 'center' };

    var linea1 = juego.add.text(juego.width / 2, juego.height / 2 - 40, 'VUELVE', estiloMensaje);
    linea1.anchor.setTo(0.5);

    var linea2 = juego.add.text(juego.width / 2, juego.height / 2, 'A', estiloMensaje);
    linea2.anchor.setTo(0.5);

    var linea3 = juego.add.text(juego.width / 2, juego.height / 2 + 40, 'INTENTARLO', estiloMensaje);
    linea3.anchor.setTo(0.5);

    // Espera a que el jugador presione cualquier tecla para reiniciar el juego
    juego.input.onDown.addOnce(this.reiniciarJuego, this);
  },

  reiniciarJuego: function () {
    juego.state.start('Juego');
  }
};