const store = new StorageManager();
const text_ui = new TextBox();

const background_files = [
  'school.png', 
  'school_building.jpg', 
  'staff_room.jpg', 
  'cafeteria.jpg', 
  'sports_hall.jpg', 
  'storage.jpg',
  'hallway.jpg',
  'candles.jpg',
  'graveyard.jpg'
];
const backgrounds = {};

const music = new Tracks();
const boomer = new BoomController({ music });

const characters = [
  new Character('Amogus', {
    neutral: 'assets/characters/amogus.png',
    angry: 'assets/characters/amogus_angry.png'
  }),
  new Character('Gryphon', {
    neutral: 'assets/characters/gryphon.png',
    angry: 'assets/characters/gryphon_angry.png',
    smol: 'assets/characters/gryphon_smol.png'
  }),
  new Character('Lucy', {
    neutral: 'assets/characters/lucy.png',
    angry: 'assets/characters/lucy_angry.png',
    smol: 'assets/characters/lucy_smol.png'
  }),
  new Character('Chad', {
    neutral: 'assets/characters/chad.png'
  })
];

const scene_man = new SceneManager({
  text_ui,
  characters,
  backgrounds,
  music,
  boomer,
  store
});

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
  boomer.preload();
}

function mouseClicked() {
  scene_man.handle_click();
  text_ui.handle_click();
}

function setup() {
  const cnv = createCanvas(800, 600);
  boomer.set_canvas(cnv);
  scene_man.setup();
}

function draw() {
  cursor();
  scene_man.show();
  die.show();
  store.show();
}
