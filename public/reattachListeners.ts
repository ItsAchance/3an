function reattachListeners(): void {
    const submitMathBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.submitMathBtns');

    submitMathBtns.forEach(function(btn: HTMLButtonElement): void {
        const playerEntry: HTMLElement | null = btn.closest('.player-entry');
        if (!playerEntry) return;

        const mathTextbox: HTMLInputElement | null = playerEntry.querySelector('.math-input');
        const scoreLabel: HTMLSpanElement | null = playerEntry.querySelector('.score-label');

        if (!mathTextbox || !scoreLabel) return;

        btn.onclick = function(): void {
            const mathExpression: string = mathTextbox.value.trim();
            const currentScoreText: string = scoreLabel.textContent?.split(": ")[1] || "0";
            const currentScore: number = parseInt(currentScoreText);

            let delta: number;
            if (/^[+-]?\d+$/.test(mathExpression)) {
                delta = parseInt(mathExpression);
            } else {
                alert("Invalid input! Please enter a valid number (e.g., 5, +5, or -3).");
                return;
            }

            const newScore: number = currentScore + delta;
            scoreLabel.textContent = "Score: " + newScore;
            mathTextbox.value = "";
        };
    });
}
