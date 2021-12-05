var startAnimation = false
var animationCount = 0;
var gameStart = false;
var ovenBlur = 2;

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
const ovenTexture = PIXI.Texture.from("../images/bake/oven.png");

///// load sprite textures
const trayTexture = PIXI.Texture.from("../images/bake/tray.png");
const timerTexture = PIXI.Texture.from("../images/bake/timer.png");

//////////// Add bg
const ovenBgSprite = new PIXI.Sprite(ovenTexture);
ovenBgSprite.scale.set(0.65, 0.82);
ovenBgSprite.x = 0;
ovenBgSprite.y = -3;
MainContainer.addChild(ovenBgSprite);

//////////// Create and position sprites in the scene (initial positions)

///// tray sprite
const traySprite = new PIXI.Sprite(trayTexture);

traySprite.x = 400;
traySprite.y = 315;

traySprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
traySprite.interactive = false;
traySprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);


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

const hintText = new PIXI.Text('Bake!', style);
hintText.position.set(65, 60);
hintContainer.addChild(hintText);

const style2 = new PIXI.TextStyle({
    fontFamily: 'Lucida Handwriting',
    fontSize: 20,
    fill: 'black',
    align: "center",
})

const timerSuggestedTxt = new PIXI.Text('~09:30', style2);
timerSuggestedTxt.position.set(60, 105);
hintContainer.addChild(timerSuggestedTxt);

////////// bg blur

const blurFilter = new PIXI.filters.BlurFilter();
ovenBgSprite.filters = [blurFilter]


var correctSound = new Audio('../audio/correctSound.mp3');
correctSound.loop = false;
var incorrectSound = new Audio('../audio/incorrectSound.mp3');
incorrectSound.loop = false;

/// timer
const timerSprite = new PIXI.Sprite(timerTexture);

timerSprite.scale.x = 0.35;
timerSprite.scale.y = 0.35;

timerSprite.x = 400;
timerSprite.y = 300;

timerSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
timerSprite.interactive = true;
timerSprite.buttonMode = true;


var timerStatus = 3; // start stop reset
var timeSec = 0
var timeMin = 0
var ticks = 0

timerSprite
        .on('pointerdown', onButtonDown);

function onButtonDown() {
    console.log(timerStatus)
  switch (timerStatus) {
        case 0:
            timerStatus = 1
            break;
        case 1: 
            timerStatus = 2
            if (timeMin == 9 && timeSec >= 10 && timeSec <= 50) {
                startAnimation = true
                correctSound.play()
                MainContainer.addChild(traySprite);
                hintContainer.visible = false
            } else {
                incorrectSound.play()
            }
            break;
        case 2:
            timerStatus = 0
            
            timeSec = 0
            timeMin = 0
            ticks = 0
            timerText.text = '00:00'
            break;
        default:
            timerStatus = 1
    }
}


MainContainer.addChild(timerSprite);


const timerTextStyle = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fontSize: 60,
    fill: 'black',
    align: "center",
})

const timerText = new PIXI.Text('00:00', timerTextStyle);
timerText.position.set(320, 270);
MainContainer.addChild(timerText);

//// Done



// Listen for animate update
app.ticker.add((delta) => {

    if (startAnimation) {
        animationCount++;
        console.log(animationCount)

        if (animationCount > 100) {
            window.location.href = "./gingerbreadOutro.html";
            
        }
    }

    if (ovenBlur < 10) {
        ovenBlur += 0.05;
        blurFilter.blur = ovenBlur
    }

    if (timerStatus == 1) {
        ticks++
        if (ticks == 2) {
            timeSec++
            ticks = 0
            if (timeSec == 60) {
                timeSec = 0
                timeMin++
            }
            timerText.text = (timeMin).toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" + (timeSec).toLocaleString(undefined, {minimumIntegerDigits: 2})

        }
    }
    


});

////////// Start container

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

const titleText = new PIXI.Text('Prepare the oven!', styleTitle);
titleText.position.set(230, 200);
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