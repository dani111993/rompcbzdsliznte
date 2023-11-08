const puzzleContainer = document.getElementById("puzzle-container");
        const shuffleButton = document.getElementById("shuffle-button");
        const timerDisplay = document.getElementById("timer");
        const movesDisplay = document.getElementById("moves");
        const emptyPiece = document.getElementById("empty-piece");
        let moves = 0;
        let timerInterval;
        let startTime;

        // Matriz que representa el estado inicial del rompecabezas
        const initialState = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, null]
        ];

        // Función para iniciar el temporizador
        function startTimer() {
            startTime = new Date().getTime();
            timerInterval = setInterval(updateTimer, 1000);
        }

        // Función para actualizar el temporizador
        function updateTimer() {
            if (!puzzleSolved) {
                const currentTime = new Date().getTime();
                const elapsedTime = new Date(currentTime - startTime);
                const minutes = String(elapsedTime.getMinutes()).padStart(2, "0");
                const seconds = String(elapsedTime.getSeconds()).padStart(2, "0");
                timerDisplay.textContent = `${minutes}:${seconds}`;
            }
        }

        // Función para mezclar el rompecabezas
        function shufflePuzzle() {
            for (let i = 0; i < 1000; i++) { // Barajar 1000 veces
                const movablePieces = getMovablePieces();
                const randomIndex = Math.floor(Math.random() * movablePieces.length);
                const pieceToMove = movablePieces[randomIndex];
                movePiece(pieceToMove);
            }
        }

        // Función para verificar la victoria
        function checkVictory() {
            if (puzzleSolved) {
                return;
            }

            let solved = true;
            const pieces = document.querySelectorAll(".puzzle-piece");

            pieces.forEach((piece, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                const value = parseInt(piece.textContent);
                if (value !== initialState[row][col]) {
                    solved = false;
                }
            });

            if (solved) {
                puzzleSolved = true;
                clearInterval(timerInterval);
                timerDisplay.textContent = formatTime(startTime);
                alert("¡Has completado el rompecabezas!");
            }
        }

        // Función para obtener las piezas movibles (adyacentes al espacio en blanco)
        function getMovablePieces() {
            const emptyRow = parseInt(emptyPiece.style.gridRowStart);
            const emptyCol = parseInt(emptyPiece.style.gridColumnStart);
            const pieces = document.querySelectorAll(".puzzle-piece");
            const movablePieces = [];

            pieces.forEach((piece) => {
                const pieceRow = parseInt(piece.style.gridRowStart);
                const pieceCol = parseInt(piece.style.gridColumnStart);

                if (
                    (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
                    (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)
                ) {
                    movablePieces.push(piece);
                }
            });

            return movablePieces;
        }

        // Función para mover una pieza al espacio en blanco
        function movePiece(piece) {
            if (puzzleSolved) {
                return;
            }

            const pieceRow = parseInt(piece.style.gridRowStart);
            const pieceCol = parseInt(piece.style.gridColumnStart);
            const emptyRow = parseInt(emptyPiece.style.gridRowStart);
            const emptyCol = parseInt(emptyPiece.style.gridColumnStart);

            if (
                (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
                (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)
            ) {
                piece.style.gridRowStart = emptyRow;
                piece.style.gridColumnStart = emptyCol;
                emptyPiece.style.gridRowStart = pieceRow;
                emptyPiece.style.gridColumnStart = pieceCol;

                moves++;
                movesDisplay.textContent = moves;
                checkVictory();
            }
        }

        // Función para dar formato al tiempo
        function formatTime(timestamp) {
            const elapsedTime = new Date(new Date().getTime() - timestamp);
            const minutes = elapsedTime.getMinutes();
            const seconds = elapsedTime.getSeconds();

            return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        // Agregar manejadores de eventos a los botones numerados
        const pieces = document.querySelectorAll(".puzzle-piece");
        pieces.forEach((piece) => {
            piece.addEventListener("click", () => movePiece(piece));
        });

        // Agregar manejador de eventos al botón "Jugar"
        shuffleButton.addEventListener("click", () => {
            // Reinicia el juego y baraja el rompecabezas
            moves = 0;
            movesDisplay.textContent = moves;
            clearInterval(timerInterval);
            timerDisplay.textContent = "00:00";
            puzzleSolved = false;
            startTimer();
            shufflePuzzle();
        });

        // Inicializar el rompecabezas con el estado inicial
        function initializePuzzle() {
            pieces.forEach((piece, index) => {
                const row = Math.floor(index / 4) + 1;
                const col = (index % 4) + 1;
                piece.style.gridRowStart = row;
                piece.style.gridColumnStart = col;
            });

            emptyPiece.style.gridRowStart = 4;
            emptyPiece.style.gridColumnStart = 4;
        }

        initializePuzzle();