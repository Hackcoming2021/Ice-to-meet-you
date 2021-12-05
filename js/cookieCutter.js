var startAnimation = false
var animationCount = 0;
var gameStart = false;
var numCutters = 0;

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

const maskContainer = new PIXI.Container();
app.stage.addChild(maskContainer);

document.body.appendChild(app.view);

//////////// Load textures
///// load backgrounds
const tableBGTexture = PIXI.Texture.from("../images/bgs/tableTop.png");

///// load sprite textures
const doughTexture = PIXI.Texture.from("../images/roll/dough.png");
const cutterTexture = PIXI.Texture.from("../images/cutter/gingerbread-man_2.png");
const cutterMaskTexture = PIXI.Texture.from("../images/cutter/gingerbread-man_3.png");

//////////// Add bg
const tableBgSprite = new PIXI.Sprite(tableBGTexture);
tableBgSprite.scale.set(0.7, 0.72);
tableBgSprite.x = -100;
tableBgSprite.y = -90;
MainContainer.addChild(tableBgSprite);

//////////// Create and position sprites in the scene (initial positions)

///// cutter sprite
// const cutterMaskSprite = new PIXI.Sprite(cutterMaskTexture);

// cutterMaskSprite.height = 128
// cutterMaskSprite.width = 128

// cutterMaskSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// // need to set the interactive to true to enable event detection on the sprite
// cutterMaskSprite.interactive = true;
// cutterMaskSprite.buttonMode = false;

// cutterMaskSprite.x = 300;
// cutterMaskSprite.y = 114;

// cutterMaskSprite.rotation = 0

// MainContainer.addChild(cutterMaskSprite);

///// dough sprite
const doughSprite = new PIXI.Sprite(doughTexture);

doughSprite.width = 400;
doughSprite.height = 500;

doughSprite.x = 400;
doughSprite.y = 300;

doughSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
doughSprite.interactive = true;
doughSprite.buttonMode = true;


doughSprite
    // Mouse & touch events are normalized into
    // the pointer* events for handling different
    // button events.
        .on('pointerdown', onButtonDown);

MainContainer.addChild(doughSprite);

function onButtonDown() {
  const mouseposition = app.renderer.plugins.interaction.mouse.global;

  addCutterMaskSprite(mouseposition.x, mouseposition.y)
}

///// cutter sprite
const cutterSprite = new PIXI.Sprite(cutterTexture);

cutterSprite.height = 128;
cutterSprite.width = 128;

cutterSprite.anchor.set(0, 0); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
cutterSprite.interactive = false;
cutterSprite.buttonMode = false;

cutterSprite.x = 400;
cutterSprite.y = 380;

cutterSprite.rotation = 0

// MainContainer.addChild(cutterSprite);

////////////////// Detction area rect for debugging

// const graphics = new PIXI.Graphics();
// // Rectangle
// graphics.beginFill(0xde3249);
// graphics.drawRect(-20, -20, 40, 40);
// graphics.endFill();

// MainContainer.addChild(graphics);

// MainContainer.addChild(cutterSprite);

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

const hintText = new PIXI.Text('Cut it!', style);
hintText.position.set(60, 60);
hintContainer.addChild(hintText);


const numCuttersText = new PIXI.Text('0/9', style);
numCuttersText.position.set(80, 105);
hintContainer.addChild(numCuttersText);


////////////////// Cutter handling

var correctSound = new Audio('../audio/correctSound.mp3');
correctSound.loop = false;
var incorrectSound = new Audio('../audio/incorrectSound.mp3');
incorrectSound.loop = false;

const cutterSprites = [];

function addCutterMaskSprite(x, y) {
  // check if cutter is in dough rect
  if (x > 259 && x < 541 && y > 114 && y <486) {
    // check if cutter is overlapped with any
    var overlap = false;
    
    const tempCutterMaskSprite = new PIXI.Sprite(cutterMaskTexture);

    tempCutterMaskSprite.height = 128
    tempCutterMaskSprite.width = 128

    tempCutterMaskSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

    // need to set the interactive to true to enable event detection on the sprite
    tempCutterMaskSprite.interactive = true;
    tempCutterMaskSprite.buttonMode = false;

    tempCutterMaskSprite.x = x;
    tempCutterMaskSprite.y = y;

    tempCutterMaskSprite.rotation = 0

    for (var cutterMaskSpriteItem of cutterSprites) {
      overlap ||= checkOverlap(tempCutterMaskSprite, cutterMaskSpriteItem)
    }

    if (overlap) {
      incorrectSound.play()
      
    } else {
      // else add new sprite
      maskContainer.addChild(tempCutterMaskSprite)

      const tableBgCutoutSprite = new PIXI.Sprite(tableBGTexture);
      tableBgCutoutSprite.scale.set(0.7, 0.72);
      tableBgCutoutSprite.x = -100;
      tableBgCutoutSprite.y = -90;

      tableBgCutoutSprite.mask = tempCutterMaskSprite
      maskContainer.addChild(tableBgCutoutSprite)

      cutterSprites.push(tempCutterMaskSprite)
      numCutters++;
      console.log(cutterSprites)
    }
    
  }
}

// function to check for intersection between cookie shapes https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#axis-aligned_bounding_box
function checkOverlap(cutter1, cutter2) {
  return (cutter1.x < cutter2.x + 107 &&
    cutter1.x + 107 > cutter2.x &&
    cutter1.y < cutter2.y + cutter2.height &&
    cutter1.height + cutter1.y > cutter2.y) 
}

///////////////////////////////////////////////////////////////////////////


// Listen for animate update
app.ticker.add((delta) => {

  const mouseposition = app.renderer.plugins.interaction.mouse.global;

  if (startAnimation) {
      animationCount++;
      console.log(animationCount)

      if (animationCount > 100) {
          window.location.href = "./bakeCookie.html";
          
      }
  }

  // update cutter position
  cutterSprite.x = mouseposition.x
  cutterSprite.y = mouseposition.y

  numCuttersText.text = String(numCutters) + "/6"

  if (numCutters == 6) {
    startAnimation = true
  }

});

///////////////////////////////////////////////////////////////////////////

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
  fontSize: 40,
  fill: 'black',
  align: "center",
  wordWrap: true,
  wordWrapWidth: 400
})

const titleText = new PIXI.Text('Click to cut out the gingerbread man without overlap!', styleTitle);
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


