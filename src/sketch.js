const text_ui = new TextBox();
const characters = [
  new Character('Amogus', {
    neutral: 'assets/characters/amogus.png',
    angry: 'assets/characters/chad.png'
  }),
  new Character('Gryphon', { neutral: 'assets/characters/gryphon.png' })
];
const chapters = [
  new Chapter({ text_ui, characters, file: 'src/chapters/1.json' })
];
let current_chapter = 0;

// CUSTOM FUNCTIONS
function rollDice() {
  dice_arr = [dice_1, dice_2, dice_3, dice_4, dice_5, dice_6];
  for (let i = 0; i < random(1, 6); i++) {
    image(dice_arr[i], 650, 80, 100, 100);
  }
}

function preload() {
  backgroundImg = loadImage('assets/school.png');
  dice_1 = loadImage('assets/dice/1.png');
  dice_2 = loadImage('assets/dice/2.png');
  dice_3 = loadImage('assets/dice/3.png');
  dice_4 = loadImage('assets/dice/4.png');
  dice_5 = loadImage('assets/dice/5.png');
  dice_6 = loadImage('assets/dice/6.png');
  text_ui.preload();
  characters.forEach(c => c.preload());
  chapters.forEach(c => c.preload());
}

function mouseClicked() {
  text_ui.handle_click();
}

function setup() {
  createCanvas(800, 600);
  // chapters[current_chapter].start();
}

function draw() {
  background(backgroundImg);
  chapters[current_chapter].show();
  image(dice_1, 720, 10, 70, 70);
}
