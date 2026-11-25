// EvenPlay translations. The site is written in English; this layer translates what's shown and spoken
// into the player's chosen language. Anything without a translation stays in English.
// Translations: Spanish and Vietnamese, written by Claude. Native speakers are welcome to suggest fixes.
export const LANGS = { en: "English", es: "Español", vi: "Tiếng Việt" };

function pick() {
  try { const s = localStorage.getItem("ep-lang"); if (LANGS[s]) return s; } catch (e) {}
  const n = (navigator.language || "en").toLowerCase();
  return n.startsWith("es") ? "es" : n.startsWith("vi") ? "vi" : "en";
}
export const lang = pick();
export function setLang(l) { try { localStorage.setItem("ep-lang", l); } catch (e) {} location.reload(); }

// ---------- whole strings ----------
const ES = {
  // site
  "Home": "Inicio", "How it works": "Cómo funciona", "Leaderboards": "Clasificaciones", "About": "Acerca de",
  "Install EvenPlay as an app": "Instalar EvenPlay como app", "Pick a game": "Elige un juego",
  "Free card and dice games for two. Play a friend, find someone new, or take on the computer.": "Juegos de cartas y dados gratis para dos. Juega con un amigo, encuentra a alguien nuevo o enfréntate a la computadora.",
  "Match the top card by color or number. Skips, reverses, draw twos and wilds.": "Iguala la carta de arriba por color o número. Saltos, reversas, roba dos y comodines.",
  "2 players. Quick rounds.": "2 jugadores. Rondas rápidas.",
  "Change one letter at a time to make a new four-letter word. Take turns, or race for points.": "Cambia una letra a la vez para formar una nueva palabra de cuatro letras (en inglés). Por turnos o a la carrera por puntos.",
  "2 players. For word lovers.": "2 jugadores. Para amantes de las palabras (en inglés).",
  "The classic: build sets and runs, add to the table, and go out first. Play to 100.": "El clásico: forma tríos y escaleras, añade a la mesa y quédate sin cartas primero. Se juega a 100.",
  "2 players. Classic deck.": "2 jugadores. Baraja clásica.",
  "Collect property sets, charge rent, swipe and swap. First to three full sets wins.": "Reúne grupos de propiedades, cobra alquiler, roba e intercambia. Gana quien complete tres grupos primero.",
  "2 players. A bit of strategy.": "2 jugadores. Algo de estrategia.",
  "Roll five dice up to three times, hold the ones you like, and fill your scorecard. Chase Five of a Kind.": "Tira cinco dados hasta tres veces, guarda los que quieras y llena tu hoja de puntos. Busca el Cinco iguales.",
  "2 players. Dice and a bit of luck.": "2 jugadores. Dados y algo de suerte.",
  "Guess the most popular answers to survey questions. Face off, take control, and steal on three strikes.": "Adivina las respuestas más populares de una encuesta (en inglés). Cara a cara, toma el control y roba tras tres errores.",
  "2 players. Quick thinking.": "2 jugadores. Pensamiento rápido.",
  "Roll your dice and claim six casinos full of cash. Tie your rival at a casino and neither of you gets paid.": "Tira tus dados y reclama seis casinos llenos de dinero. Si empatas con tu rival en un casino, nadie cobra.",
  "2 players. Fast and sneaky.": "2 jugadores. Rápido y astuto.",
  "Play Color Clash": "Jugar Color Clash", "Play Letter Flip": "Jugar Letter Flip", "Play Rummy": "Jugar Rummy", "Play Deal Rush": "Jugar Deal Rush",
  "Play Dice Dash": "Jugar Dice Dash", "Play Survey Showdown": "Jugar Survey Showdown", "Play High Rollers": "Jugar High Rollers",
  "1 player waiting for a game now": "1 jugador esperando partida ahora",
  "EvenPlay, made by smoovgunner with Claude.": "EvenPlay, hecho por smoovgunner con Claude.",
  "Language": "Idioma",
  // how it works
  "How EvenPlay works": "Cómo funciona EvenPlay", "Playing": "Jugar", "How": "Cómo funciona", "Play works": "Play", "Play Leaderboards": "Play: clasificaciones",
  "No accounts, no downloads.": "Sin cuentas ni descargas.",
  "Open a game, create a table, and share the code or invite link. Your partner types the code and you're playing.": "Abre un juego, crea una mesa y comparte el código o el enlace de invitación. Tu compañero escribe el código y a jugar.",
  "Play someone new.": "Juega con alguien nuevo.",
  "Every game has a Play someone new button. It matches you with another player who's waiting, or opens a table and plays a chime when someone joins. The home page shows when players are waiting.": "Cada juego tiene un botón Jugar con alguien nuevo. Te empareja con otro jugador que esté esperando, o abre una mesa y suena un aviso cuando alguien se une. La página de inicio muestra cuándo hay jugadores esperando.",
  "Practice": "Practica",
  "against the computer in every game. The computer plays under a name, and it's always marked as the computer.": "contra la computadora en todos los juegos. La computadora juega con un nombre y siempre se indica que es la computadora.",
  "Everyone plays.": "Todos juegan.",
  "Real cards and dice on screen, and full screen reader support: every card, die and move is announced, and each part of the table has its own heading. Tested with NVDA and VoiceOver.": "Cartas y dados reales en pantalla y compatibilidad total con lectores de pantalla: cada carta, dado y jugada se anuncia, y cada parte de la mesa tiene su propio encabezado. Probado con NVDA y VoiceOver.",
  "Sound effects": "Efectos de sonido",
  "for every move, with a Sound button at the top of each game to turn them off.": "en cada jugada, con un botón de sonido arriba en cada juego para apagarlos.",
  "Phones and computers.": "Teléfonos y computadoras.",
  "iPhone, Android, Windows or Mac, in any modern browser.": "iPhone, Android, Windows o Mac, en cualquier navegador moderno.",
  "Install it like an app.": "Instálalo como una app.",
  "On Android or Windows, open EvenPlay in Chrome or Edge and choose Install EvenPlay as an app on the home page (or Install app in the browser menu). On iPhone, open it in Safari, choose Share, then Add to Home Screen. It gets its own icon and opens full screen.": "En Android o Windows, abre EvenPlay en Chrome o Edge y elige Instalar EvenPlay como app en la página de inicio (o Instalar app en el menú del navegador). En iPhone, ábrelo en Safari, elige Compartir y luego Añadir a pantalla de inicio. Tendrá su propio icono y se abrirá en pantalla completa.",
  "Each game has its own rules under": "Cada juego tiene sus propias reglas en", "How to play": "Cómo se juega", ", at the bottom of the game's page.": ", al final de la página del juego.",
  "Every game has two top-five lists:": "Cada juego tiene dos listas de los cinco mejores:", "most games won overall": "más partidas ganadas en total", ", and": " y", "most games won in a row": "más partidas ganadas seguidas",
  "Only games against other players count. Practice games against the computer don't.": "Solo cuentan las partidas contra otros jugadores. Las de práctica contra la computadora no.",
  "Leaving a game in progress counts as a loss. Playing against yourself doesn't count.": "Abandonar una partida en curso cuenta como derrota. Jugar contra ti mismo no cuenta.",
  "Your": "Tu", "player code": "código de jugador",
  "is how the leaderboards know it's you, with no account. Find it at the bottom of the Leaderboards page, and type it on another phone or computer to keep your wins there.": "es cómo las clasificaciones saben que eres tú, sin cuenta. Lo encuentras al final de la página de Clasificaciones; escríbelo en otro teléfono o computadora para conservar allí tus victorias.",
  // about
  "About EvenPlay": "Acerca de EvenPlay", "Games for everyone": "Juegos para todos", "Who made it": "Quién lo hizo",
  "EvenPlay is a free site of card and dice games for two. No accounts and no downloads. Play a friend with a game code, find someone new, or practice against the computer, on a phone or a computer.": "EvenPlay es un sitio gratuito de juegos de cartas y dados para dos. Sin cuentas ni descargas. Juega con un amigo usando un código, encuentra a alguien nuevo o practica contra la computadora, en el teléfono o en la computadora.",
  "Every game is built so everyone gets the same seat at the table. You see real cards and dice. If you use a screen reader, every card, die and move is spoken. Blind and sighted players can sit down together and play on even terms. That's where the name comes from.": "Cada juego está hecho para que todos tengan el mismo lugar en la mesa. Ves cartas y dados reales. Si usas un lector de pantalla, cada carta, dado y jugada se lee en voz alta. Jugadores ciegos y videntes pueden sentarse juntos y jugar en igualdad. De ahí viene el nombre.",
  "EvenPlay was created by": "EvenPlay fue creado por", ", a blind gamer who wanted games he could share with anyone, and built with": ", un jugador ciego que quería juegos para compartir con cualquiera, y construido con",
  ", an AI from Anthropic. Every game was tested by real players, with screen readers and without.": ", una IA de Anthropic. Cada juego fue probado por jugadores reales, con y sin lectores de pantalla.",
  // leaderboards
  "EvenPlay Leaderboards": "Clasificaciones de EvenPlay", "Choose a game": "Elige un juego", "Most games won overall": "Más partidas ganadas en total",
  "Most games won in a row": "Más partidas ganadas seguidas", "No winners yet. Be the first!": "Aún no hay ganadores. ¡Sé el primero!",
  "Your player code": "Tu código de jugador", "Your code:": "Tu código:",
  "This code is how the leaderboards know it's you. Keep it private. To keep your wins on another phone or computer, type this code there.": "Este código es cómo las clasificaciones saben que eres tú. Mantenlo en privado. Para conservar tus victorias en otro teléfono o computadora, escribe allí este código.",
  "Use a player code from another device": "Usar un código de jugador de otro dispositivo", "Use this code": "Usar este código", "Copy my code": "Copiar mi código",
  "12 letters and numbers": "12 letras y números", "Your code is copied.": "Tu código está copiado.",
  "Couldn't load the leaderboard. Check your connection and reload.": "No se pudo cargar la clasificación. Revisa tu conexión y recarga.",
  "A player code is 12 letters and numbers, like the one shown above.": "Un código de jugador tiene 12 letras y números, como el de arriba.",
  // shared game shell
  "Sound on": "Sonido activado", "Sound off": "Sonido desactivado", "More games:": "Más juegos:", "Play": "Jugar",
  "Your name": "Tu nombre", "Shown to the other player": "Lo verá el otro jugador", "Create a new game": "Crear una partida nueva",
  "Game code from your partner": "Código de partida de tu compañero", "For example TIGER42": "Por ejemplo TIGER42", "Join game": "Unirse",
  "Play someone new": "Jugar con alguien nuevo", "Practice against the computer": "Practicar contra la computadora",
  "Game code": "Código de partida", "Share this code with your partner. They open this site, type the code, and join.": "Comparte este código con tu compañero. Abre este sitio, escribe el código y se une.",
  "Send invite": "Enviar invitación", "Copy invite link": "Copiar enlace de invitación", "Invite link copied.": "Enlace de invitación copiado.",
  "Players": "Jugadores", "Waiting for a player": "Esperando a un jugador", "Open seat": "Asiento libre", "Connected": "Conectado", "Not connected right now": "Sin conexión ahora",
  "You": "Tú", "Leave game": "Salir de la partida", "Leave practice": "Salir de la práctica", "Recent moves": "Jugadas recientes", "Left the game.": "Saliste de la partida.",
  "Making a new game…": "Creando una partida nueva…", "Looking for a player…": "Buscando un jugador…", "Setting up a game against the computer…": "Preparando una partida contra la computadora…",
  "Setting up your game…": "Preparando tu partida…", "Connection lost. Reconnecting…": "Conexión perdida. Reconectando…", "Connection lost. Reconnecting.": "Conexión perdida. Reconectando.",
  "Not connected right now. Trying to reconnect.": "Sin conexión ahora. Intentando reconectar.",
  "Couldn't reach the game server. Check your internet connection and try again.": "No se pudo contactar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.",
  "Type the game code your partner gave you, like TIGER42.": "Escribe el código que te dio tu compañero, como TIGER42.",
  "This game already has two players. You can watch, but not play.": "Esta partida ya tiene dos jugadores. Puedes mirar, pero no jugar.",
  "Looking for another player. Stay on this page: you'll hear a chime when someone joins. Or leave and practice against the computer.": "Buscando otro jugador. Quédate en esta página: oirás un aviso cuando alguien se una. O sal y practica contra la computadora.",
  "Start the game when you're ready.": "Empieza la partida cuando quieras.", "They'll start the game.": "Esa persona empezará la partida.",
  "Quick chat": "Chat rápido", "Good luck!": "¡Buena suerte!", "Good game!": "¡Buena partida!", "Nice move!": "¡Buena jugada!", "Thanks!": "¡Gracias!",
  "Oops!": "¡Uy!", "Wow!": "¡Guau!", "Rematch?": "¿Revancha?", "Take your time.": "Tómate tu tiempo.", "Be right back.": "Ya vuelvo.",
  "Turn quick chat off": "Desactivar chat rápido", "Turn quick chat on": "Activar chat rápido", "Quick chat on.": "Chat rápido activado.",
  "Quick chat off. You won't see or hear messages.": "Chat rápido desactivado. No verás ni oirás mensajes.",
  "Wait a moment before sending another message.": "Espera un momento antes de enviar otro mensaje.",
  "Your partner": "Tu compañero", "The computer": "La computadora", "Player": "Jugador", "Cancel": "Cancelar",
  // Color Clash
  "Opponent": "Rival", "Table": "Mesa", "Your hand": "Tu mano", "Choose the next color": "Elige el siguiente color",
  "Red": "Rojo", "Yellow": "Amarillo", "Green": "Verde", "Blue": "Azul",
  "Deal the cards": "Repartir", "Deal next round": "Repartir la siguiente ronda", "Draw a card": "Robar una carta", "Draw (already drew)": "Robar (ya robaste)", "Pass": "Pasar",
  "No cards.": "Sin cartas.", "You played your last card!": "¡Jugaste tu última carta!",
  "Both players are here. Deal the cards to start.": "Los dos jugadores están aquí. Reparte para empezar.",
  "Your turn.": "Tu turno.", "Your turn is over.": "Tu turno terminó.", "You win the round!": "¡Ganas la ronda!", "Deal the next round when you're ready.": "Reparte la siguiente ronda cuando quieras.",
  "You can play it, or pass.": "Puedes jugarla o pasar.", "It doesn't fit, so your turn is over.": "No sirve, así que tu turno terminó.",
  "Play the card you drew, or pass.": "Juega la carta que robaste o pasa.",
  "That card can't be played right now.": "Esa carta no se puede jugar ahora.", "It's not your turn.": "No es tu turno.",
  "You already drew this turn. Play that card or pass.": "Ya robaste en este turno. Juega esa carta o pasa.",
  "Choose a color for the wild card.": "Elige un color para el comodín.",
  "Stacking off.": "Apilar desactivado.", "Draw wars off.": "Guerras de robo desactivadas.",
  "Stacking on: play all your cards of the same number or symbol at once.": "Apilar activado: juega a la vez todas tus cartas del mismo número o símbolo.",
  "Draw wars on: answer a Draw Two with a Draw Two, or a Wild Draw Four with a Wild Draw Four.": "Guerras de robo activadas: responde a un Roba dos con un Roba dos, o a un Comodín roba cuatro con otro.",
  "One player creates a game and shares the code. The other types the code to join.": "Un jugador crea la partida y comparte el código. El otro escribe el código para unirse.",
  "Match the top card by color or by number or symbol.": "Iguala la carta de arriba por color, número o símbolo.",
  "Wild cards can be played on anything. You pick the next color.": "Los comodines se pueden jugar sobre cualquier carta. Tú eliges el siguiente color.",
  "Skip and Reverse: with two players, you go again.": "Salta y Reversa: con dos jugadores, vuelves a jugar.",
  "Draw Two and Wild Draw Four: your opponent draws, and you go again.": "Roba dos y Comodín roba cuatro: tu rival roba y tú vuelves a jugar.",
  "Can't play? Draw a card. If it fits you may play it, or pass.": "¿No puedes jugar? Roba una carta. Si sirve, puedes jugarla o pasar.",
  "First to empty their hand wins the round.": "Gana la ronda quien se quede sin cartas primero.",
  "House rules (optional, switch each on before dealing). Stacking: play all your cards with the same number or symbol in one turn, like three 3s at once. Draw wars: when a Draw Two is played on you, answer with your own Draw Two to pass the cards back, and the same with Wild Draw Fours. A Draw Two war takes only Draw Twos, and a Wild Draw Four war takes only Wild Draw Fours. The first player who can't answer takes them all and loses their turn.": "Reglas de la casa (opcionales; actívalas antes de repartir). Apilar: juega en un turno todas tus cartas del mismo número o símbolo, como tres 3 a la vez. Guerras de robo: cuando te juegan un Roba dos, responde con tu propio Roba dos para devolver las cartas, y lo mismo con los Comodín roba cuatro. Una guerra de Roba dos solo admite Roba dos, y una de Comodín roba cuatro solo admite Comodín roba cuatro. El primero que no pueda responder se lleva todas y pierde su turno.",
  "Screen reader tip: each card is a button. Cards you can't play right now say \"can't play\". Every move is announced, and each part of the table has its own heading.": "Consejo para lectores de pantalla: cada carta es un botón. Las que no puedes jugar ahora dicen \"no se puede jugar\". Cada jugada se anuncia y cada parte de la mesa tiene su propio encabezado.",
  "Sound effects play for each move, and a chime plays when it's your turn. The Sound button at the top turns them off.": "Hay efectos de sonido en cada jugada y un aviso cuando es tu turno. El botón de sonido de arriba los apaga.",
  "Color Clash is an": "Color Clash es un juego de", "game.": ".",
  // High Rollers
  "Start the game": "Empezar la partida",
  "Play again": "Jugar otra vez",
  "Your turn.": "Tu turno.",
  "Roll the dice": "Tirar los dados",
  "Both players are here. Start the game when you're ready.": "Los dos jugadores están aquí. Empieza la partida cuando quieras.",
  "Six casinos, numbered 1 to 6. Each round, every casino gets cash bills until it holds at least $50,000. Each bill is a separate prize: the biggest is 1st place, the next is 2nd place, and so on. They are not added together.": "Seis casinos, numerados del 1 al 6. En cada ronda, cada casino recibe billetes hasta tener al menos $50,000. Cada billete es un premio aparte: el más grande es el 1.er puesto, el siguiente el 2.º, y así. No se suman.",
  "Each player has 8 dice in their color, plus 4 white house dice. On your turn, roll all the dice you have left. Then pick one number you rolled and place every die showing that number, yours and white, on the casino with that number.": "Cada jugador tiene 8 dados de su color, más 4 dados blancos de la casa. En tu turno, tira todos los dados que te queden. Luego elige un número que hayas sacado y coloca todos los dados con ese número, tuyos y blancos, en el casino de ese número.",
  "Take turns until all dice are placed. If your partner runs out first, you keep going.": "Se juega por turnos hasta colocar todos los dados. Si tu compañero se queda sin dados primero, tú sigues.",
  "Payout: at each casino, whoever has the most dice takes the biggest bill, the next most takes the next bill, and so on. The white house dice count as a third player; money they win leaves the game.": "Pagos: en cada casino, quien tiene más dados se lleva el billete más grande, el siguiente se lleva el siguiente billete, y así. Los dados blancos de la casa cuentan como un tercer jugador; el dinero que ganan sale del juego.",
  "The twist: players who tie at a casino win nothing there, and the next player in line moves up. Use it to knock your rival out.": "El giro: los jugadores que empatan en un casino no ganan nada allí, y el siguiente sube. Úsalo para dejar fuera a tu rival.",
  "After 4 rounds, the most money wins. A tie goes to whoever has more bills.": "Tras 4 rondas, gana quien tenga más dinero. En caso de empate, gana quien tenga más billetes.",
  "Screen reader tip: after you roll, the Your roll section has one button per number, saying how many dice it places and what that casino holds. The Casinos section lists every casino's cash, dice and current leader.": "Consejo para lectores de pantalla: después de tirar, la sección Tu tirada tiene un botón por número, que dice cuántos dados coloca y qué tiene ese casino. La sección Casinos indica el dinero, los dados y quién va ganando en cada casino.",
  "High Rollers is an": "High Rollers es un juego de",
  "Casinos": "Casinos",
  "Money": "Dinero",
  "House": "Casa",
};

