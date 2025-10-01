document.addEventListener('DOMContentLoaded', () => {
    // Find all the character trigger buttons
    const triggers = document.querySelectorAll('.character-trigger');

    // Function to close all open profile cards
    const closeAllCards = () => {
        document.querySelectorAll('.profile-card.is-visible').forEach(card => {
            card.classList.remove('is-visible');
        });
        // Reset all trigger ARIA states
        triggers.forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'false');
        });
    };

    // Add a click event listener to each trigger button
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            // Stop the click from bubbling up to the document listener immediately
            event.stopPropagation();

            const targetCardId = trigger.getAttribute('aria-controls');
            const targetCard = document.getElementById(targetCardId);

            if (!targetCard) return;

            // Check if the card we clicked to open is already visible
            const isAlreadyVisible = targetCard.classList.contains('is-visible');

            // First, close any card that might be open
            closeAllCards();

            // If the card was not already visible, open it now
            if (!isAlreadyVisible) {
                targetCard.classList.add('is-visible');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Add a listener to the whole document to close cards when clicking outside
    document.addEventListener('click', (event) => {
        // If the click is not inside a profile card, close all cards
        if (!event.target.closest('.profile-card')) {
            closeAllCards();
        }
    });

    // Add a listener for the 'Escape' key to close cards
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllCards();
        }
    });
});
