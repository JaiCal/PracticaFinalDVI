MEMORIA
Commit: 
1. Diseño del juego
    1. Objetivo del juego: 
		El objetivo principal del juego es derrotar a varios enemigos avanzando por el mapa mientras se sortean los diferentes obstáculos hasta llegar al boss final y matarlo. En nuestro caso tenemos dos niveles distintos, con los diferentes bosses al final de los mismos. 
    2. Principales mecánicas
		-Movimiento 2D: se puede saltar, correr y moverse en diferentes direcciones. 
		-Disparos: Hay dos tipos de disparos, uno con la tecla [Enter] y otro con el [Espacio], cuyos daños son 2 y 1 respectivamente.
		-Escaleras: Megaman es capaz de subir las escaleras e incluso puede disparar si está sobre una.
		-Items de vida: al recogerlos aumentan 1 vida de Megaman.
		-Lifts: plataformas que se mueven en horizontal en un rango determinado y que Megaman puede montar para poder desplazarse.
		-Score: cada vez que Megaman mata a algún enemigo , aumenta la puntuación en  una determinada cantidad dependiendo del enemigo en cuestión.
		-Puertas: Megaman es capaz de abrir las puertas para avanzar.
		-Cámaras: hay objetos invisibles que funcionan para el movimiento de la cámara.
		-Pinchos: si Megaman hace contacto con ellos, muere inmediatamente.
		-Barra de vida: Megaman tiene una barra de vida que inicialmente vale 8 puntos.
		-Score: cada eliminación del enemigo otorga una pequeña puntuación a Megaman.
 
    3. Personajes
		-Megaman:
		Es el avatar del jugador. Puede moverse en dos direcciones, saltar, disparar para atacar a los enemigos, subir escaleras, abrir puertas, coger vidas.
		- Metall:
		Cada vez que se asoma y Megaman está cerca , dispara en su dirección. Cuando no está asomado, los disparos de Megaman no le hacen daño
		-BigEye:
		-Un robot de grandes dimensiones. Cuando Megaman está cerca, salta en su dirección para aplastarlo. Le inflige daño si cae sobre él.
		-PicketMan:
		Cuando Megaman está cerca, le lanza 2 picos seguidos. Una vez haya lanzado los picos, se defiende con su escudo y los disparos de Megaman no le hacen daño.
		-Sniper Joe:
		Un soldado parecido a Megaman. Alterna cíclicamente entre tres estados: Protegerse con el escudo, disparar y saltar. Solo es vulnerable cuando dispara. Gira hacia Megaman cuando éste le sobrepasa.
		-Blader:
		Un enemigo volador, que ataca rápidamente cargando hacia Megaman desde abajo. Se desplaza sin problemas a través de los bloques sólidos, y asciende cuando el jugador está cerca de él.
		-Octopus:
		Un bloque que se mueve horizontalmente de una pared a otra. Cuando llega a un extremo, se detiene durante unos instantes. Hace daño por contacto y bloquea los movimientos de Megaman.
		-Blaster:
		Una torreta estática que se coloca en las paredes. Puede estar cerrada o abierta, y tarda unos instantes en pasar de un estado al otro. Cuando se abre por completo, dispara hacia un lado y vuelve a cerrarse.
		-Footholder: 
		Se mueve verticalmente hacia arriba y abajo en un rango determinado y lanza proyectiles. Megaman puede saltar encima de ellos y usarlos como plataforma para poder cruzar de un lado a otro.
		-BombMan (BOSS):
		Es un jefe que lanza bombas en la dirección en la que está megaman. Después de lanzar la bomba , este realiza un salto en la dirección de megaman y vuelve a lanzar otra bomba y así sucesivamente.
		-Fireman (BOSS):
		Fireman va corriendo alrededor del escenario mientras dispara fuego en la dirección en la que esté MegaMan cada 3 segundos aprox y al disparar se acerca más a Megaman para intentar alcanzarle con su fuego. Además cuando este proyectil de fuego impacta en Megaman, nace del suelo una llama de fuego que se tendrá que esquivar si no se quiere perder vida también. 
	3. Diseño de la implementación: arquitectura y principales componentes.
		-Arquitectura: La arquitectura del videojuego se centra en el motor Quintus, que enlaza tanto los diferentes sprites, los mapas realizados con Tiled en formato  .tmx, los diferentes sonidos utilizados y el Código del juego. Posteriormente exporta todo a un Canvas en un archivo HTML. 
		El Código del juego se divide en varios ficheros para poder diferenciar las diferentes clases que actúan en el videojuego:
			-enemies: contiene el Código de las diferentes clases con las que se crean los enemigos. 
			-bosses: contiene el Código de las clases con las que creamos los diferentes bosses y sus correspondientes peculiaridades. 
			-Megaman: contiene el Código de las clases relacionadas con Megaman, además de los proyectiles de los que posteriormente heredarán el comportamiento los demás enemigos. 
			-sensores: contiene el Código relacionado con los sensores en el juego, tanto con las escaleras como con la Cámara y su movimiento. 
			-game: contiene el Código general de funcionamiento del juego además de la carga de recursos y la creación de los diferentes niveles y escenarios
		Al utilizar el motor Quintus, para cargar los diferentes recursos se deben de ubicar en la carpeta correspondiente. El sonido en la carpeta audio. Todos los datos json para la utilización de sprites, el soporte para los mapas (los tiles) y los propios mapas se almacenan en la carpeta data. Las imágenes de soporte para mapas, sprites y para las escenas se almacenan en la carpeta images. 
		Componentes:
		defaultEnemy: Contiene los métodos comunes de los enemigos 
	 
	5. Equipo de trabajo y reparto de tareas: descripción del trabajo realizado por cada uno de los integrantes del grupo y carga de trabajo realizada (0%-100%)
		-Jheison Orellana Díaz:
			-Escaleras.
			-Pinchos.
			-Puertas.
			-Mecanismo Megaman.
			-Proyectiles.
			-Creación del mapa level1.
			-Debugeo de código.
			-Barras de vida.
			
		-Zakaria El Fakhri Ouajih:
			-Creación de los siguientes enemigos: Metall, BigEye, PicketMan, Footholder
			-Creación del boss BombMan
			-Creación del segundo mapa (level 2)
			-Lift (plataforma)
			-Item que da vida al megaman al cogerlo
			-Sistema de puntuaciones (Score)
			-Proyectiles
			-Debugeo de código
		 
		-Efrain Fernández Sangrador: 
			-Creación del boss Fireman
			-Creación de la parte final del level 2, donde aparece el boss Fireman
			-Diseño de las pantallas con el formato NES y su correspondiente introducción en el juego, con el sonido incluido.
			-Búsqueda e introducción de todos los sonidos de los personajes y efectos.
			-Búsqueda e introducción de todos los sonidos de los diferentes mapas.
			-Transiciones de escenas con sonido.
		 
		-Jaime Calzada Ferreras
			-Creación de enemigos: Blader, Sniper Joe, Octopus, Blaster.
		 
		-Porcentaje:
			-Jheison: 31,25%
			-Zakaria: 30,25%
			-Efraín: 20,75%
			-Jaime: 17,75%
 
	6. Fuentes y referencias: Referencias a todos los assets utilizados en la realización del juego. 
		Sprites: NES - Mega Man - The Spriters Resource (spriters-resource.com)
		Sonido: Youtube
		Title screen: zonared.com
 
La entrega de este proyecto se realizará a través del Campus Virtual. La entrega consistirá en lo siguiente:
	-Un enlace al repositorio de Github en el que se encuentra el proyecto completo.
	-El hash del commit que indica la versión del proyecto que se quiere que sea evaluada.
	-Un enlace a la web en la que está alojado el videojuego.
	-Un enlace a un **vídeo** con una duración máxima de *dos minutos* de gameplay del juego. Se recomienda subirlo a Youtube o cualquier otra plataforma de vídeos online. Este video es imprescindible para aprobar la práctica.

