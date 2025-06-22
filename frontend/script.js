const micBtn = document.getElementById('mic-btn');
const userQ = document.getElementById('user-question');
const resText = document.getElementById('response-text');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hi-IN';

micBtn.addEventListener('click', () => {
  recognition.start();
});

recognition.onresult = (event) => {
  const question = event.results[0][0].transcript;
  userQ.textContent = "👨‍🌾 आपने पूछा: " + question;
  getWeatherResponse(question);
};

function getWeatherResponse(question) {
  fetch('http://127.0.0.1:5000/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: question })
  })
  .then(res => res.json())
  .then(data => {
    resText.textContent = data.response;
    speakHindi(data.response);
  })
  .catch(err => {
    resText.textContent = "❌ कोई त्रुटि हुई!";
    console.error(err);
  });
}

function speakHindi(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = 'hi-IN';
  speech.text = text;
  window.speechSynthesis.speak(speech);
}