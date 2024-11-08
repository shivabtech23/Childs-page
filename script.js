async function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    if (!userInput) return;

    displayMessage(userInput, "user");

    document.getElementById("userInput").value = "";

    try {
        const response = await fetch("http://localhost:5000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        const reply = data.content || "Sorry, I couldn't process that. Try again!";

        displayMessage(reply, "chatgpt");
        speak(reply); // Speak the response

    } catch (error) {
        console.error("Error:", error);
        displayMessage("Sorry, I couldn't process that. Try again!", "chatgpt");
    }
}

function displayMessage(message, sender) {
    const chatLog = document.getElementById("chatLog");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender;
    messageDiv.innerText = message;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;

    if (sender === "chatgpt") {
        playWaveAnimation(); // Call animation when ChatGPT responds
    }
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'en-US'; // Set the language

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Select the default voice
    const defaultVoice = voices.find(voice => voice.lang === 'en-US'); // Adjust based on available voices
    if (defaultVoice) {
        speech.voice = defaultVoice;
    }

    window.speechSynthesis.speak(speech); // Speak the text
}

// Call this function to load the voices
window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log(voices); // Check available voices in the console
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true; // Get intermediate results
recognition.lang = 'en-US'; // Set the language

function startRecognition() {
    recognition.start();
}

// Listen for the result event
recognition.addEventListener('result', (event) => {
    const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    if (event.results[0].isFinal) {
        document.getElementById('userInput').value = transcript; // Update the input with the recognized text
        sendMessage(); // Send the message
    }
});

// Start recognition when the speak button is clicked
document.getElementById('startSpeech').addEventListener('click', startRecognition);

// Stop recognition when the stop button is clicked
document.getElementById('stopSpeech').addEventListener('click', () => {
    console.log("Stopping recognition..."); // Log when stop is pressed
    recognition.stop();
});

function playWaveAnimation() {
    const avatar = document.getElementById("characterAvatar");
    avatar.classList.add("wave");
    setTimeout(() => avatar.classList.remove("wave"), 1000);
}

function playBounceAnimation() {
    const avatar = document.getElementById("characterAvatar");
    avatar.classList.add("bounce");
    setTimeout(() => avatar.classList.remove("bounce"), 2000);
}

function playBlinkAnimation() {
    const avatar = document.getElementById("characterAvatar");
    avatar.classList.add("blink");
}

function stopBlinkAnimation() {
    const avatar = document.getElementById("characterAvatar");
    avatar.classList.remove("blink");
}

// Start blinking when user focuses on input
document.getElementById("userInput").addEventListener("focus", playBlinkAnimation);
document.getElementById("userInput").addEventListener("blur", stopBlinkAnimation);