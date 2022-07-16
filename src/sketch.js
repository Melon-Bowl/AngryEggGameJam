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
  })
];

const chapters = [
  new Chapter({ text_ui, characters, backgrounds, file: 'src/chapters/1.json' })
];
let current_chapter = 0;

const die = new DieController();

function preload() {
  for (const bg of background_files) {
    backgrounds[bg] = loadImage('assets/backgrounds/' + bg);
  }

  die.preload();
  text_ui.preload();
  characters.forEach(c => c.preload());
  chapters.forEach(c => c.preload());
}

function mouseClicked() {
  text_ui.handle_click();
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  chapters[current_chapter].show();
  die.show();
}
