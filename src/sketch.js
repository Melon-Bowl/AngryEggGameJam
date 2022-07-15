const text_to_show = `Hey guys, did you know that in terms of male human and female Pokémon breeding, Vaporeon is the most compatible Pokémon for humans? Not only are they in the field egg group, which is mostly comprised of mammals, Vaporeon are an average of 3”03’ tall and 63.9 pounds, this means they’re large enough to be able handle human dicks, and with their impressive Base Stats for HP and access to Acid Armor, you can be rough with one.`;
const text_ui = new TextBox();

// CUSTOM FUNCTIONS
function rollDice() {
  dice_arr = [dice_1, dice_2, dice_3, dice_4, dice_5, dice_6];
  for (let i = 0; i < random(1, 6); i++) {
    image(dice_arr[i], 650, 80, 100, 100);
  }
}

function preload() {
  backgroundImg = loadImage('assets/school.png');
  dice_1 = loadImage('assets/dice_1.png');
  dice_2 = loadImage('assets/dice_2.png');
  dice_3 = loadImage('assets/dice_3.png');
  dice_4 = loadImage('assets/dice_4.png');
  dice_5 = loadImage('assets/dice_5.png');
  dice_6 = loadImage('assets/dice_6.png');
  text_ui.preload();
}

function mouseClicked() {
  text_ui.handle_click();
}

function setup() {
  createCanvas(800, 600);
  text_ui.show_text('Me', text_to_show);
}

function draw() {
  background(backgroundImg);
  text_ui.show();
  image(dice_1, 650, 80, 100, 100);
}
