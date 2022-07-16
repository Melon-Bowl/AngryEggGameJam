const text_ui = new TextBox();

const background_files = ['school.png'];
const backgrounds = {};

const characters = [
  new Character('Amogus', {
    neutral: 'assets/characters/amogus.png',
    angry: 'assets/characters/amogus_angry.png'
  }),
  new Character('Gryphon', {
    neutral: 'assets/characters/gryphon.png',
    angry: 'assets/characters/gryphon_angry.png'
  }),
  new Character('Lucy', {
    neutral: 'assets/characters/lucy.png',
    angry: 'assets/characters/lucy_angry.png'
  })
];

const scene_man = new SceneManager({ text_ui, characters, backgrounds });

const die = new DieController();

function preload() {
  for (const bg of background_files) {
    backgrounds[bg] = loadImage('assets/backgrounds/' + bg);
  }

  die.preload();
  text_ui.preload();
  characters.forEach(c => c.preload());
  scene_man.preload();
}

function mouseClicked() {
  text_ui.handle_click();
}

function setup() {
  createCanvas(800, 600);
  scene_man.setup();
}

function draw() {
  scene_man.show();
  die.show();
}
