const [EMPTY, BLACK, WHITE, OUTER] = [".", "@", "o", "?"];
const PIECES = [EMPTY, BLACK, WHITE, OUTER];
const PLAYERS = { "@": "Preto", "o": "Branco" };

const [UP, DOWN, LEFT, RIGHT] = [-10, 10, -1, 1];
const [UP_RIGHT, DOWN_RIGHT, DOWN_LEFT, UP_LEFT] = [-9, 11, 9, -11];
const DIRECTIONS = [UP, UP_RIGHT, RIGHT, DOWN_RIGHT, DOWN, DOWN_LEFT, LEFT, UP_LEFT];

function squares() {
	return [...Array(89).keys()].filter(n => n > 10 && 1 <= n % 10 && n % 10 <= 8);
}

function initial_board() {
	let board = Array(100);
	board.fill(OUTER);

	squares().forEach(i => board[i] = EMPTY);

	[board[44], board[45]] = [WHITE, BLACK];
	[board[54], board[55]] = [BLACK, WHITE];

	return board;
}

function print_board(board) {
	console.log([...Array(9).keys()].join(" "));
	for (let row = 1; row < 9; row++) {
		const begin = 10 * row + 1;
		const end = 10 * row + 9;

		console.log(`${row} ${board.slice(begin, end).join(" ")}`)
	}
}

function is_valid(move) {
	return squares().includes(move);
}

function opponent(player) {
	return (player == WHITE) ? BLACK : WHITE;
}

function find_bracket(square, player, board, direction) {
	let bracket = square + direction;
	if (board[bracket] == player)
		return null;

	const opp = opponent(player);
	for (; board[bracket] == opp; bracket += direction)
		;

	if (board[bracket] == OUTER || board[bracket] == EMPTY)
		return null;
	return bracket;
}

function is_legal(move, player, board) {
	const has_bracket = direction => find_bracket(move, player, board, direction);
	return board[move] == EMPTY && DIRECTIONS.map(has_bracket).some(d => d != null);
}

function make_move(move, player, board) {
	board[move] = player;
	DIRECTIONS.forEach(d => make_flips(move, player, board, d));
	return board;
}

function make_flips(move, player, board, direction) {
	const bracket = find_bracket(move, player, board, direction);
	if (bracket == null)
		return;


	for (let square = move + direction; square != bracket; square += direction)
		board[square] = player;
}

function legal_moves(player, board) {
	return squares().filter(s => is_legal(s, player, board));
}

function any_legal_move(player, board) {
	return squares().some(s => is_legal(s, player, board));
}

function play() {
	let board = initial_board();
	let player = BLACK;

	while (player != null) {
		const move = get_move();
		make_move(move, player, board);
		player = next_player(board, player);
	}
}

function update_board(player, board) {
	print_board(board);

	squares().forEach(s => {
		const square = document.getElementById(s.toString());
		square.textContent = "";
		square.onclick = () => false;
		square.classList.remove("legal");

		if (board[s] == BLACK || board[s] == WHITE) {
			const piece = document.createElement("div");
			piece.setAttribute("class", `piece ${(board[s] == BLACK) ? "black" : "white"}`);
			square.appendChild(piece);
		}
	});

	if (!any_legal_move(player, board)) {
		update_board(opponent(player), board);
		return;
	}

	legal_moves(player, board).forEach(s => {
		const square = document.getElementById(s);
		square.classList.add("legal");
		square.onclick = (e) => {
			const id = parseInt(e.target.id);
			make_move(id, player, board);
			update_board(opponent(player), board);
		}
	});
}

window.onload = () => {
	const initial = initial_board();
	update_board(BLACK, initial);
}

