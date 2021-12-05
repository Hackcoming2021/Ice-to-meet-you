const Application = PIXI.Application;

const app = new Application({
  width: 1000,
  height: 900,
  transparent: false,
  antialias: true
});

app.renderer.backgroundColor = 0xFFFFFF;

app.renderer.resize(window.innerWidth, window.innerHeight);

app.renderer.view.style.position = "absolute";

document.body.appendChild(app.view);

const Graphics = PIXI.Graphics;

const loader = PIXI.Loader.shared;
loader.add('tileset', './image/spritesheet.json')
.load(setup);

function setup(loader, resources) {
  const snowFieldText = PIXI.Texture.from('./image/field.png');
  const snowField = new PIXI.TilingSprite(
    snowFieldText,
    app.screen.width,
    app.screen.height
  );

  snowField.tileScale.set(2,3);
  app.stage.addChild(snowField);

  let score = 0;
  let fastestRX = 3;
  let fastestLX = -3;
  app.ticker.add(delta => loop(delta));
  const textures = [];

  for (let i = 1; i < 9; i++) {
    const texture = PIXI.Texture.from(`elf${i}.png`);
    textures.push(texture);
  }

  const elf = new PIXI.AnimatedSprite(textures);
  const snowball = new PIXI.Texture.from('image/kapow.png');

  elf.position.set(800, 700);
  elf.scale.set(3, 3);
  app.stage.addChild(elf);
  elf.play();
  elf.animationSpeed = 0.1;

  elf.interactive = true;
  elf.on('pointerdown', function() {
    score++;
    elf.visible = false;
    let snowBall = new PIXI.Sprite(snowball);
    snowBall.position.set(elf.x-50, elf.y-50);
    snowBall.scale.set(0.25, 0.25);
    app.stage.addChild(snowBall);
    fastestRX += 7;
    fastestLX -= 7;
    if (xmove > 0) {
      xmove = fastestRX;
    } else {
      xmove = fastestLX;
    }
    window.setTimeout(function() {
      app.stage.removeChild(snowBall);
      elf.visible = true;
      elf.position.set(snowBall.x,snowBall.y);
    }, 1000);
  });

  let ymove = 3;
  let xmove = 3;

  let text = "Your Score is: " + score;
  let myText3 = new PIXI.Text(text);
  myText3.style = new PIXI.TextStyle({
    fill: 0x14ab4d,
    fontSize: 20,
    fontFamily: "Player"
  });
  myText3.x = app.screen.width/2.3;
  myText3.y = 23;
  app.stage.addChild(myText3);

  let myText2 = new PIXI.Text("Hit the Elf 12 Times to get Snowman's Hat!");
  myText2.style = new PIXI.TextStyle({
    fill: 0x0b4904,
    fontSize: 25,
    fontFamily: "Player"
  });
  myText2.x = app.screen.width/4;
  app.stage.addChild(myText2);

  function loop(delta) {
    if (score == 12) {
      window.location.href = "./blank.html";

    }
    text = "Your Score is: " + score;
    myText3.text = text;
    elf.y += ymove;
    elf.x += xmove;
    if (elf.y < 0) {
      ymove = 3;
    } else if (elf.y > app.screen.height-100) {
      ymove = -3;
    }
    if (elf.x < 0) {
      xmove = fastestRX;
    } else if (elf.x > app.screen.width-100) {
      xmove = fastestLX;
    }

  }
  const snowText = PIXI.Texture.from('./image/snow.png');
  const snow = new PIXI.TilingSprite(
    snowText,
    app.screen.width,
    app.screen.height
  );

  snow.tileScale.set(2,3);
  app.ticker.add(function() {
    snow.tilePosition.y += 1;
  });
  app.stage.addChild(snow);

  const sound = new Howl({
    src: ['./sound/bgm.mp3'],
    volume: 0.075
  });

  sound.play();
}