const VI = {
  "Home": "Trang chủ", "How it works": "Cách chơi", "Leaderboards": "Bảng xếp hạng", "About": "Giới thiệu",
  "Install EvenPlay as an app": "Cài EvenPlay như một ứng dụng", "Pick a game": "Chọn trò chơi",
  "Free card and dice games for two. Play a friend, find someone new, or take on the computer.": "Trò chơi bài và xúc xắc miễn phí cho hai người. Chơi với bạn bè, tìm người mới, hoặc đấu với máy.",
  "Match the top card by color or number. Skips, reverses, draw twos and wilds.": "Đánh lá bài cùng màu hoặc cùng số với lá trên cùng. Có Mất lượt, Đổi chiều, Rút hai và Đổi màu.",
  "2 players. Quick rounds.": "2 người chơi. Ván nhanh.",
  "Change one letter at a time to make a new four-letter word. Take turns, or race for points.": "Đổi từng chữ cái để tạo một từ tiếng Anh bốn chữ mới. Chơi lần lượt hoặc đua điểm.",
  "2 players. For word lovers.": "2 người chơi. Dành cho người yêu chữ (tiếng Anh).",
  "The classic: build sets and runs, add to the table, and go out first. Play to 100.": "Trò cổ điển: xếp bộ và dây, gửi bài lên bàn, và hết bài trước. Chơi đến 100 điểm.",
  "2 players. Classic deck.": "2 người chơi. Bộ bài tây.",
  "Collect property sets, charge rent, swipe and swap. First to three full sets wins.": "Gom bộ bất động sản, thu tiền thuê, cướp và đổi. Ai đủ ba bộ trước sẽ thắng.",
  "2 players. A bit of strategy.": "2 người chơi. Cần chút chiến thuật.",
  "Roll five dice up to three times, hold the ones you like, and fill your scorecard. Chase Five of a Kind.": "Gieo năm xúc xắc tối đa ba lần, giữ những viên bạn thích và điền bảng điểm. Săn Năm viên giống nhau.",
  "2 players. Dice and a bit of luck.": "2 người chơi. Xúc xắc và chút may mắn.",
  "Guess the most popular answers to survey questions. Face off, take control, and steal on three strikes.": "Đoán những câu trả lời phổ biến nhất trong khảo sát (tiếng Anh). Đối đầu, giành quyền, và cướp điểm sau ba lần sai.",
  "2 players. Quick thinking.": "2 người chơi. Nghĩ nhanh.",
  "Roll your dice and claim six casinos full of cash. Tie your rival at a casino and neither of you gets paid.": "Gieo xúc xắc và giành sáu sòng bạc đầy tiền. Hòa với đối thủ ở sòng nào thì không ai được trả tiền ở đó.",
  "2 players. Fast and sneaky.": "2 người chơi. Nhanh và mưu mẹo.",
  "Play Color Clash": "Chơi Color Clash", "Play Letter Flip": "Chơi Letter Flip", "Play Rummy": "Chơi Rummy", "Play Deal Rush": "Chơi Deal Rush",
  "Play Dice Dash": "Chơi Dice Dash", "Play Survey Showdown": "Chơi Survey Showdown", "Play High Rollers": "Chơi High Rollers",
  "1 player waiting for a game now": "1 người đang chờ chơi",
  "EvenPlay, made by smoovgunner with Claude.": "EvenPlay, do smoovgunner làm cùng Claude.",
  "Language": "Ngôn ngữ",
  "How EvenPlay works": "EvenPlay hoạt động thế nào", "Playing": "Cách chơi", "How": "", "Play works": "Play hoạt động thế nào", "Play Leaderboards": "Play: bảng xếp hạng",
  "No accounts, no downloads.": "Không cần tài khoản, không cần tải về.",
  "Open a game, create a table, and share the code or invite link. Your partner types the code and you're playing.": "Mở một trò chơi, tạo bàn, rồi chia sẻ mã hoặc đường dẫn mời. Bạn chơi cùng nhập mã là bắt đầu.",
  "Play someone new.": "Chơi với người mới.",
  "Every game has a Play someone new button. It matches you with another player who's waiting, or opens a table and plays a chime when someone joins. The home page shows when players are waiting.": "Mỗi trò chơi có nút Chơi với người mới. Nút này ghép bạn với người đang chờ, hoặc mở bàn và báo chuông khi có người vào. Trang chủ cho biết khi nào có người đang chờ.",
  "Practice": "Luyện tập",
  "against the computer in every game. The computer plays under a name, and it's always marked as the computer.": "với máy trong mọi trò chơi. Máy chơi dưới một cái tên và luôn được ghi rõ là máy.",
  "Everyone plays.": "Ai cũng chơi được.",
  "Real cards and dice on screen, and full screen reader support: every card, die and move is announced, and each part of the table has its own heading. Tested with NVDA and VoiceOver.": "Bài và xúc xắc thật trên màn hình, hỗ trợ đầy đủ trình đọc màn hình: mọi lá bài, viên xúc xắc và nước đi đều được đọc, mỗi phần của bàn có tiêu đề riêng. Đã thử với NVDA và VoiceOver.",
  "Sound effects": "Hiệu ứng âm thanh", "for every move, with a Sound button at the top of each game to turn them off.": "cho mỗi nước đi, có nút Âm thanh ở đầu mỗi trò chơi để tắt.",
  "Phones and computers.": "Điện thoại và máy tính.", "iPhone, Android, Windows or Mac, in any modern browser.": "iPhone, Android, Windows hoặc Mac, trên mọi trình duyệt hiện đại.",
  "Install it like an app.": "Cài như một ứng dụng.",
  "On Android or Windows, open EvenPlay in Chrome or Edge and choose Install EvenPlay as an app on the home page (or Install app in the browser menu). On iPhone, open it in Safari, choose Share, then Add to Home Screen. It gets its own icon and opens full screen.": "Trên Android hoặc Windows, mở EvenPlay bằng Chrome hoặc Edge và chọn Cài EvenPlay như một ứng dụng ở trang chủ (hoặc Cài ứng dụng trong menu trình duyệt). Trên iPhone, mở bằng Safari, chọn Chia sẻ, rồi Thêm vào Màn hình chính. Ứng dụng có biểu tượng riêng và mở toàn màn hình.",
  "Each game has its own rules under": "Mỗi trò chơi có luật riêng ở mục", "How to play": "Cách chơi", ", at the bottom of the game's page.": ", cuối trang của trò chơi.",
  "Every game has two top-five lists:": "Mỗi trò chơi có hai danh sách năm người đứng đầu:", "most games won overall": "thắng nhiều ván nhất", ", and": " và", "most games won in a row": "thắng nhiều ván liên tiếp nhất",
  "Only games against other players count. Practice games against the computer don't.": "Chỉ tính các ván đấu với người khác. Ván luyện tập với máy không được tính.",
  "Leaving a game in progress counts as a loss. Playing against yourself doesn't count.": "Bỏ ngang ván đang chơi bị tính là thua. Tự chơi với chính mình không được tính.",
  "Your": "", "player code": "Mã người chơi của bạn",
  "is how the leaderboards know it's you, with no account. Find it at the bottom of the Leaderboards page, and type it on another phone or computer to keep your wins there.": "là cách bảng xếp hạng nhận ra bạn mà không cần tài khoản. Mã nằm cuối trang Bảng xếp hạng; nhập mã trên điện thoại hoặc máy tính khác để giữ số trận thắng.",
  "About EvenPlay": "Giới thiệu EvenPlay", "Games for everyone": "Trò chơi cho mọi người", "Who made it": "Ai làm ra",
  "EvenPlay is a free site of card and dice games for two. No accounts and no downloads. Play a friend with a game code, find someone new, or practice against the computer, on a phone or a computer.": "EvenPlay là trang trò chơi bài và xúc xắc miễn phí cho hai người. Không cần tài khoản, không cần tải về. Chơi với bạn bằng mã, tìm người mới, hoặc luyện tập với máy, trên điện thoại hay máy tính.",
  "Every game is built so everyone gets the same seat at the table. You see real cards and dice. If you use a screen reader, every card, die and move is spoken. Blind and sighted players can sit down together and play on even terms. That's where the name comes from.": "Mỗi trò chơi được làm để ai cũng có chỗ ngồi như nhau. Bạn thấy bài và xúc xắc thật. Nếu dùng trình đọc màn hình, mọi lá bài, viên xúc xắc và nước đi đều được đọc. Người khiếm thị và người sáng mắt có thể ngồi cùng bàn và chơi ngang hàng. Tên gọi EvenPlay bắt nguồn từ đó.",
  "EvenPlay was created by": "EvenPlay được tạo bởi", ", a blind gamer who wanted games he could share with anyone, and built with": ", một game thủ khiếm thị muốn có trò chơi để chơi cùng bất kỳ ai, và được xây dựng cùng",
  ", an AI from Anthropic. Every game was tested by real players, with screen readers and without.": ", một AI của Anthropic. Mọi trò chơi đều được người chơi thật thử, có và không có trình đọc màn hình.",
  "EvenPlay Leaderboards": "Bảng xếp hạng EvenPlay", "Choose a game": "Chọn trò chơi", "Most games won overall": "Thắng nhiều ván nhất",
  "Most games won in a row": "Thắng nhiều ván liên tiếp nhất", "No winners yet. Be the first!": "Chưa có ai thắng. Hãy là người đầu tiên!",
  "Your player code": "Mã người chơi của bạn", "Your code:": "Mã của bạn:",
  "This code is how the leaderboards know it's you. Keep it private. To keep your wins on another phone or computer, type this code there.": "Mã này giúp bảng xếp hạng nhận ra bạn. Hãy giữ kín. Để giữ số trận thắng trên điện thoại hoặc máy tính khác, hãy nhập mã này ở đó.",
  "Use a player code from another device": "Dùng mã người chơi từ thiết bị khác", "Use this code": "Dùng mã này", "Copy my code": "Sao chép mã của tôi",
  "12 letters and numbers": "12 chữ và số", "Your code is copied.": "Đã sao chép mã của bạn.",
  "Couldn't load the leaderboard. Check your connection and reload.": "Không tải được bảng xếp hạng. Kiểm tra kết nối rồi tải lại.",
  "A player code is 12 letters and numbers, like the one shown above.": "Mã người chơi gồm 12 chữ và số, giống mã ở trên.",
  "Sound on": "Bật âm thanh", "Sound off": "Tắt âm thanh", "More games:": "Trò chơi khác:", "Play": "Chơi",
  "Your name": "Tên của bạn", "Shown to the other player": "Người chơi kia sẽ thấy", "Create a new game": "Tạo ván mới",
  "Game code from your partner": "Mã ván từ bạn chơi", "For example TIGER42": "Ví dụ TIGER42", "Join game": "Vào ván",
  "Play someone new": "Chơi với người mới", "Practice against the computer": "Luyện tập với máy",
  "Game code": "Mã ván", "Share this code with your partner. They open this site, type the code, and join.": "Gửi mã này cho bạn chơi. Họ mở trang này, nhập mã và vào ván.",
  "Send invite": "Gửi lời mời", "Copy invite link": "Sao chép đường dẫn mời", "Invite link copied.": "Đã sao chép đường dẫn mời.",
  "Players": "Người chơi", "Waiting for a player": "Đang chờ người chơi", "Open seat": "Ghế trống", "Connected": "Đã kết nối", "Not connected right now": "Hiện chưa kết nối",
  "You": "Bạn", "Leave game": "Rời ván", "Leave practice": "Rời luyện tập", "Recent moves": "Nước đi gần đây", "Left the game.": "Đã rời ván.",
  "Making a new game…": "Đang tạo ván mới…", "Looking for a player…": "Đang tìm người chơi…", "Setting up a game against the computer…": "Đang chuẩn bị ván với máy…",
  "Setting up your game…": "Đang chuẩn bị ván…", "Connection lost. Reconnecting…": "Mất kết nối. Đang kết nối lại…", "Connection lost. Reconnecting.": "Mất kết nối. Đang kết nối lại.",
  "Not connected right now. Trying to reconnect.": "Hiện chưa kết nối. Đang thử kết nối lại.",
  "Couldn't reach the game server. Check your internet connection and try again.": "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.",
  "Type the game code your partner gave you, like TIGER42.": "Nhập mã ván bạn chơi đã gửi, ví dụ TIGER42.",
  "This game already has two players. You can watch, but not play.": "Ván này đã đủ hai người. Bạn có thể xem nhưng không thể chơi.",
  "Looking for another player. Stay on this page: you'll hear a chime when someone joins. Or leave and practice against the computer.": "Đang tìm người chơi khác. Hãy ở lại trang này: bạn sẽ nghe tiếng chuông khi có người vào. Hoặc rời đi và luyện tập với máy.",
  "Start the game when you're ready.": "Bắt đầu khi bạn sẵn sàng.", "They'll start the game.": "Họ sẽ bắt đầu ván.",
  "Quick chat": "Trò chuyện nhanh", "Good luck!": "Chúc may mắn!", "Good game!": "Ván hay!", "Nice move!": "Nước đi hay!", "Thanks!": "Cảm ơn!",
  "Oops!": "Ối!", "Wow!": "Ồ!", "Rematch?": "Chơi lại không?", "Take your time.": "Cứ từ từ.", "Be right back.": "Quay lại ngay.",
  "Turn quick chat off": "Tắt trò chuyện nhanh", "Turn quick chat on": "Bật trò chuyện nhanh", "Quick chat on.": "Đã bật trò chuyện nhanh.",
  "Quick chat off. You won't see or hear messages.": "Đã tắt trò chuyện nhanh. Bạn sẽ không thấy hay nghe tin nhắn.",
  "Wait a moment before sending another message.": "Chờ một chút trước khi gửi tin nhắn khác.",
  "Your partner": "Bạn chơi", "The computer": "Máy", "Player": "Người chơi", "Cancel": "Hủy",
  "Opponent": "Đối thủ", "Table": "Bàn", "Your hand": "Bài của bạn", "Choose the next color": "Chọn màu tiếp theo",
  "Red": "Đỏ", "Yellow": "Vàng", "Green": "Xanh lá", "Blue": "Xanh dương",
  "Deal the cards": "Chia bài", "Deal next round": "Chia ván tiếp", "Draw a card": "Rút một lá", "Draw (already drew)": "Rút (đã rút rồi)", "Pass": "Bỏ lượt",
  "No cards.": "Không còn bài.", "You played your last card!": "Bạn đã đánh lá cuối cùng!",
  "Both players are here. Deal the cards to start.": "Đã đủ hai người. Chia bài để bắt đầu.",
  "Your turn.": "Đến lượt bạn.", "Your turn is over.": "Hết lượt của bạn.", "You win the round!": "Bạn thắng ván này!", "Deal the next round when you're ready.": "Chia ván tiếp khi bạn sẵn sàng.",
  "You can play it, or pass.": "Bạn có thể đánh lá đó hoặc bỏ lượt.", "It doesn't fit, so your turn is over.": "Lá đó không hợp, nên hết lượt của bạn.",
  "Play the card you drew, or pass.": "Đánh lá vừa rút hoặc bỏ lượt.",
  "That card can't be played right now.": "Lá này chưa đánh được lúc này.", "It's not your turn.": "Chưa đến lượt bạn.",
  "You already drew this turn. Play that card or pass.": "Bạn đã rút trong lượt này. Đánh lá đó hoặc bỏ lượt.",
  "Choose a color for the wild card.": "Chọn màu cho lá Đổi màu.",
  "Stacking off.": "Đã tắt đánh chồng.", "Draw wars off.": "Đã tắt cuộc chiến rút bài.",
  "Stacking on: play all your cards of the same number or symbol at once.": "Đã bật đánh chồng: đánh cùng lúc mọi lá cùng số hoặc ký hiệu.",
  "Draw wars on: answer a Draw Two with a Draw Two, or a Wild Draw Four with a Wild Draw Four.": "Đã bật cuộc chiến rút bài: đáp Rút hai bằng Rút hai, hoặc Đổi màu rút bốn bằng Đổi màu rút bốn.",
  "One player creates a game and shares the code. The other types the code to join.": "Một người tạo ván và chia sẻ mã. Người kia nhập mã để vào.",
  "Match the top card by color or by number or symbol.": "Đánh lá cùng màu, cùng số hoặc cùng ký hiệu với lá trên cùng.",
  "Wild cards can be played on anything. You pick the next color.": "Lá Đổi màu đánh lên lá nào cũng được. Bạn chọn màu tiếp theo.",
  "Skip and Reverse: with two players, you go again.": "Mất lượt và Đổi chiều: khi chơi hai người, bạn được đi tiếp.",
  "Draw Two and Wild Draw Four: your opponent draws, and you go again.": "Rút hai và Đổi màu rút bốn: đối thủ phải rút, và bạn được đi tiếp.",
  "Can't play? Draw a card. If it fits you may play it, or pass.": "Không đánh được? Rút một lá. Nếu hợp thì đánh, không thì bỏ lượt.",
  "First to empty their hand wins the round.": "Ai hết bài trước sẽ thắng ván.",
  "House rules (optional, switch each on before dealing). Stacking: play all your cards with the same number or symbol in one turn, like three 3s at once. Draw wars: when a Draw Two is played on you, answer with your own Draw Two to pass the cards back, and the same with Wild Draw Fours. A Draw Two war takes only Draw Twos, and a Wild Draw Four war takes only Wild Draw Fours. The first player who can't answer takes them all and loses their turn.": "Luật nhà (tùy chọn, bật trước khi chia bài). Đánh chồng: đánh trong một lượt mọi lá cùng số hoặc ký hiệu, ví dụ ba lá 3 cùng lúc. Cuộc chiến rút bài: khi bị đánh Rút hai, hãy đáp bằng Rút hai của bạn để đẩy bài lại, tương tự với Đổi màu rút bốn. Cuộc chiến Rút hai chỉ nhận Rút hai, cuộc chiến Đổi màu rút bốn chỉ nhận Đổi màu rút bốn. Ai không đáp được sẽ phải rút hết và mất lượt.",
  "Screen reader tip: each card is a button. Cards you can't play right now say \"can't play\". Every move is announced, and each part of the table has its own heading.": "Mẹo cho trình đọc màn hình: mỗi lá bài là một nút. Lá chưa đánh được sẽ báo \"không đánh được\". Mọi nước đi đều được đọc, và mỗi phần của bàn có tiêu đề riêng.",
  "Sound effects play for each move, and a chime plays when it's your turn. The Sound button at the top turns them off.": "Mỗi nước đi có hiệu ứng âm thanh, và có tiếng chuông khi đến lượt bạn. Nút Âm thanh ở trên để tắt.",
  "Color Clash is an": "Color Clash là một trò chơi của", "game.": ".",
  // High Rollers
  "Start the game": "Bắt đầu ván",
  "Play again": "Chơi lại",
  "Roll the dice": "Gieo xúc xắc",
  "Both players are here. Start the game when you're ready.": "Đã đủ hai người. Bắt đầu khi bạn sẵn sàng.",
  "Six casinos, numbered 1 to 6. Each round, every casino gets cash bills until it holds at least $50,000. Each bill is a separate prize: the biggest is 1st place, the next is 2nd place, and so on. They are not added together.": "Sáu sòng bạc, đánh số từ 1 đến 6. Mỗi vòng, mỗi sòng nhận tiền cho đến khi có ít nhất $50,000. Mỗi tờ là một giải riêng: tờ lớn nhất cho hạng 1, tờ kế tiếp cho hạng 2, cứ thế. Các tờ không cộng dồn.",
  "Each player has 8 dice in their color, plus 4 white house dice. On your turn, roll all the dice you have left. Then pick one number you rolled and place every die showing that number, yours and white, on the casino with that number.": "Mỗi người có 8 xúc xắc màu riêng, cộng 4 xúc xắc trắng của nhà cái. Đến lượt, gieo hết số xúc xắc còn lại. Rồi chọn một số đã gieo và đặt mọi viên ra số đó, của bạn lẫn màu trắng, vào sòng có số đó.",
  "Take turns until all dice are placed. If your partner runs out first, you keep going.": "Lần lượt chơi đến khi đặt hết xúc xắc. Nếu bạn chơi hết trước, bạn đi tiếp.",
  "Payout: at each casino, whoever has the most dice takes the biggest bill, the next most takes the next bill, and so on. The white house dice count as a third player; money they win leaves the game.": "Trả thưởng: ở mỗi sòng, ai nhiều xúc xắc nhất lấy tờ lớn nhất, người kế tiếp lấy tờ kế tiếp, cứ thế. Xúc xắc trắng của nhà cái tính như người chơi thứ ba; tiền nhà cái thắng sẽ bị loại khỏi ván.",
  "The twist: players who tie at a casino win nothing there, and the next player in line moves up. Use it to knock your rival out.": "Điểm đặc biệt: ai hòa nhau ở một sòng thì không được gì ở đó, người kế tiếp được đẩy lên. Hãy dùng nó để loại đối thủ.",
  "After 4 rounds, the most money wins. A tie goes to whoever has more bills.": "Sau 4 vòng, ai nhiều tiền nhất thắng. Nếu hòa, ai nhiều tờ tiền hơn thắng.",
  "Screen reader tip: after you roll, the Your roll section has one button per number, saying how many dice it places and what that casino holds. The Casinos section lists every casino's cash, dice and current leader.": "Mẹo cho trình đọc màn hình: sau khi gieo, mục Lượt gieo của bạn có một nút cho mỗi số, cho biết sẽ đặt bao nhiêu viên và sòng đó có gì. Mục Các sòng bạc liệt kê tiền, xúc xắc và người đang dẫn ở từng sòng.",
  "High Rollers is an": "High Rollers là một trò chơi của",
  "Casinos": "Các sòng bạc",
  "Money": "Tiền",
  "House": "Nhà cái",
};

