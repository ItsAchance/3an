const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");
const resetBtn = document.getElementById("resetBtn");
const defaultRound = 3;
const submitBtn = document.getElementById("submitBtn");
let internalCounter = 3;
let count = 3;
let playerIndex = 0;
const dealerTag = '* ';

// Start game button
const startGame = () => {
    const startGameBtn = document.querySelector('#start-btn');
    startGameBtn.addEventListener('click', () => {
        const countLabel = document.createElement('label');
        countLabel.id = 'countLabel';
        countLabel.textContent = `Current round: ${count}`;
        document.querySelector('#start-game-container').after(countLabel);
        startGameBtn.classList.toggle('hidden');
    });
}

increaseBtn.onclick = function() {
    if (internalCounter < 14) {
        internalCounter++;
        count++;
        countLabel.textContent = "Current round: " + count;
    }
    else if (internalCounter >= 14 && count >= 4) {
        count--;
        internalCounter++;
        countLabel.textContent = "Current round: " + count;
    }
}

resetBtn.onclick = function() {
    // Reset the round counter
    count = defaultRound;
    internalCounter = 3;
    countLabel.textContent = "Current round: " + count;

    // Clear all player containers
    const activePlayerList = document.getElementById("activePlayerList");
    activePlayerList.innerHTML = ""; // Removes all child elements
};

// Add player button functionality
submitBtn.onclick = function() {
    const playerName = document.getElementById("playerTextbox").value.trim();
    if (!playerName) {
        alert("Please enter a player name.");
        return;
    }

    // Create player entry with a textbox for math operations
    const playerContainer = document.createElement("div");
    playerContainer.className = "player-entry";

    const playerLabel = document.createElement("label");
    if (playerIndex == 0) {
//        playerLabel.id = playerIndex;
        playerLabel.textContent = dealerTag + playerName;
    } else {
//        playerLabel.id = playerIndex;
        playerLabel.textContent = playerName;
    }

    playerLabel.id = playerIndex;
    playerIndex++;

    const mathTextbox = document.createElement("input");
    mathTextbox.type = "text";
    mathTextbox.placeholder = "Enter score";
    mathTextbox.className = "math-input";
    mathTextbox.className = "textBox";

    const scoreLabel = document.createElement("span");
    scoreLabel.textContent = "Score: 0";
    scoreLabel.className = "score-label";

    const submitMathBtn = document.createElement("button");
    submitMathBtn.textContent = "Submit";
    submitMathBtn.className = 'buttons';
    submitMathBtn.onclick = function() {
        const mathExpression = mathTextbox.value.trim();
        const currentScore = parseInt(scoreLabel.textContent.split(": ")[1]);

        // Validate input as a number or math expression
        let delta;
        if (/^[+-]?\d+$/.test(mathExpression)) {
            // Default to addition if no operator is provided
            delta = mathExpression.startsWith('+') || mathExpression.startsWith('-')
                ? parseInt(mathExpression)
                : parseInt(mathExpression); // Assume "+" if no operator
        } else {
            alert("Invalid input! Please enter a valid number (e.g., 5, +5, or -3).");
            return;
        }

        const newScore = currentScore + delta;
        scoreLabel.textContent = "Score: " + newScore;
        mathTextbox.value = ""; // Clear textbox after submission
    };

    // Append elements to the player container
    playerContainer.appendChild(playerLabel);
    playerContainer.appendChild(mathTextbox);
    playerContainer.appendChild(submitMathBtn);
    playerContainer.appendChild(scoreLabel);

    // Add player container to active player list
    const activePlayerList = document.getElementById("activePlayerList");
    activePlayerList.appendChild(playerContainer);

    // Clear the player textbox
    document.getElementById("playerTextbox").value = "";
};

// Save game button which will send player-stats to the backend
const saveGame = () => {
    let gameStats = {};
    const saveGameBtn = document.querySelector('#save-btn');
    saveGameBtn.addEventListener('click', () => {
        // Overcomplicated piece of poop
        // Need to get all the player info to send to backend
        const playerStats = document.querySelectorAll('.player-entry');
        const data = Array.from(playerStats).map(playerStat => playerStat.innerText);
        for (let i = 0; i < data.length; i++) {

            let cleanScore = data[i].split('\n')[2]
            cleanScore = parseInt(cleanScore.split('Score:')[1]);

            gameStats[`playerNumber${i}`] = {
                'name': data[i].split('\n')[0],
                'score': cleanScore
                //'score': data[i].split('\n')[2]
            };
        }
        //console.log(gameStats);
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameStats })
        });
    });
}

// Get highscore button
const getHighScore = () => {
    document.querySelector('#highScoreBtn').addEventListener('click', async () => {
        try {
            const response = await fetch('/get-score');
            const data = await response.json();

            const getScoreDiv = document.createElement('div');
            getScoreDiv.className = 'container';

            const scoreParagraph = document.createElement('p');
            scoreParagraph.id = 'scoreBox';
            scoreParagraph.textContent = `Best score: ${data.name} — with: ${data.score}`;

            getScoreDiv.appendChild(scoreParagraph);

            const target = document.querySelector('#highScoreDiv');
            target.parentNode.insertBefore(getScoreDiv, target.nextSibling);

        } catch (err) {
            console.error('Failed to fetch score:', err);
        }
    });
};
startGame();
saveGame();
getHighScore();

