var ingredientOrderIndex = 0;
var gameStart = false;
var animationCount = 0;
var startAnimation = false;


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
app.renderer.view.style.position = 'absolute';

if ((window.innerWidth > 800) && (window.innerWidth > 600)) {
  var translate = "translate3d( " + String((window.innerWidth - 800) / 2) + "px, " + String((window.innerHeight - 600)/2) + "px, 0)";
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

const butterTexture = PIXI.Texture.from("../images/ingredients/butter.png");
const eggTexture = PIXI.Texture.from("../images/ingredients/egg.png");
const flourTexture = PIXI.Texture.from("../images/ingredients/flour.png");
const gingerTexture = PIXI.Texture.from("../images/ingredients/ginger.png");
const milkTexture = PIXI.Texture.from("../images/ingredients/milk.png");
const oilTexture = PIXI.Texture.from("../images/ingredients/oil.png");
const saltTexture = PIXI.Texture.from("../images/ingredients/salt.png");
const sugarTexture = PIXI.Texture.from("../images/ingredients/sugar.png");


//////////// Add bg
const tableBgSprite = new PIXI.Sprite(tableBGTexture);
tableBgSprite.scale.set(0.60, 0.61);
tableBgSprite.x = 0;
tableBgSprite.y = -9;
MainContainer.addChild(tableBgSprite);

//////////// Create and position sprites in the scene (initial positions)

///// Butter sprite
const butterSprite = new PIXI.Sprite(butterTexture);

butterSprite.scale.x = 0.20;
butterSprite.scale.y = 0.20;

butterSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
butterSprite.interactive = true;
//to make the cursor change on hover over to hint it is clickable
butterSprite.buttonMode = true;

butterSprite
  .on("pointerdown", onDragStart)
  .on("pointerup", onDragEnd)
  .on("pointerupoutside", onDragEnd)
  .on("pointermove", onDragMove);

butterSprite.x = 600;
butterSprite.y = 420;
butterSprite.xOriginal = 600;
butterSprite.yOriginal = 420;

butterSprite.ingredientOrder = 4;

MainContainer.addChild(butterSprite);

///// Egg sprite
const eggSprite = new PIXI.Sprite(eggTexture);

eggSprite.scale.x = 0.20;
eggSprite.scale.y = 0.20;

eggSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
eggSprite.interactive = true;
//to make the cursor change on hover over to hint it is clickable
eggSprite.buttonMode = true;

eggSprite
  .on("pointerdown", onDragStart)
  .on("pointerup", onDragEnd)
  .on("pointerupoutside", onDragEnd)
  .on("pointermove", onDragMove);

eggSprite.x = 70;
eggSprite.y = 400;
eggSprite.xOriginal = 70;
eggSprite.yOriginal = 400;

eggSprite.ingredientOrder = 1;

MainContainer.addChild(eggSprite);

///// Flour sprite
const flourSprite = new PIXI.Sprite(flourTexture);

flourSprite.scale.x = 0.20;
flourSprite.scale.y = 0.20;

flourSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
flourSprite.interactive = true;
//to make the cursor change on hover over to hint it is clickable
flourSprite.buttonMode = true;

flourSprite
  .on("pointerdown", onDragStart)
  .on("pointerup", onDragEnd)
  .on("pointerupoutside", onDragEnd)
  .on("pointermove", onDragMove);

flourSprite.x = 150;
flourSprite.y = 500;
flourSprite.xOriginal = 150;
flourSprite.yOriginal = 500;

flourSprite.ingredientOrder = 3;

MainContainer.addChild(flourSprite);

///// Ginger sprite
const gingerSprite = new PIXI.Sprite(gingerTexture);

gingerSprite.scale.x = 0.20;
gingerSprite.scale.y = 0.20;

gingerSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
gingerSprite.interactive = true;
//to make the cursor change on hover over to hint it is clickable
gingerSprite.buttonMode = true;

gingerSprite
  .on("pointerdown", onDragStart)
  .on("pointerup", onDragEnd)
  .on("pointerupoutside", onDragEnd)
  .on("pointermove", onDragMove);

gingerSprite.x = 230;
gingerSprite.y = 390;
gingerSprite.xOriginal = 230;
gingerSprite.yOriginal = 390;

gingerSprite.ingredientOrder = 5;

MainContainer.addChild(gingerSprite);

///// Milk sprite
const milkSprite = new PIXI.Sprite(milkTexture);

milkSprite.scale.x = 0.20;
milkSprite.scale.y = 0.20;

milkSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
milkSprite.interactive = true;
//to make the cursor change on hover over to hint it is clickable
milkSprite.buttonMode = true;

milkSprite
  .on("pointerdown", onDragStart)
  .on("pointerup", onDragEnd)
  .on("pointerupoutside", onDragEnd)
  .on("pointermove", onDragMove);

milkSprite.x = 700;
milkSprite.y = 350;
milkSprite.xOriginal = 700;
milkSprite.yOriginal = 350;

milkSprite.ingredientOrder = 0;

MainContainer.addChild(milkSprite);


///// Oil sprite
const oilSprite = new PIXI.Sprite(oilTexture);

oilSprite.scale.x = 0.20;
oilSprite.scale.y = 0.20;

oilSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
oilSprite.interactive = true;
//to make the cursor change on hover over to hint it is clickable
oilSprite.buttonMode = true;

oilSprite
  .on("pointerdown", onDragStart)
  .on("pointerup", onDragEnd)
  .on("pointerupoutside", onDragEnd)
  .on("pointermove", onDragMove);

oilSprite.x = 720;
oilSprite.y = 490;
oilSprite.xOriginal = 720;
oilSprite.yOriginal = 490;

oilSprite.ingredientOrder = 0;

MainContainer.addChild(oilSprite);


///// Salt sprite
const saltSprite = new PIXI.Sprite(saltTexture);

saltSprite.scale.x = 0.20;
saltSprite.scale.y = 0.20;

saltSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
saltSprite.interactive = true;
//to make the cursor change on hover over to hint it is clickable
saltSprite.buttonMode = true;

saltSprite
  .on("pointerdown", onDragStart)
  .on("pointerup", onDragEnd)
  .on("pointerupoutside", onDragEnd)
  .on("pointermove", onDragMove);

saltSprite.x = 300;
saltSprite.y = 500;
saltSprite.xOriginal = 300;
saltSprite.yOriginal = 500;

saltSprite.ingredientOrder = 0;

MainContainer.addChild(saltSprite);


///// Sugar sprite
const sugarSprite = new PIXI.Sprite(sugarTexture);

sugarSprite.scale.x = 0.20;
sugarSprite.scale.y = 0.20;

sugarSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
sugarSprite.interactive = true;
//to make the cursor change on hover over to hint it is clickable
sugarSprite.buttonMode = true;

sugarSprite
  .on("pointerdown", onDragStart)
  .on("pointerup", onDragEnd)
  .on("pointerupoutside", onDragEnd)
  .on("pointermove", onDragMove);

sugarSprite.x = 590;
sugarSprite.y = 520;
sugarSprite.xOriginal = 590;
sugarSprite.yOriginal = 520;

sugarSprite.ingredientOrder = 2;

MainContainer.addChild(sugarSprite);

///// Bowl sprite
const bowlSprite = new PIXI.Sprite(bowlTexture);

bowlSprite.scale.x = 0.5;
bowlSprite.scale.y = 0.5;

bowlSprite.x = 420;
bowlSprite.y = 360;

bowlSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
bowlSprite.interactive = false;
bowlSprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

MainContainer.addChild(bowlSprite);


////////////////// Hint object

const blurFilter = new PIXI.filters.BlurFilter();

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

///// hint sprite
const hintSprite = new PIXI.Sprite(eggTexture);

hintSprite.scale.x = 0.15;
hintSprite.scale.y = 0.15;

hintSprite.x = 100;
hintSprite.y = 100;

hintSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite

// need to set the interactive to true to enable event detection on the sprite
hintSprite.interactive = false;
hintSprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

hintContainer.addChild(hintSprite);

hintSprite.filters = [blurFilter]

let counter = 0.5;

app.ticker.add(() => {
  // console.log(counter)
  if (counter < 3) {
    counter += 0.005;
  }

  const blurAmount = Math.cos(counter) / 2 + 0.5;

  blurFilter.blur = 20 * (blurAmount);

  if (startAnimation) {
    animationCount++;
    console.log(animationCount)

    if (animationCount > 100) {
      window.location.href = "./mixIngredients.html";

        
    }
}
});


function updateHint() {
  switch(ingredientOrderIndex) {
    case 0:
      hintSprite.texture = eggTexture;
      hintSprite.texture.update();
      counter = 0.5;
      break;
    case 1:
      hintSprite.texture = sugarTexture;
      counter = 0.5;
      break;
    case 2:
      hintSprite.texture = flourTexture;
      counter = 0.5;
      break;
    case 3:
      hintSprite.texture = butterTexture;
      counter = 0.5;
      break;
    case 4:
      hintSprite.texture = gingerTexture;
      counter = 0.5;
      break;
    default:
      startAnimation = true;
  }
}

////////////////// Detction area rect

// const graphics = new PIXI.Graphics();
// // Rectangle
// graphics.beginFill(0xDE3249);
// graphics.drawRect(335, 240, 170, 145);
// graphics.endFill();

// app.stage.addChild(graphics);

////////////////// Sounds

var correctSound = new Audio('../audio/correctSound.mp3');
correctSound.loop = false;

var incorrectSound = new Audio('../audio/incorrectSound.mp3');
incorrectSound.loop = false;

//////////// Movement options
function onDragStart(event) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  
  // if in the bowl range
  if (this.x >= 335 && this.x <= 505 && this.y >= 240 && this.y <= 385){

    if (this.ingredientOrder == 1 + ingredientOrderIndex) {
      this.visible = false;
      this.interactive = false;

      ingredientOrderIndex++;
      // console.log(ingredientOrderIndex);

      correctSound.play();

      updateHint()
    } else {
      incorrectSound.play();


      this.x = this.xOriginal
      this.y = this.yOriginal
    }
  }
}

function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
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
const style = new PIXI.TextStyle({
  fontFamily: 'Lucida Handwriting',
  fontSize: 48,
  fill: 'black',
  align: "center",
  wordWrap: true,
  wordWrapWidth: 300
})

const hintText = new PIXI.Text('Add the ingredients in order!', style);
hintText.position.set(200, 150);
startContainer.addChild(hintText);

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
