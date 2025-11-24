interface GameState {
    activePlayersHTML: string;
    internalCounter: number;
    count: number;
    playerIndex: number;
    currentDealerIndex: number;
    activePlayerListLength: number;
    possibleDealerIndex: number;
    gameStarted: boolean;
}

// Declare globals from index.js so TypeScript knows they exist
declare let internalCounter: number;
declare let count: number;
declare let playerIndex: number;
declare let currentDealerIndex: number;
declare let activePlayerListLength: number;
declare let possibleDealerIndex: number;
declare let countLabel: HTMLElement;

declare function reattachListeners(): void;

function saveGameState(): void {
    const activePlayerList: HTMLElement | null = document.getElementById('activePlayerList');
    const preGameDisplay: HTMLElement | null = document.getElementById('preGameDisplay');
    
    if (!activePlayerList || !preGameDisplay) return;
    
    const state: GameState = {
        activePlayersHTML: activePlayerList.innerHTML,
        internalCounter: internalCounter,
        count: count,
        playerIndex: playerIndex,
        currentDealerIndex: currentDealerIndex,
        activePlayerListLength: activePlayerListLength,
        possibleDealerIndex: possibleDealerIndex,
        gameStarted: !preGameDisplay.classList.contains('hidden')
    };
    
    localStorage.setItem('gameState', JSON.stringify(state));
}

function loadGameState(): void {
    const saved: string | null = localStorage.getItem('gameState');
    if (!saved) return;
    
    const state: GameState = JSON.parse(saved);
    
    // Restore variables
    internalCounter = state.internalCounter;
    count = state.count;
    playerIndex = state.playerIndex;
    currentDealerIndex = state.currentDealerIndex;
    activePlayerListLength = state.activePlayerListLength;
    possibleDealerIndex = state.possibleDealerIndex;
    
    // Restore HTML
    const activePlayerList: HTMLElement | null = document.getElementById('activePlayerList');
    if (activePlayerList) {
        activePlayerList.innerHTML = state.activePlayersHTML;
    }
    
    // Restore UI if game was started
    if (state.gameStarted) {
        if (countLabel) {
            countLabel.textContent = `Current round: ${count}`;
            countLabel.classList.remove('countLabelHidden');
            countLabel.classList.add('countLabel');
        }
        const preGameDisplay: HTMLElement | null = document.getElementById('preGameDisplay');
        const startBtn: HTMLElement | null = document.querySelector('#start-btn');
        
        if (preGameDisplay) preGameDisplay.classList.add('hidden');
        if (startBtn) startBtn.classList.add('hidden');
        
        // Re-attach event listeners to restored elements
        reattachListeners();
    }
}

// Make functions available globally
(window as any).saveGameState = saveGameState;
(window as any).loadGameState = loadGameState;
