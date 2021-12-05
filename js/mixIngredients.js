var stirCount = 0;
var stirLeft = true; // to check the last position of the stirrer
var startAnimation = false
var animationCount = 0;

var gameStart = false;

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
const tableBGTexture = PIXI.Texture.from("../images/bgs/table.png");

///// load sprite textures
const bowlTexture = PIXI.Texture.from("../images/ingredients/bowl.png");

const spoonTexture = PIXI.Texture.from("../images/mixer/spoon.png");

//////////// Add bg
const tableBgSprite = new PIXI.Sprite(tableBGTexture);
tableBgSprite.scale.set(0.7, 0.72);
tableBgSprite.x = -100;
tableBgSprite.y = -90;
MainContainer.addChild(tableBgSprite);

//////////// Create and position sprites in the scene (initial positions)

///// Spoon sprite
const spoonSprite = new PIXI.Sprite(spoonTexture);

spoonSprite.scale.x = 0.7;
spoonSprite.scale.y = 0.7;

spoonSprite.anchor.set(0.5, 1); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
spoonSprite.interactive = true;
spoonSprite.buttonMode = false;

spoonSprite.x = 400;
spoonSprite.y = 400;

spoonSprite.rotation = 0

MainContainer.addChild(spoonSprite);

///// Bowl sprite
const bowlSprite = new PIXI.Sprite(bowlTexture);

bowlSprite.scale.x = 0.6;
bowlSprite.scale.y = 0.6;

bowlSprite.x = 400;
bowlSprite.y = 350;

bowlSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
bowlSprite.interactive = false;
bowlSprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

MainContainer.addChild(bowlSprite);

////////////////// Detction area rect for debugging

// const graphics = new PIXI.Graphics();
// // Rectangle
// graphics.beginFill(0xde3249);
// graphics.drawRect(270, 0, 260, 145);
// graphics.endFill();

// MainContainer.addChild(graphics);

// MainContainer.addChild(spoonSprite);

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
    // stroke: '#ffffff',
    // strokeThickness: 4,
})

const hintText = new PIXI.Text('Mix it!', style);
hintText.position.set(60, 60);
hintContainer.addChild(hintText);


const stirCountText = new PIXI.Text('0', style);
stirCountText.position.set(90, 105);
hintContainer.addChild(stirCountText);

////////////////// Mouse trail (https://pixijs.io/examples/#/demos-advanced/mouse-trail.js)

// Get the texture for rope.
const trailTexture = PIXI.Texture.from('../images/mixer/trail.png');

const historyX = [];
const historyY = [];
// historySize determines how long the trail will be.
const historySize = 15;
// ropeSize determines how smooth the trail will be.
const ropeSize = 100;
const points = [];

// Create history array.
for (let i = 0; i < historySize; i++) {
    historyX.push(0);
    historyY.push(0);
}
// Create rope points.
for (let i = 0; i < ropeSize; i++) {
    points.push(new PIXI.Point(0, 0));
}

// Create the rope
const rope = new PIXI.SimpleRope(trailTexture, points);

// Set the blendmode
rope.blendmode = PIXI.BLEND_MODES.ADD;

app.stage.addChild(rope);


var correctSound = new Audio('../audio/correctSound.mp3');
correctSound.loop = false;



// Listen for animate update
app.ticker.add((delta) => {
    // Read mouse points, this could be done also in mousemove/touchmove update. For simplicity it is done here for now.
    // When implementing this properly, make sure to implement touchmove as interaction plugins mouse might not update on certain devices.
    const mouseposition = app.renderer.plugins.interaction.mouse.global;

    // Update the mouse values to history
    historyX.pop();
    historyX.unshift(mouseposition.x);
    historyY.pop();
    historyY.unshift(mouseposition.y);
    // Update the points to correspond with history.
    for (let i = 0; i < ropeSize; i++) {
        const p = points[i];

        // Smooth the curve with cubic interpolation to prevent sharp edges.
        const ix = cubicInterpolation(historyX, i / ropeSize * historySize);
        const iy = cubicInterpolation(historyY, i / ropeSize * historySize);

        p.x = ix;
        p.y = iy;
    }

    if (startAnimation) {
        animationCount++;
        console.log(animationCount)

        if (animationCount > 100) {
            window.location.href = "./rollDough.html";
            
        }
    }

    // Update the spoon stir position
    if (mouseposition.y < 320) {
        // calc angle
        let newRotation = Math.atan(Math.abs(mouseposition.x - 400) / Math.abs(mouseposition.y - 400));
        if (mouseposition.x < 400) {
            newRotation *= -1
        }
        if (newRotation > -0.65 && newRotation < 0.7){
            spoonSprite.rotation = newRotation;

            if(!startAnimation) {
                if (stirLeft) {
                    if (newRotation > 0.45) {
                        stirLeft = false;
                        stirCount++;
                    }
                } else {
                    if (newRotation < -0.45) {
                        stirLeft = true;
                        stirCount++;
                    }
                }
    
                stirCountText.text = String(stirCount);
    
                if (stirCount == 20) {
                    startAnimation = true
                    correctSound.play();
    
                }
            }
            
        }
        // console.log(newRotation)
    }

});

/**
 * Cubic interpolation based on https://github.com/osuushi/Smooth.js
 */
function clipInput(k, arr) {
    if (k < 0) k = 0;
    if (k > arr.length - 1) k = arr.length - 1;
    return arr[k];
}

function getTangent(k, factor, array) {
    return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
}

function cubicInterpolation(array, t, tangentFactor) {
    if (tangentFactor == null) tangentFactor = 1;

    const k = Math.floor(t);
    const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
    const p = [clipInput(k, array), clipInput(k + 1, array)];
    t -= k;
    const t2 = t * t;
    const t3 = t * t2;
    return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}

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
  stirCount = 0
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

const titleText = new PIXI.Text('Mix the ingredients in the bowl!', styleTitle);
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