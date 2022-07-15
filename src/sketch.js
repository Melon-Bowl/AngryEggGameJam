const text_to_show = `Hey guys, did you know that in terms of male human and female Pokémon breeding, Vaporeon is the most compatible Pokémon for humans? Not only are they in the field egg group, which is mostly comprised of mammals, Vaporeon are an average of 3”03’ tall and 63.9 pounds, this means they’re large enough to be able handle human dicks, and with their impressive Base Stats for HP and access to Acid Armor, you can be rough with one.`;
const text_ui = new TextBox();

function mouseClicked() {
  text_ui.handle_click();
}

function preload() {
  text_ui.preload();
}

function setup() {
  createCanvas(800, 600);
  text_ui.show_text('Me', text_to_show);
}

function draw() {
  background(220);
  text_ui.show();
}
