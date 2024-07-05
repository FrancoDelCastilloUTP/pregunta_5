var juego = new Phaser.Game(290, 540, Phaser.CANVAS, "bloque_juego");
//Agregando los estados del juego
juego.state.add("Juego", Juego);
juego.state.add('Portada', Portada);
juego.state.add("GAMEOVER", Terminado);

// Iniciar el estado de la portada
juego.state.start('Portada');
