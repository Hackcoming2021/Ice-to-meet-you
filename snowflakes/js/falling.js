// SCALING OPTIONS
// scaling can have values as follows with full being the default
// "fit"	sets canvas and stage to dimensions and scales to fit inside window size
// "outside"	sets canvas and stage to dimensions and scales to fit outside window size
// "full"	sets stage to window size with no scaling
// "tagID"	add canvas to HTML tag of ID - set to dimensions if provided - no scaling

var scaling = "fit"; // this will resize to fit inside the screen dimensions
var width = 1000;
var height = 800;
var color = dark; // or any HTML color such as "violet" or "#333333"
var outerColor = light;
// var assets = ["bomb.png", "snowflake.png", "explosion.png", "wow.png", "snowman.png"];
var assets = ["snowflake.png","snowman.png", "wow.png", "sun.png", "boo.png", "homeForTheHolidays.mp3"];
var path = "../assets/";
var count = 0;
// var bottomLabel = new Label(count, 30, null, "#888").pos(40,700);
var startVolume = 1;
var startPan = 0;




var frame = new Frame(scaling, width, height, color, outerColor, assets, path);
frame.on("ready", function() {
	zog("ready from ZIM Frame");

	var stage = frame.stage;
	var stageW = frame.width;
	var stageH = frame.height;

	// ZIM BITS - Falling, Dodging and Catching Game  (2020)

	// To make things fall we can animate objects from the top to the bottom
	// This can be done with code in a Ticker or just using ZIM animate()

	// often we want to make multiple copies fall
	// we use ZIM interval with a random range input to make falling random

	// to animate multiple objects it is best to add the objects to a Container
	// then we can loop through the objects in the container and move each one

	// we often have something that is catching or avoiding the falling objects
	// for instance, a person - then we might want the person to follow the mouse
	// or perhaps keyboard or drag in some cases
	// we can do this manually or use a ZIM MotionController

	// we will probably want to check if the person catches or hits the objects
	// in a Ticker we do a hitTest to see if the object has hit the person
	// depending on how many objects and their shapes
	// we choose from the variety of zim hitTests
	// the fastest hitTest is hitTestBounds as it calculates rectangle intersection
	// others may bog if there are too many as they use graphical hitTests

	// EXTRA
	// we might want to keep score if we are collecting things
	// and perhaps make the person lose points or die if they get hit
	// we may want to have multiple types of things falling worth different points
	// in that case, as we make the object we assign the points as a property of the object
	// and then when we check the hit test, we can access the points
	// we would want to add sounds, perhaps levels with different speeds, etc.

	// STEPS
	// 1. create a backing that can be used as a mask (or just go full screen)
	// 2. create a container for the game (or just use the stage)
	// 3. create a person to dodge and catch items and position at the bottom
	// 4. move the player with a MotionController
	// 5. optionally start the game when the user moves their mouse or swipes
	// 6. add an interval to create and animate objects to drop
	// 7. add a Ticker to test for hits
	// 8. we can make little animations, etc. when things are hit

	// STEPS
	// 1. create a backing that can be used as a mask (or just go full screen)
	var backing = new Rectangle(stageW-80, stageH-250, grey)
		.center()
		.mov(0,-20);

	// 2. create a container for the game (or just use the stage)
	var game = new Container(backing.width, backing.height)
		.loc(backing)
		.setMask(backing);

	// 3. create a person to dodge and catch items and position at the bottom
	var snowman = asset("snowman.png")
		.centerReg()
		.pos(0,0,CENTER,BOTTOM,game);

	// 4. move the player with a MotionController
	new MotionController({
		target:snowman,
		type:"mousemove", // default
		speed:20, // default
		damp:.1, // default
		axis:"horizontal",
		boundary:new Boundary(snowman.width/2,backing.y + backing.height, backing.width-snowman.width, 0),
		container:game
	});

	// 5. optionally start the game when the user moves their mouse or swipes
	stage.on("stagemousemove", startGame, null, true); // only once
	function startGame() {
		var gameSound = asset("homeForTheHolidays.mp3").play({volume:startVolume, pan:startPan, loop:true});

		// 6. create and animate objects to drop
		dropsuns();
		dropsnowflakes();
	
		

		// 7. add a Ticker to run an animation function
		Ticker.add(test);
	}

	// 6. create and animate objects to drop
	// sunS
	var suns = new Container().addTo(game);
	function dropsuns() {

		interval([.2, 1.2], function() {
			var sun = asset("sun.png")
				.clone()
				.centerReg()
				.loc(rand(0, game.width), 50, suns)
				.animate({
					props:{y:backing.height-20},
					time:2,
					ease:"linear",
					call:function (target) {
						// explode(target);
						remove(target);
					}
				});
			var boo = asset("boo.png").clone().centerReg({add:false}); // do not add
			sun.boo = boo;
		});
	}

	// 6. create and animate objects to drop
	// snowflake
	var snowflakes = new Container().addTo(game);

	function dropsnowflakes() {
		interval([.5, 1.5], function() {
			var snowflake = asset("snowflake.png")
				.clone()
				.centerReg()
				.loc(rand(0, game.width), -30, snowflakes)
				.animate({
					props:{y:stageH},
					time:3,
					ease:"linear",
					call:remove
				});
			var wow = asset("wow.png").clone().centerReg({add:false}); // do not add
			snowflake.wow = wow;
		});
	}
	//find a way to make it a clicking
	// snowflakes.addEventListener("click", grab(snowflakes));
	// 7. add a Ticker to run an animation function
	const scorer = new Scorer().pos(40,700,true);
	const lives = new Indicator({num:3, fill:true}).pos(40,700);
	lives.selectedIndex = 2;

	function test() {
		suns.loop(function(sun) {
			if (snowman.hitTestBounds(sun)) {
				explode(sun);
				lives.selectedIndex = lives.selectedIndex - 1;
				if(lives.selectedIndex<0){
					var replayLabel = new Label("Try Again!", 30, "Courier", "red");
					var replayPlane = new Pane({
						width:500,
						height:400,
						label:replayLabel,
						backgroundColor:"white",
						draggable:true,
						close:false,
									
					}).tap(function(){
						zgo("../html/falling.html");
					});

					replayPlane.show();
					endGame();
				}
			}
			
		}, true); // true loops backwards as we are removing children
		snowflakes.loop(function(snowflake) {
			if (snowman.hitTestBounds(snowflake)) {
				grab(snowflake);
				// get points etc.
				scorer.score = scorer.score + 1;

				if(scorer.score==5){ //set to ==20 later
					endGame();
					// var continueBut = new Button("Continue",30 ,"red").tap(function(){
					// 	zgo("../html/index.html");
					// });
					var label = new Label("        Congrats!\n\nYou unlocked a character!", 30, "Courier", "white");
					var paneDrag = new Pane({
						width:500,
						height:400,
						label:label,
						backgroundColor:"green",
						draggable:true,
						close:false,
									
					}).tap(function(){
						zgo("../../html/gingerbreadIntro.html");
					});
					paneDrag.x = 400; paneDrag.y = 200;
					// continueBut.x = 400; continueBut.y = 200;
					paneDrag.show();
					// continueBut.show();
				}	
			}
		}, true); // true loops backwards as we are removing children
	}

	// 8. we can make little animations, etc. when things are hit
	function explode(sun) {
		// var boo = sun.boo;
		// if (boo) {
		// 	boo
		// 		.loc(sun)
		// 		.animate({alpha:0}, .1, null, remove, null, .1); // last param is wait
		// }
		sun.boo
			.addTo(game)
			.loc(snowman)
			.mov(0,-130)
			.animate({alpha:0}, .1, null, remove, null, .1); // last param is wait;
		count--;
		console.log(count);
		remove(sun);
	}

	// 8. we can make little animations, etc. when things are hit
	function grab(snowflake) {
		snowflake.wow
			.addTo(game)
			.loc(snowman)
			.mov(0,-130)
			.animate({alpha:0}, .1, null, remove, null, .1); // last param is wait;
		count++;
		console.log(count);
		remove(snowflake);
	}

	function remove(obj) {
		obj.removeFrom();
		obj = null;
	}
	function endGame(){
		snowflakes = null;
		sun = null;
	}

	stage.update();

	var title = "Catch the Snowflakes!";
	var label = new Label(title, 30, null, "#666")
		.pos(40, 40);
	
	
	// var docItems = "Frame,Container,Rectangle,Label,hitTestBounds,move,MotionController,animate,loop,pos,mov,reg,addTo,removeFrom,center,setMask,loop,interval,zog,Ticker";
	// makeFooter(stage, stageW, stageH, null, docItems); // ZIM BITS footer - you will not need this

	stage.update();

}); // end of ready