// ---------- card names (Color Clash) ----------
const CARD = {
  es: { colors: { Red: "rojo", Yellow: "amarillo", Green: "verde", Blue: "azul" }, vals: { Skip: "Salta", Reverse: "Reversa", "Draw Two": "Roba dos", "Wild Draw Four": "Comodín roba cuatro", Wild: "Comodín" }, order: (c, v) => v + " " + c },
  vi: { colors: { Red: "đỏ", Yellow: "vàng", Green: "xanh lá", Blue: "xanh dương" }, vals: { Skip: "Mất lượt", Reverse: "Đổi chiều", "Draw Two": "Rút hai", "Wild Draw Four": "Đổi màu rút bốn", Wild: "Đổi màu" }, order: (c, v) => v + " " + c },
};
function cards(s) {
  const C = CARD[lang]; if (!C) return s;
  s = s.replace(/\b(Red|Yellow|Green|Blue) (\d|Skip|Reverse|Draw Two)\b/g, (m, c, v) => C.order(C.colors[c], C.vals[v] || v));
  return s.replace(/\bWild Draw Four\b/g, C.vals["Wild Draw Four"]).replace(/\bDraw Two\b/g, C.vals["Draw Two"]).replace(/\bWild\b/g, C.vals.Wild);
}

// ---------- sentence patterns ----------
// Each: [English regex, Spanish, Vietnamese]. $1, $2 are the captured parts (already translated where they are words we know).
const P = [
  [/^You played (\d+) cards at once: (.+)\.$/, "Jugaste $1 cartas a la vez: $2.", "Bạn đánh $1 lá cùng lúc: $2."],
  [/^(.+) played (\d+) cards at once: (.+)\.$/, "$1 jugó $2 cartas a la vez: $3.", "$1 đánh $2 lá cùng lúc: $3."],
  [/^You played (.+)\.$/, "Jugaste $1.", "Bạn đánh $1."],
  [/^(.+) played (.+)\.$/, "$1 jugó $2.", "$1 đánh $2."],
  [/^The color is now (.+)\.$/, "Ahora el color es $1.", "Màu hiện tại là $1."],
  [/^Draw war! You owe (\d+) cards: play a (.+) to pass them back, or take them\.$/, "¡Guerra de robo! Debes $1 cartas: juega un $2 para devolverlas, o tómalas.", "Chiến rút bài! Bạn nợ $1 lá: đánh một lá $2 để đẩy lại, hoặc nhận bài."],
  [/^Draw war! You owe (\d+) cards\. Play a (.+) to pass them back, or take them\.$/, "¡Guerra de robo! Debes $1 cartas. Juega un $2 para devolverlas, o tómalas.", "Chiến rút bài! Bạn nợ $1 lá. Đánh một lá $2 để đẩy lại, hoặc nhận bài."],
  [/^Draw war! (.+) owes (\d+) cards\.$/, "¡Guerra de robo! $1 debe $2 cartas.", "Chiến rút bài! $1 nợ $2 lá."],
  [/^Draw war!$/, "¡Guerra de robo!", "Chiến rút bài!"],
  [/^You owe (\d+) cards: play a (.+) to pass them back, or take them\.$/, "Debes $1 cartas: juega un $2 para devolverlas, o tómalas.", "Bạn nợ $1 lá: đánh một lá $2 để đẩy lại, hoặc nhận bài."],
  [/^You owe (\d+) cards\.$/, "Debes $1 cartas.", "Bạn nợ $1 lá."],
  [/^Play a (.+) to pass them back, or take them\.$/, "Juega un $1 para devolverlas, o tómalas.", "Đánh một lá $1 để đẩy lại, hoặc nhận bài."],
  [/^(.+) owes (\d+) cards\.$/, "$1 debe $2 cartas.", "$1 nợ $2 lá."],
  [/^Top card: (.+)\.$/, "Carta de arriba: $1.", "Lá trên cùng: $1."],
  [/^Current color: (.+)\.$/, "Color actual: $1.", "Màu hiện tại: $1."],
  [/^Draw pile: (\d+) cards\.$/, "Mazo: $1 cartas.", "Chồng rút: $1 lá."],
  [/^(\d+) cards left$/, "Quedan $1 cartas", "Còn $1 lá"],
  [/^(\d+) cards?$/, "$1 cartas", "$1 lá"],
  [/^Draw war: (\d+) cards on the line\.$/, "Guerra de robo: $1 cartas en juego.", "Chiến rút bài: $1 lá đang chờ."],
  [/^Draw war! Only a (.+) can answer\. Or choose Take (\d+) cards\.$/, "¡Guerra de robo! Solo un $1 puede responder. O elige Tomar $2 cartas.", "Chiến rút bài! Chỉ lá $1 mới đáp được. Hoặc chọn Nhận $2 lá."],
  [/^Draw war! Only a (.+) can answer, or take the cards\.$/, "¡Guerra de robo! Solo un $1 puede responder, o toma las cartas.", "Chiến rút bài! Chỉ lá $1 mới đáp được, hoặc nhận bài."],
  [/^Take (\d+) cards$/, "Tomar $1 cartas", "Nhận $1 lá"],
  [/^You draw (\d+)\.$/, "Robas $1.", "Bạn rút $1 lá."],
  [/^(.+) draws (\d+)\.$/, "$1 roba $2.", "$1 rút $2 lá."],
  [/^You go again\.$/, "Vuelves a jugar.", "Bạn được đi tiếp."],
  [/^(.+) goes again\.$/, "$1 vuelve a jugar.", "$1 được đi tiếp."],
  [/^You have one card left!$/, "¡Te queda una carta!", "Bạn chỉ còn một lá!"],
  [/^(.+) has one card left!$/, "¡A $1 le queda una carta!", "$1 chỉ còn một lá!"],
  [/^You drew (.+)\.$/, "Robaste $1.", "Bạn rút được $1."],
  [/^(.+) drew a card\.$/, "$1 robó una carta.", "$1 rút một lá."],
  [/^(.+) drew a card and couldn't play it\.$/, "$1 robó una carta y no pudo jugarla.", "$1 rút một lá nhưng không đánh được."],
  [/^You pass\.$/, "Pasas.", "Bạn bỏ lượt."],
  [/^(.+) passed\.$/, "$1 pasó.", "$1 bỏ lượt."],
  [/^(.+) wins the round!$/, "¡$1 gana la ronda!", "$1 thắng ván này!"],
  [/^(.+)'s turn\.$/, "Turno de $1.", "Lượt của $1."],
  [/^You lost the draw war and took (\d+) cards\.$/, "Perdiste la guerra de robo y tomaste $1 cartas.", "Bạn thua cuộc chiến rút bài và phải nhận $1 lá."],
  [/^(.+) lost the draw war and took (\d+) cards\.$/, "$1 perdió la guerra de robo y tomó $2 cartas.", "$1 thua cuộc chiến rút bài và phải nhận $2 lá."],
  [/^New round dealt\.$/, "Nueva ronda repartida.", "Đã chia ván mới."],
  [/^New round dealt with house rules: (.+) on\.$/, "Nueva ronda repartida con reglas de la casa: $1.", "Đã chia ván mới với luật nhà: $1."],
  [/^You go first\.$/, "Empiezas tú.", "Bạn đi trước."],
  [/^(.+) goes first\.$/, "Empieza $1.", "$1 đi trước."],
  [/^The first card is (.+)\.$/, "La primera carta es $1.", "Lá đầu tiên là $1."],
  [/^Top card: (.+)\. Current color: (.+)\. Draw pile: (\d+) cards\.$/, "Carta de arriba: $1. Color actual: $2. Mazo: $3 cartas.", "Lá trên cùng: $1. Màu hiện tại: $2. Chồng rút: $3 lá."],
  [/^Color: (.+)$/, "Color: $1", "Màu: $1"],
  [/^Rounds won: (.+) (\d+), (.+) (\d+)$/, "Rondas ganadas: $1 $2, $3 $4", "Số ván thắng: $1 $2, $3 $4"],
  [/^(.+), playable, can stack (\d+)$/, "$1, se puede jugar, puedes apilar $2", "$1, đánh được, có thể đánh chồng $2"],
  [/^(.+), playable$/, "$1, se puede jugar", "$1, đánh được"],
  [/^(.+), can't play$/, "$1, no se puede jugar", "$1, không đánh được"],
  [/^(.+), just drawn$/, "$1, recién robada", "$1, vừa rút"],
  [/^(.+) has 1 cards?\.?$/, "$1 tiene 1 carta.", "$1 có 1 lá."],
  [/^(.+) has (\d+) cards?\.?$/, "$1 tiene $2 cartas.", "$1 có $2 lá."],
  [/^One card left!$/, "¡Le queda una carta!", "Chỉ còn một lá!"],
  [/^You have (\w+) (.+?)s\.$/, "Tienes $1 de $2.", "Bạn có $1 lá $2."],
  [/^Stack them\?$/, "¿Apilarlas?", "Đánh chồng không?"],
  [/^You have (\w+) (.+)\. Stack them\?$/, "Tienes $1 $2. ¿Apilarlas?", "Bạn có $1 lá $2. Đánh chồng không?"],
  [/^Play just the (.+)$/, "Jugar solo $1", "Chỉ đánh $1"],
  [/^Play all (\d+), ending on (.+)$/, "Jugar las $1, terminando en $2", "Đánh cả $1 lá, kết thúc bằng $2"],
  [/^Play all (\d+), then choose the color$/, "Jugar las $1 y elegir el color", "Đánh cả $1 lá rồi chọn màu"],
  [/^House rule, stacking: (On|Off)$/, "Regla de la casa, apilar: $1", "Luật nhà, đánh chồng: $1"],
  [/^House rule, draw wars: (On|Off)$/, "Regla de la casa, guerras de robo: $1", "Luật nhà, chiến rút bài: $1"],
  [/^(.+) Applies to games you deal\.$/, "$1 Se aplica a las partidas que repartas.", "$1 Áp dụng cho ván bạn chia."],

  // High Rollers
  [/^New game\.$/, "Nueva partida.", "Ván mới."],
  [/^Round (\d) of (\d)\.$/, "Ronda $1 de $2.", "Vòng $1/$2."],
  [/^Casinos, round (\d) of (\d)$/, "Casinos, ronda $1 de $2", "Các sòng bạc, vòng $1/$2"],
  [/^Casino (\d): (.+)\.$/, "Casino $1: $2.", "Sòng $1: $2."],
  [/^Casino (\d) now: (.+)\.$/, "Casino $1 ahora: $2.", "Sòng $1 lúc này: $2."],
  [/^You start\.$/, "Empiezas tú.", "Bạn đi trước."],
  [/^(.+) starts\.$/, "Empieza $1.", "$1 đi trước."],
  [/^Roll the dice\.?$/, "Tira los dados.", "Gieo xúc xắc."],
  [/^Pick a number to place\.$/, "Elige un número para colocar.", "Chọn một số để đặt."],
  [/^You rolled (.+)\.$/, "Sacaste $1.", "Bạn gieo được $1."],
  [/^(.+) rolled (.+)\.$/, "$1 sacó $2.", "$1 gieo được $2."],
  [/^You placed (.+) on casino (\d)\.$/, "Colocaste $1 en el casino $2.", "Bạn đặt $1 vào sòng $2."],
  [/^(.+) placed (.+) on casino (\d)\.$/, "$1 colocó $2 en el casino $3.", "$1 đặt $2 vào sòng $3."],
  [/^You have one die left\.$/, "Te queda un dado.", "Bạn còn một xúc xắc."],
  [/^You have no dice left\.$/, "No te quedan dados.", "Bạn hết xúc xắc."],
  [/^(.+) has one die left\.$/, "A $1 le queda un dado.", "$1 còn một xúc xắc."],
  [/^(.+) has no dice left\.$/, "A $1 no le quedan dados.", "$1 hết xúc xắc."],
  [/^You have (.+) left\.$/, "Te quedan $1.", "Bạn còn $1."],
  [/^(.+) has (.+) left\.$/, "A $1 le quedan $2.", "$1 còn $2."],
  [/^Your turn\. Roll your (.+)\.$/, "Tu turno. Tira tus $1.", "Đến lượt bạn. Gieo $1."],
  [/^Roll your (.+)\.$/, "Tira tus $1.", "Gieo $1."],
  [/^Your roll$/, "Tu tirada", "Lượt gieo của bạn"],
  [/^(.+)'s roll$/, "Tirada de $1", "Lượt gieo của $1"],
  [/^(.+) is about to roll (.+)\.$/, "$1 va a tirar $2.", "$1 sắp gieo $2."],
  [/^Roll the dice$/, "Tirar los dados", "Gieo xúc xắc"],
  [/^Money and dice$/, "Dinero y dados", "Tiền và xúc xắc"],
  [/^(.+) and (.+) left$/, "Quedan $1 y $2", "Còn $1 và $2"],
  [/^(\w+) bills? won$/, "$1 billetes ganados", "thắng $1 tờ tiền"],
  [/^Prizes: (.+); dice there: (.+)\.$/, "Premios: $1; dados allí: $2.", "Giải thưởng: $1; xúc xắc ở đó: $2."],
  [/^Prizes: (.+)\.$/, "Premios: $1.", "Giải thưởng: $1."],
  [/^Dice: (.+)\.$/, "Dados: $1.", "Xúc xắc: $1."],
  [/^Empty\.$/, "Vacío.", "Trống."],
  [/^tied out: (.+)\.$/, "Fuera por empate: $1.", "Bị loại do hòa: $1."],
  [/^Choose a number: all dice showing it go to that casino\.$/, "Elige un número: todos los dados con ese número van a ese casino.", "Chọn một số: mọi xúc xắc ra số đó sẽ vào sòng đó."],
  [/^(.+) would win (\$[\d,]+)\.$/, "$1 ganaría $2.", "$1 sẽ thắng $2."],
  [/^(.+); (.+)\.$/, "$1; $2.", "$1; $2."],
  [/^Nobody would win\.$/, "Nadie ganaría.", "Không ai thắng."],
  [/^Round (\d) payout\.$/, "Pagos de la ronda $1.", "Trả thưởng vòng $1."],
  [/^Round (\d) payout$/, "Pagos de la ronda $1", "Trả thưởng vòng $1"],
  [/^Money: (.+)\.$/, "Dinero: $1.", "Tiền: $1."],
  [/^Game over\.$/, "Fin de la partida.", "Hết ván."],
  [/^It's a tie!$/, "¡Empate!", "Hòa!"],
  [/^You win!$/, "¡Ganaste!", "Bạn thắng!"],
  [/^(.+) wins!$/, "¡$1 gana!", "$1 thắng!"],
  [/^You win (\$[\d,]+)\.$/, "Ganas $1.", "Bạn thắng $1."],
  [/^(.+) wins (\$[\d,]+)\.$/, "$1 gana $2.", "$1 thắng $2."],
  [/^Round (\d) is over\.$/, "La ronda $1 terminó.", "Vòng $1 đã kết thúc."],
  [/^Hear the payout, then choose Next round\.$/, "Escucha los pagos y luego elige Siguiente ronda.", "Nghe phần trả thưởng rồi chọn Vòng tiếp."],
  [/^Next round \((\d) of (\d)\)$/, "Siguiente ronda ($1 de $2)", "Vòng tiếp ($1/$2)"],
  [/^Games won: (.+) (\d+), (.+) (\d+)$/, "Partidas ganadas: $1 $2, $3 $4", "Số ván thắng: $1 $2, $3 $4"],
  [/^Casino (\d): place (.+)$/, "Casino $1: colocar $2", "Sòng $1: đặt $2"],
  [/^Place (.+) on casino (\d)\.$/, "Colocar $1 en el casino $2.", "Đặt $1 vào sòng $2."],
  [/^You didn't roll any (\d)s\. Pick a number you rolled\.$/, "No sacaste ningún $1. Elige un número que hayas sacado.", "Bạn không gieo được số $1 nào. Hãy chọn số bạn đã gieo."],
  [/^Your turn\. Round (\d) of (\d)\.$/, "Tu turno. Ronda $1 de $2.", "Đến lượt bạn. Vòng $1/$2."],
  [/^(.+)'s turn\. Round (\d) of (\d)\.$/, "Turno de $1. Ronda $2 de $3.", "Lượt của $1. Vòng $2/$3."],
  // shared shell
  [/^You're playing against (.+), the computer\.$/, "Juegas contra $1, la computadora.", "Bạn đang đấu với $1, là máy."],
  [/^(.+) joined your table!$/, "¡$1 se unió a tu mesa!", "$1 đã vào bàn của bạn!"],
  [/^Found a player: (.+)\. Joining their table\.$/, "Jugador encontrado: $1. Uniéndote a su mesa.", "Đã tìm thấy người chơi: $1. Đang vào bàn của họ."],
  [/^Waiting for your partner to join with code (\w+)\.$/, "Esperando a que tu compañero se una con el código $1.", "Đang chờ bạn chơi vào bằng mã $1."],
  [/^Joining game (\w+)…$/, "Uniéndote a la partida $1…", "Đang vào ván $1…"],
  [/^(.+) says: (.+)$/, "$1 dice: $2", "$1 nói: $2"],
  [/^You said: (.+)$/, "Dijiste: $1", "Bạn đã nói: $1"],
  [/^Sent: (.+)$/, "Enviado: $1", "Đã gửi: $1"],
  [/^(\d+) players waiting for a game now$/, "$1 jugadores esperando partida ahora", "$1 người đang chờ chơi"],
  [/^(\d+) wins?$/, "$1 victorias", "$1 trận thắng"],
  [/^(\d+) games? in a row$/, "$1 seguidas", "$1 ván liên tiếp"],
  [/^You've been invited to game (\w+)\. Type your name, then choose Join game\.$/, "Te invitaron a la partida $1. Escribe tu nombre y elige Unirse.", "Bạn được mời vào ván $1. Nhập tên rồi chọn Vào ván."],
  [/^(\w+) \(computer\)$/, "$1 (computadora)", "$1 (máy)"],
  [/^(.+) \(computer\)$/, "$1 (computadora)", "$1 (máy)"],
  [/^Done\. This device now uses code (.+)\.$/, "Listo. Este dispositivo ahora usa el código $1.", "Xong. Thiết bị này giờ dùng mã $1."],
];
const WORD = { es: { You: "Tú", On: "Activada", Off: "Desactivada", stacking: "apilar", "draw wars": "guerras de robo", "stacking and draw wars": "apilar y guerras de robo", "The computer": "La computadora", "Your partner": "Tu compañero", one: "una", two: "dos", three: "tres", four: "cuatro", five: "cinco", six: "seis", seven: "siete", eight: "ocho" },
  vi: { You: "Bạn", On: "Bật", Off: "Tắt", stacking: "đánh chồng", "draw wars": "chiến rút bài", "stacking and draw wars": "đánh chồng và chiến rút bài", "The computer": "Máy", "Your partner": "Bạn chơi", one: "một", two: "hai", three: "ba", four: "bốn", five: "năm", six: "sáu", seven: "bảy", eight: "tám" } };


// ---------- pieces inside sentences (lists of dice, prizes, standings) ----------
const NUMW = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const NUM = {
  es: ["ningún", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"],
  vi: ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười", "mười một", "mười hai"],
};
const num = (w) => { const i = w === "a" || w === "an" ? 1 : NUMW.indexOf(w); return i < 0 ? w : NUM[lang][i]; };
const PP = [
  // dice: "three 1s (2 house)", "a 4 (house)", "two 6s (all house)"
  [/^(a|an|no|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) (\d)s?(?: \((house|all house|(\d+) house)\))?$/, (m) => {
    const n = num(m[1]), h = m[3] ? (m[3] === "house" || m[3] === "all house" ? (lang === "es" ? " (de la casa)" : " (của nhà cái)") : (lang === "es" ? " (" + m[4] + " de la casa)" : " (" + m[4] + " của nhà cái)")) : "";
    return lang === "es" ? n + " " + m[2] + h : n + " viên " + m[2] + h; }],
  [/^(no|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) house di(?:c)?e$/, (m) => lang === "es" ? num(m[1]) + (m[1] === "one" ? " dado de la casa" : " dados de la casa") : num(m[1]) + " xúc xắc của nhà cái"],
  [/^(no|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) di(?:c)?e$/, (m) => lang === "es" ? (m[1] === "no" ? "ningún dado" : num(m[1]) + (m[1] === "one" ? " dado" : " dados")) : num(m[1]) + " xúc xắc"],
  // prizes: "1st place $50,000", "2nd $20,000"
  [/^1st place (\$[\d,]+)$/, (m) => (lang === "es" ? "1.er puesto " : "hạng 1 ") + m[1]],
  [/^(\d)(?:st|nd|rd|th) (\$[\d,]+)$/, (m) => (lang === "es" ? m[1] + ".º " : "hạng " + m[1] + " ") + m[2]],
  // standings: "You 2", "House 4", "Rosie 3"
  [/^(You|House) (\d+|\$[\d,]+)$/, (m) => (m[1] === "You" ? (lang === "es" ? "Tú" : "Bạn") : (lang === "es" ? "Casa" : "Nhà cái")) + " " + m[2]],
  // payouts: "You win $X", "Rosie wins $X", "House would win $X", "You and Rosie tied, nothing"
  [/^You (?:win|won) (\$[\d,]+)$/, (m) => (lang === "es" ? "ganas " : "bạn thắng ") + m[1]],
  [/^You would win (\$[\d,]+)$/, (m) => (lang === "es" ? "ganarías " : "bạn sẽ thắng ") + m[1]],
  [/^(.+) would win (\$[\d,]+)$/, (m) => piece(m[1]) + (lang === "es" ? " ganaría " : " sẽ thắng ") + m[2]],
  [/^(.+) (?:wins|won) (\$[\d,]+)$/, (m) => piece(m[1]) + (lang === "es" ? " gana " : " thắng ") + m[2]],
  [/^(.+) tied, nothing$/, (m) => piece(m[1]) + (lang === "es" ? " empataron, nada" : " hòa, không được gì")],
  [/^tied out: (.+)$/, (m) => (lang === "es" ? "fuera por empate: " : "bị loại do hòa: ") + piece(m[1])],
  [/^no dice, nobody wins$/, () => lang === "es" ? "sin dados, nadie gana" : "không có xúc xắc, không ai thắng"],
  [/^nobody wins$/, () => lang === "es" ? "nadie gana" : "không ai thắng"],
  [/^no dice yet$/, () => lang === "es" ? "aún sin dados" : "chưa có xúc xắc"],
  [/^You and (.+)$/, (m) => (lang === "es" ? "Tú y " : "Bạn và ") + piece(m[1])],
  [/^(.+) and you$/, (m) => piece(m[1]) + (lang === "es" ? " y tú" : " và bạn")],
];

const DICT = { es: ES, vi: VI };
function piece(s) {
  if (s == null) return s;
  const D = DICT[lang];
  if (D[s] !== undefined) return D[s];
  const W = WORD[lang];
  if (W[s] !== undefined) return W[s];
  for (const [re, f] of PP) { const m = s.match(re); if (m) return f(m); }
  if (/; |, | and /.test(s)) {
    const sep = s.includes("; ") ? "; " : null;
    if (sep) return s.split("; ").map(piece).join("; ");
    const parts = s.split(/, | and /);
    if (parts.length > 1) return parts.map(piece).join(", ").replace(/, ([^,]+)$/, lang === "es" ? " y $1" : " và $1");
  }
  return cards(s);
}
function sentence(s) {
  const D = DICT[lang];
  if (D[s] !== undefined) return D[s];
  const col = lang === "es" ? 1 : 2;
  for (const p of P) {
    const m = s.match(p[0]);
    if (m) return p[col].replace(/\$(\d)/g, (_, i) => piece(m[i]));
  }
  // no sentence pattern: try it as a phrase (lists of dice, "You and Sunny tied, nothing", ...)
  const end = (s.match(/[.!?]$/) || [""])[0], core = end ? s.slice(0, -1) : s;
  const pc = piece(core);
  return pc === core ? cards(s) : pc.charAt(0).toUpperCase() + pc.slice(1) + end;
}
/** Translate a string of one or more sentences. English passes through untouched. */
export function tr(text) {
  if (lang === "en" || text == null) return text;
  const s = String(text);
  const t = s.trim();
  if (!t) return s;
  const D = DICT[lang];
  if (D[t] !== undefined) return D[t];
  const parts = t.split(/(?<=[.!?…])\s+(?=[A-Za-z¡¿])/);
  return parts.map(sentence).join(" ");
}

// ---------- page translation ----------
const done = new WeakMap();
function node(n) {
  const v = n.nodeValue; if (!v || !/[A-Za-z]/.test(v)) return;
  if (n.parentElement && n.parentElement.closest("h1") && /^\s*(Even|Play)\s*$/.test(v)) return; // the EvenPlay name
  if (done.get(n) === v) return;
  const out = tr(v);
  if (out !== v.trim()) { const lead = v.match(/^\s*/)[0], tail = v.match(/\s*$/)[0]; n.nodeValue = lead + out + tail; }
  done.set(n, n.nodeValue);
}
function attrs(el) {
  for (const a of ["aria-label", "placeholder", "title"]) {
    const v = el.getAttribute && el.getAttribute(a);
    if (v && /[A-Za-z]/.test(v) && el.dataset["tr" + a.replace(/-./, (x) => x[1].toUpperCase())] !== v) {
      const out = tr(v); el.setAttribute(a, out); el.dataset["tr" + a.replace(/-./, (x) => x[1].toUpperCase())] = out;
    }
  }
}
function walk(root) {
  if (root.nodeType === 3) { if (!skip(root.parentElement)) node(root); return; }
  if (root.nodeType !== 1 || skip(root)) return;
  attrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) { if (n.nodeType === 3) { if (!skip(n.parentElement)) node(n); } else if (!skip(n)) attrs(n); }
}
const skip = (el) => !el || el.closest("script,style,#status,.code,.code-big,[data-no-tr],select#lang-select") !== null;

/** Translate the page now and keep translating as it changes. Adds the language picker to the nav. */
export function translatePage() {
  document.documentElement.lang = lang;
  addPicker();
  if (lang === "en") return;
  document.title = tr(document.title);
  walk(document.body);
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "characterData") { if (!skip(m.target.parentElement)) node(m.target); }
      else if (m.type === "attributes") { if (!skip(m.target)) attrs(m.target); }
      else m.addedNodes.forEach(walk);
    }
  }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["aria-label", "placeholder", "title"] });
}
function addPicker() {
  const nav = document.querySelector("nav");
  if (!nav || document.getElementById("lang-select")) return;
  const wrap = document.createElement("span");
  wrap.style.cssText = "display:inline-flex;align-items:center;gap:6px";
  const label = document.createElement("label");
  label.htmlFor = "lang-select"; label.textContent = lang === "en" ? "Language" : tr("Language"); label.setAttribute("data-no-tr", "");
  const sel = document.createElement("select");
  sel.id = "lang-select";
  sel.style.cssText = "font:inherit;padding:4px 6px;border-radius:8px;background:#072120;color:#f3efe6;border:1px solid #b9c9c4";
  for (const [k, name] of Object.entries(LANGS)) { const o = document.createElement("option"); o.value = k; o.textContent = name; o.lang = k; sel.append(o); }
  sel.value = lang;
  sel.addEventListener("change", () => setLang(sel.value));
  wrap.append(label, sel);
  nav.append(" ", wrap);
}
