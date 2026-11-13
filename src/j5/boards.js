const boards = new Map();
let selectedBoardId;

function registerBoard(id, board) {
  boards.set(id, board);
  if (selectedBoardId === undefined) {
    selectedBoardId = id;
    global.currentBoard = board;
  }
  if (boards.size === 1) {
    global.board = board;
  }
}

function getBoard(boardOrId = selectedBoardId) {
  if (typeof boardOrId === 'string') {
    const board = boards.get(boardOrId);
    if (!board) {
      throw new Error(`Unknown Arduino "${boardOrId}". Available Arduinos: ${[...boards.keys()].join(', ') || 'none'}`);
    }
    return board;
  }
  if (boardOrId && typeof boardOrId === 'object') {
    return boardOrId;
  }
  throw new Error('No Arduino is connected. Connect an Arduino first.');
}

function selectBoard(id) {
  const board = getBoard(id);
  selectedBoardId = id;
  global.board = board;
  global.currentBoard = board;
  return board;
}

global.boards = boards;
global.selectBoard = selectBoard;

export { boards, getBoard, registerBoard, selectBoard };
