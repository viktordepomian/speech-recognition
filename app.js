if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  const resultDiv = document.getElementById("result");
  const startBtn = document.getElementById("start-btn");
  const languageSelect = document.getElementById("language-select");
  let isListening = false;
  let finalTranscript = "";

  languageSelect.addEventListener("change", (event) => {
    recognition.lang = event.target.value;
  });

  const toggleRecognition = () => {
    if (isListening) {
      recognition.stop();
      startBtn.textContent = "Press and Talk";
    } else {
      recognition.start();
      startBtn.textContent = "Stop";
    }
    isListening = !isListening;
  };

  const updateTranscript = (event) => {
    let interimTranscript = "";

    setTimeout(() => {
      Array.from(event.results)
        .slice(event.resultIndex)
        .forEach((result) => {
          if (result.isFinal) {
            finalTranscript += formatText(result[0].transcript.trim()) + " ";
          } else {
            interimTranscript += result[0].transcript;
          }
        });

      resultDiv.innerHTML = `${finalTranscript}<span style="color:gray;">${interimTranscript}</span>`;
      resultDiv.scrollTop = resultDiv.scrollHeight;
    }, 50);
  };

  const formatText = (text) => {
    text = text.charAt(0).toUpperCase() + text.slice(1);
    return /[.!?]$/.test(text) ? text : `${text}.`.replace(/\bi\b/g, "I");
  };

  const updateListeningState = (state) => {
    if (state) {
      startBtn.classList.add("listening");
    } else {
      startBtn.classList.remove("listening");
    }
  };

  recognition.onend = () => {
    if (isListening) {
      recognition.start();
    } else {
      resultDiv.innerHTML += "<br>I ain't listening.<br>";
    }
  };

  recognition.onerror = (event) => {
    console.error(`Speech recognition error: ${event.error}`);
    resultDiv.innerHTML += `Error: ${event.error}<br>`;
    updateListeningState(false);
  };

  startBtn.addEventListener("click", () => {
    toggleRecognition();
    updateListeningState(isListening);
  });
  recognition.addEventListener("result", updateTranscript);

  recognition.lang = "en-US";
} else {
  alert("Speech recognition is not supported.");
}
