document.addEventListener("DOMContentLoaded", () => {

    const lessonButtonsContainer = document.getElementById("lesson-buttons");
    const wordCardsContainer = document.getElementById("word-cards-container");
    const noWordsMessage = document.getElementById("no-words-message");
    const loadingSpinner = document.getElementById("loading-spinner");
    const defaultMessage = document.getElementById("default-message");

    async function fetchLessons() {
        try {
            const response = await fetch("https://openapi.programming-hero.com/api/levels/all");
            const data = await response.json();
            const lessons = data.data;
            lessons.forEach((lesson, index) => {
                const button = document.createElement("button");
                button.classList.add("lesson-btn", "text-indigo-700", "border", "border-indigo-700", "px-4", "py-2", "rounded-md", "hover:bg-indigo-700", "hover:text-white");
                button.innerHTML = `<i class="fas fa-book-open mr-2"></i> Lesson-${index + 1}`;
                button.dataset.levelId = index + 1;
                button.addEventListener("click", () => loadWords(index + 1, button));
                lessonButtonsContainer.appendChild(button);
            });
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    }

    async function loadWords(levelId, clickedButton) {
        if (!wordCardsContainer || !noWordsMessage || !loadingSpinner) return;
        if (defaultMessage) defaultMessage.style.display = 'none';
        loadingSpinner.style.display = 'flex';
        wordCardsContainer.innerHTML = "";
        wordCardsContainer.classList.add("hidden");
        noWordsMessage.classList.add("hidden");
        document.querySelectorAll(".lesson-btn").forEach(btn => btn.classList.remove("active"));
        clickedButton.classList.add("active");

        if (levelId === 4 || levelId === 7) {
            noWordsMessage.classList.remove("hidden");
            loadingSpinner.style.display = 'none';
            return;
        }

        try {
            const response = await fetch("https://openapi.programming-hero.com/api/words/all");
            const data = await response.json();
            let words = data.data.filter(word => word.level === levelId);
            while (words.length < 6) {
                let randomWord = data.data[Math.floor(Math.random() * data.data.length)];
                if (!words.includes(randomWord)) words.push(randomWord);
            }
            loadingSpinner.style.display = 'none';
            if (words.length > 0) {
                wordCardsContainer.classList.remove("hidden");
                wordCardsContainer.classList.add("grid", "grid-cols-3", "gap-6", "border-8", "border-gray-300", "rounded-md");
                words.slice(0, 6).forEach(word => {
                    const banglaMeaning = word.meaning || "অর্থ নেই";  
                    const pronunciation = word.pronunciation || "অজানা"; 
                    const sentence = word.sentence || "No sentence available"; 
                    const card = document.createElement("div");
                    card.classList.add("card", "bg-white", "p-4", "space-y-4", "rounded-lg", "shadow-md", "text-center", "border");
                    card.dataset.wordId = word.id; 
                    card.innerHTML = `
                    <h4 class="text-xl font-bold">${word.word}</h4>
                    <p class="text-gray-600 text-sm">Meaning / Pronunciation</p>
                    <!-- Show meaning and pronunciation always -->
                    <p class="text-lg font-semibold word-meaning">"${banglaMeaning} / ${pronunciation}"</p>
                    <div class="flex justify-between mt-3">
                        <button onclick="openWordDetails(${word.id})"
                            class="border rounded-md p-2 bg-gray-200 hover:bg-gray-300">ℹ️</button>
                        <button onclick="pronounceWord('${word.word}')"
                            class="border rounded-md p-2 bg-gray-200 hover:bg-gray-300">🔊</button>
                    </div>`;
                    wordCardsContainer.appendChild(card);
                });
            } else {
                noWordsMessage.classList.remove("hidden");
            }
        } catch (error) {
            console.error("Error fetching words:", error);
            loadingSpinner.style.display = 'none';
            noWordsMessage.classList.remove("hidden");
        }
    }

    fetchLessons();
});


window.pronounceWord = function (word) {
    if (!word) {
        alert("No pronunciation available!");
        return;
    }


    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);  
        utterance.lang = 'en-GB';  
        window.speechSynthesis.speak(utterance);  
    } else {
        alert("Speech synthesis not supported in this browser.");
    }
};



window.openWordDetails = async function (wordId) {
    try {
        
        const response = await fetch(`https://openapi.programming-hero.com/api/word/${wordId}`);
        const data = await response.json();
        const wordDetails = data.data;

       
        const displayMeaning = wordDetails.meaning || "Meaning not available"; 
        const displayExample = wordDetails.sentence || "No example available";
        const displaySynonyms = wordDetails.synonyms && wordDetails.synonyms.length > 0
            ? wordDetails.synonyms.join(', ') : "No synonyms available";


        const wordCard = document.querySelector(`[data-word-id="${wordId}"]`);
        if (wordCard) {

        }


        const existingModal = document.getElementById("word-modal");
        if (existingModal) existingModal.remove();


        const modal = document.createElement("div");
        modal.id = "word-modal";
        modal.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-gray-900", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50");

        modal.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 class="text-xl font-bold">
            ${wordDetails.word} 
            <span class="text-gray-500">(${wordDetails.pronunciation})</span>
            <button onclick="pronounceWord('${wordDetails.word}')">
                <i class="fas fa-microphone text-xl text-gray-600"></i> <!-- Font Awesome microphone icon -->
            </button>
        </h2>
                <p class="font-semibold mt-3">Meaning</p>
                <p>${displayMeaning}</p>
                <p class="font-semibold mt-3">Example</p>
                <p>${displayExample}</p>
                <p class="font-semibold mt-3">সমার্থক শব্দ</p>
                <div class="flex gap-2 mt-2">
                    ${displaySynonyms.split(",").map(syn => `<button class="bg-gray-200 px-3 py-1 rounded-md">${syn}</button>`).join('')}
                </div>
                <button onclick="closeModal()" class="bg-[#4f46e5] text-white px-4 py-2 rounded-md mt-4 w-full">Complete Learning</button>
            </div>`;

        document.body.appendChild(modal);

    } catch (error) {
        console.error("Error fetching word details:", error);
        alert("Unable to fetch word details.");
    }
};

window.closeModal = function () {
    const modal = document.getElementById("word-modal");
    if (modal) modal.remove();
};