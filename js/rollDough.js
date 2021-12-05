var startAnimation = false
var animationCount = 0;
var rollerUp = false
var gameStart = false;
var rollChange = 0;

////////////// Set up the Pixi stage
const Application = PIXI.Application;

const app = new Application({
  width: 800,
  height: 600,
  transparent: false,
  antialias: true,
});

// change the color of the canvas
app.renderer.backgroundColor = 0x33395d;

// resize the canvas
app.renderer.resize(800, 600);

// change the style of the canvas and set position to absolute
// remove any default margins and paddings
app.renderer.view.style.position = "absolute";

if (window.innerWidth > 800 && window.innerWidth > 600) {
  var translate =
    "translate3d( " +
    String((window.innerWidth - 800) / 2) +
    "px, " +
    String((window.innerHeight - 600) / 2) +
    "px, 0)";
  app.renderer.view.style.transform = translate;
}

const MainContainer = new PIXI.Container();
app.stage.addChild(MainContainer);

document.body.appendChild(app.view);

//////////// Load textures
///// load backgrounds
const tableBGTexture = PIXI.Texture.from("../images/bgs/tableTop.png");

///// load sprite textures
const doughTexture = PIXI.Texture.from("../images/roll/dough.png");
const rollerTexture = PIXI.Texture.from("../images/roll/roller.png");

//////////// Add bg
const tableBgSprite = new PIXI.Sprite(tableBGTexture);
tableBgSprite.scale.set(0.7, 0.72);
tableBgSprite.x = -100;
tableBgSprite.y = -90;
MainContainer.addChild(tableBgSprite);

//////////// Create and position sprites in the scene (initial positions)

///// Bowl sprite
const doughSprite = new PIXI.Sprite(doughTexture);

doughSprite.width = 180;
doughSprite.height = 180;

doughSprite.x = 400;
doughSprite.y = 300;

doughSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
doughSprite.interactive = false;
doughSprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

MainContainer.addChild(doughSprite);

///// Roller sprite
const rollerSprite = new PIXI.Sprite(rollerTexture);

rollerSprite.scale.x = 0.7;
rollerSprite.scale.y = 0.6;

rollerSprite.anchor.set(0.5, 1); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
rollerSprite.interactive = true;
rollerSprite.buttonMode = false;

rollerSprite.x = 400;
rollerSprite.y = 380;

rollerSprite.rotation = 0

MainContainer.addChild(rollerSprite);

////////////////// Detction area rect for debugging

// const graphics = new PIXI.Graphics();
// // Rectangle
// graphics.beginFill(0xde3249);
// graphics.drawRect(270, 0, 260, 145);
// graphics.endFill();

// MainContainer.addChild(graphics);

// MainContainer.addChild(rollerSprite);

////////////////// Hint object

const scrollTexture = PIXI.Texture.from("../images/ingredients/Scroll.png");

const hintContainer = new PIXI.Container();

app.stage.addChild(hintContainer);



///// scroll sprite
const scrollSprite = new PIXI.Sprite(scrollTexture);

scrollSprite.scale.x = 0.35;
scrollSprite.scale.y = 0.35;

scrollSprite.x = 100;
scrollSprite.y = 100;

scrollSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
scrollSprite.interactive = false;
scrollSprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

hintContainer.addChild(scrollSprite);

const style = new PIXI.TextStyle({
    fontFamily: 'Lucida Handwriting',
    fontSize: 26,
    fill: 'black',
    align: "center",
})

const hintText = new PIXI.Text('Roll it!', style);
hintText.position.set(60, 60);
hintContainer.addChild(hintText);


const stirCountText = new PIXI.Text('0%', style);
stirCountText.position.set(80, 105);
hintContainer.addChild(stirCountText);


////////////////// Scoll handling
// event.preventDefault prevents document scroll from scrolling when scrolling on the canvas
document.body.addEventListener("wheel", function(event){
    event.preventDefault()
    if (!startAnimation){
        rollerSprite.y += Math.sign(event.deltaY) * 10
    }

    rollChange++;

    // roller boundaries
    if (rollerSprite.y > 450) {
        rollerSprite.y = 450
        rollChange--;
    }

    if (rollerSprite.y < 220) {
        rollerSprite.y = 220
        rollChange--;
    }
    
    console.log(rollerSprite.y)
},  { passive: false });

var correctSound = new Audio('../audio/correctSound.mp3');
correctSound.loop = false;


// Listen for animate update
app.ticker.add((delta) => {

    if (startAnimation) {
        animationCount++;
        console.log(animationCount)

        if (animationCount > 100) {
            window.location.href = "./cookieCutter.html";
            
        }
    }

    var percentage = Math.round(rollChange / 2) 

        // update dough stretch
    if (percentage < 100 ){
        doughSprite.width = 180 + 1.1 * rollChange
        doughSprite.height = 180 + 1.6 * rollChange

        // update roll change percentage
        stirCountText.text = String(percentage) + "%"
    }

    if (percentage == 100) {
        stirCountText.text = String(percentage) + "%"

        if (! startAnimation) {
            startAnimation = true;
            correctSound.play()
        }
    }

});


const startContainer = new PIXI.Container();
app.stage.addChild(startContainer);
startContainer.interactive = true;
startContainer.buttonMode = true;
startContainer.x = 22;

startContainer.on('pointerdown', function() {
  startContainer.interactive = false;
  startContainer.buttonMode = false;
  startContainer.visible = false
  var gameStart = true;
  counter = 0
});

//// add background
const startBgTexture = PIXI.Texture.from("../images/bgs/startBg.png");
const startBgSprite = new PIXI.Sprite(startBgTexture);
startBgSprite.scale.set(0.60, 0.59);
startBgSprite.x = 5;
startBgSprite.y = -70;

startContainer.addChild(startBgSprite);

//// add explanation text
const styleTitle = new PIXI.TextStyle({
  fontFamily: 'Lucida Handwriting',
  fontSize: 48,
  fill: 'black',
  align: "center",
  wordWrap: true,
  wordWrapWidth: 300
})

const titleText = new PIXI.Text('Use your mousewheel to roll the dough!', styleTitle);
titleText.position.set(200, 130);
startContainer.addChild(titleText);

const subTextStyle = new PIXI.TextStyle({
  fontFamily: 'Lucida Handwriting',
  fontSize: 30,
  fill: 'black',
  align: "center",
  wordWrap: true,
  wordWrapWidth: 300
})

const promptText = new PIXI.Text('(Click to start!)', subTextStyle);
promptText.position.set(230, 400);
startContainer.addChild(promptText);