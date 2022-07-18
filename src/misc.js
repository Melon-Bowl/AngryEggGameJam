const timeout = time => new Promise(resolve => setTimeout(resolve, time));

const credits_text = `
Main menu theme:
"Newer Wave" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Chapter 1 theme:
"Aerosol of my Love" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Chapter 2 theme:
"Zap Beat" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Someone blows up theme:
"Flying Kerfuffle" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Bad ending theme:
"Burnt Spirit" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Secret ending 2 theme:
"SCP-x2x (Unseen Presence)" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Good ending theme:
"Angel Share" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Bug facts:
https://facts.net/bug-facts/
`.split('\n');

const GAME_VERSION = '1.0.0';
