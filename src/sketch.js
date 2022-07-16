const text_ui = new TextBox();

const background_files = ['school.png'];
const backgrounds = {};

const music = new Tracks();

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
  }),
  new Character('Chad', {
    neutral: 'assets/characters/chad.png'
  })
];

const scene_man = new SceneManager({ text_ui, characters, backgrounds, music });

const die = new DieController();

function preload() {
  for (const bg of background_files) {
    backgrounds[bg] = loadImage('assets/backgrounds/' + bg);
  }

  die.preload();
  text_ui.preload();
  music.preload();
  characters.forEach(c => c.preload());
  scene_man.preload();
}

function mouseClicked() {
  scene_man.handle_click();
  text_ui.handle_click();
}

function setup() {
  createCanvas(800, 600);
  scene_man.setup();
}

function draw() {
  cursor();
  scene_man.show();
  die.show();
}
