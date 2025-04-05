 // JavaScript
 const wordElement = document.getElementById("word");
 const translationElement = document.getElementById("translation");
 const flashcard = document.getElementById("flashcard");
 const languageSelect = document.getElementById("language-select");
 const progressBar = document.getElementById("progress-bar");
 const darkModeToggle = document.getElementById("dark-mode-toggle");

 const words = {
     english: [
         { word: "Hello", translation: "Hello" },
         { word: "Thank you", translation: "Thank you" },
         { word: "Goodbye", translation: "Goodbye" },
         { word: "Friend", translation: "Friend" },
         { word: "Food", translation: "Food" }
     ],
     turkish: [
         { word: "Merhaba", translation: "Hello" },
         { word: "Teşekkürler", translation: "Thank you" },
         { word: "Hoşça kal", translation: "Goodbye" },
         { word: "Arkadaş", translation: "Friend" },
         { word: "Yemek", translation: "Food" }
     ],
     german: [
         { word: "Hallo", translation: "Hello" },
         { word: "Danke", translation: "Thank you" },
         { word: "Auf Wiedersehen", translation: "Goodbye" },
         { word: "Freund", translation: "Friend" },
         { word: "Essen", translation: "Food" }
     ]
 };

 let currentLanguage = localStorage.getItem("selectedLanguage") || "english";
 let currentIndex = 0;
 let darkMode = localStorage.getItem("darkMode") === "enabled";

 // Initialize
 function init() {
     languageSelect.value = currentLanguage;
     if (darkMode) document.body.classList.add("dark-mode");
     updateCard();
     addEventListeners();
 }

 function addEventListeners() {
     document.getElementById("flip").addEventListener("click", flipCard);
     document.getElementById("next").addEventListener("click", nextCard);
     document.getElementById("prev").addEventListener("click", prevCard);
     document.getElementById("shuffle").addEventListener("click", shuffleCards);
     document.getElementById("reset").addEventListener("click", resetCards);
     document.getElementById("add-word").addEventListener("click", addCustomWord);
     languageSelect.addEventListener("change", changeLanguage);
     darkModeToggle.addEventListener("click", toggleDarkMode);
     flashcard.addEventListener("click", flipCard);
     document.addEventListener("keydown", handleKeyboard);
 }

 function updateCard() {
     const currentWords = words[currentLanguage];
     wordElement.textContent = currentWords[currentIndex].word;
     translationElement.textContent = currentWords[currentIndex].translation;
     updateProgress();
     flashcard.classList.remove("flipped");
 }

 function updateProgress() {
     const progress = (currentIndex + 1) / words[currentLanguage].length * 100;
     progressBar.style.width = `${progress}%`;
 }

 function flipCard() {
     flashcard.classList.toggle("flipped");
 }

 function nextCard() {
     currentIndex = (currentIndex + 1) % words[currentLanguage].length;
     updateCard();
 }

 function prevCard() {
     currentIndex = (currentIndex - 1 + words[currentLanguage].length) % words[currentLanguage].length;
     updateCard();
 }

 function shuffleCards() {
     words[currentLanguage] = words[currentLanguage].sort(() => Math.random() - 0.5);
     currentIndex = 0;
     updateCard();
 }

 function resetCards() {
     currentIndex = 0;
     updateCard();
 }

 function addCustomWord() {
     const wordInput = document.getElementById("custom-word");
     const translationInput = document.getElementById("custom-translation");
     
     if (wordInput.value.trim() && translationInput.value.trim()) {
         words[currentLanguage].push({
             word: wordInput.value.trim(),
             translation: translationInput.value.trim()
         });
         wordInput.value = "";
         translationInput.value = "";
         updateCard();
     }
 }

 function changeLanguage() {
     currentLanguage = this.value;
     localStorage.setItem("selectedLanguage", currentLanguage);
     flashcard.className = `flashcard language-${currentLanguage}`;
     resetCards();
 }

 function toggleDarkMode() {
     document.body.classList.toggle("dark-mode");
     darkMode = !darkMode;
     localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");
 }

 function handleKeyboard(e) {
     switch(e.key) {
         case "ArrowLeft": prevCard(); break;
         case "ArrowRight": nextCard(); break;
         case " ": flipCard(); break;
     }
 }

 // Start the app
 init();