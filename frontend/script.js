// Particles.js Background
document.addEventListener('DOMContentLoaded', function () {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.2, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      }
    });
  }
});

// Mic Recognition Logic
const micBtn = document.getElementById('mic-btn');
const userQ = document.getElementById('user-question');
const resText = document.getElementById('response-text');
const loader = document.getElementById('loader');

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  micBtn.disabled = true;
  micBtn.textContent = "🎤 ब्राउज़र समर्थित नहीं";
  micBtn.style.background = "#e53e3e";
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hi-IN';

micBtn.addEventListener('click', () => {
  resText.textContent = "सुन रहा हूँ...";
  micBtn.classList.add('pulse');
  recognition.start();
});

recognition.onresult = (event) => {
  const question = event.results[0][0].transcript;
  userQ.textContent = "👨‍🌾 आपने पूछा: " + question;
  getAIResponse(question);
};

recognition.onerror = (event) => {
  userQ.textContent = "आवाज़ पहचानने में समस्या";
  resText.textContent = "त्रुटि: " + event.error;
  micBtn.classList.remove('pulse');
  loader.style.display = 'none';
};

recognition.onend = () => {
  micBtn.classList.remove('pulse');
};

async function getAIResponse(question) {
  try {
    loader.style.display = 'block';
    resText.textContent = "प्रसंस्करण...";
    const response = await fetch('http://44.203.141.245/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question })
    });
    const data = await response.json();
    loader.style.display = 'none';
    resText.textContent = data.reply;
    speakHindi(data.reply);
  } catch (err) {
    loader.style.display = 'none';
    resText.textContent = "सर्वर से जुड़ने में त्रुटि";
  }
}

// ✅ Hindi Speech Fix
function speakHindi(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.name.toLowerCase().includes('hindi'));
    if (hindiVoice) utterance.voice = hindiVoice;
    speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}
speechSynthesis.onvoiceschanged = () => { speechSynthesis.getVoices(); };

// Auth Logic
const userIcon = document.getElementById('user-icon');
const modal = document.getElementById('auth-modal');
const closeBtn = document.getElementById('close-auth');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authMsg = document.getElementById('auth-message');

// User Info Modal Elements
const userInfoModal = document.getElementById('user-info-modal');
const closeUserInfo = document.getElementById('close-user-info');
const logoutBtn = document.getElementById('logout-btn');
const userNameDisplay = document.getElementById('user-name-display');
const userMobileDisplay = document.getElementById('user-mobile-display');

userIcon.addEventListener('click', () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    userMobileDisplay.textContent = `मोबाइल: ${user.mobile}`;
    userInfoModal.classList.remove('hidden');
  } else {
    modal.classList.remove('hidden');
    authMsg.textContent = '';
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
  }
});

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  loginForm.reset();
  signupForm.reset();
  authMsg.textContent = '';
});

closeUserInfo.addEventListener('click', () => {
  userInfoModal.classList.add('hidden');
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  userInfoModal.classList.add('hidden');
});

loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.style.display = 'flex';
  signupForm.style.display = 'none';
  authMsg.textContent = '';
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.style.display = 'flex';
  loginForm.style.display = 'none';
  authMsg.textContent = '';
});

// Signup Submit
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('signup-name').value,
    area: document.getElementById('signup-area').value,
    country: document.getElementById('signup-country').value,
    state: document.getElementById('signup-state').value,
    mobile: document.getElementById('signup-mobile').value,
    password: document.getElementById('signup-password').value
  };

  try {
    const res = await fetch('http://44.203.141.245/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    authMsg.textContent = result.message;
    authMsg.style.color = result.success ? 'green' : 'red';
    if (result.success) {
      signupForm.reset();
      setTimeout(() => {
        loginTab.click();
        authMsg.textContent = '';
      }, 1000);
    }
  } catch (err) {
    authMsg.textContent = "⚠️ सर्वर त्रुटि";
    authMsg.style.color = 'red';
  }
});

// Login Submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    mobile: document.getElementById('login-mobile').value,
    password: document.getElementById('login-password').value
  };

  try {
    const res = await fetch('http://44.203.141.245/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    authMsg.textContent = result.message;
    authMsg.style.color = result.success ? 'green' : 'red';
    if (result.success) {
      localStorage.setItem('loggedInUser', JSON.stringify({
        name: result.name || "किसान मित्र",
        mobile: data.mobile
      }));
      loginForm.reset();
      setTimeout(() => {
        modal.classList.add('hidden');
        authMsg.textContent = '';
      }, 1000);
    }
  } catch (err) {
    authMsg.textContent = "⚠️ लॉगिन में त्रुटि";
    authMsg.style.color = 'red';
  }
});

// Mandi Modal Logic
const mandiBtn = document.getElementById('mandi-btn');
const mandiModal = document.getElementById('mandi-modal');
const mandiClose = document.getElementById('mandi-close');
const mandiList = document.getElementById('mandi-list');
const mandiNext = document.getElementById('mandi-next');
const mandiPrev = document.getElementById('mandi-prev');

let mandiPage = 1;

async function loadMandiData(page) {
  try {
    const res = await fetch(`http://44.203.141.245/api/mandi?page=${page}`);
    const result = await res.json();

    mandiList.innerHTML = '';
    result.data.forEach((item, index) => {
      const div = document.createElement('div');
      div.innerHTML = `🌾 <strong>${item.crop}</strong> (${item.state}) - ₹${item.rate}/क्विंटल`;
      mandiList.appendChild(div);
    });

    mandiPrev.disabled = page === 1;
    mandiNext.disabled = page >= result.total_pages;
  } catch (err) {
    mandiList.innerHTML = "❌ डेटा लोड नहीं हुआ।";
  }
}

mandiBtn.addEventListener('click', () => {
  mandiModal.classList.remove('hidden');
  mandiPage = 1;
  loadMandiData(mandiPage);
});

mandiClose.addEventListener('click', () => {
  mandiModal.classList.add('hidden');
});

mandiNext.addEventListener('click', () => {
  mandiPage++;
  loadMandiData(mandiPage);
});

mandiPrev.addEventListener('click', () => {
  if (mandiPage > 1) {
    mandiPage--;
    loadMandiData(mandiPage);
  }
});

// Calendar Logic
document.addEventListener('DOMContentLoaded', () => {
  const calendarBtn = document.getElementById('calendar-btn');
  const calendarModal = document.getElementById('calendar-modal');
  const closeCalendar = document.getElementById('close-calendar');
  const calendarState = document.getElementById('calendar-state');
  const calendarMonth = document.getElementById('calendar-month');
  const calendarSearch = document.getElementById('calendar-search');
  const calendarResults = document.getElementById('calendar-results');
  const speakCalendar = document.getElementById('speak-calendar');

  calendarBtn.addEventListener('click', () => {
    calendarModal.classList.remove('hidden');
    calendarResults.innerHTML = '<p>राज्य और माह चुनें और खोजें।</p>';
  });

  closeCalendar.addEventListener('click', () => {
    calendarModal.classList.add('hidden');
  });

  calendarSearch.addEventListener('click', async () => {
    const state = calendarState.value;
    const month = calendarMonth.value;

    if (!state) {
      calendarResults.innerHTML = '<p class="error">⚠️ कृपया राज्य चुनें</p>';
      return;
    }

    calendarResults.innerHTML = '<div class="loader"></div>';

    try {
      const res = await fetch(`http://44.203.141.245/api/farming-calendar?state=${state}&month=${month}`);
      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        calendarResults.innerHTML = '<p>कोई जानकारी उपलब्ध नहीं।</p>';
        return;
      }

      let html = '';
      data.data.forEach(item => {
        const monthName = getHindiMonth(item.month);
        html += `
          <div class="calendar-card">
            <h4>${monthName}</h4>
            <p><strong>🌾 फसलें:</strong> ${item.crops}</p>
            <p><strong>🔧 गतिविधियाँ:</strong> ${item.activities}</p>
            <p><strong>⚠️ सावधानियाँ:</strong> ${item.precautions}</p>
          </div>
        `;
      });

      calendarResults.innerHTML = html;
    } catch (err) {
      calendarResults.innerHTML = '<p class="error">❌ सर्वर समस्या</p>';
    }
  });

  function getHindiMonth(num) {
    const names = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
    return names[num - 1] || num;
  }

  speakCalendar.addEventListener('click', () => {
    const cards = document.querySelectorAll('.calendar-card');
    let speech = '';
    cards.forEach(card => speech += card.textContent + '। ');
    speakHindi(speech || 'कोई डेटा नहीं मिला');
  });
});

// Fertilizer Logic
document.addEventListener('DOMContentLoaded', function () {
  const fertBtn = document.getElementById('fertilizer-btn');
  const fertModal = document.getElementById('fertilizer-modal');
  const fertClose = document.getElementById('fertilizer-close');
  const fertCalcBtn = document.getElementById('fertilizer-calculate');
  const fertResult = document.getElementById('fertilizer-result');

  fertBtn.addEventListener('click', () => {
    fertResult.innerHTML = "";
    fertModal.classList.remove('hidden');
  });

  fertClose.addEventListener('click', () => {
    fertModal.classList.add('hidden');
  });

  fertCalcBtn.addEventListener('click', async () => {
    const crop = document.getElementById('fertilizer-crop').value.trim().toLowerCase();
    const area = parseFloat(document.getElementById('fertilizer-area').value);
    const unit = document.getElementById('fertilizer-unit').value;

    if (!crop || isNaN(area) || area <= 0) {
      fertResult.innerHTML = "⚠️ कृपया सभी फ़ील्ड सही से भरें।";
      return;
    }

    try {
      const res = await fetch(`http://44.203.141.245/api/fertilizer?crop=${crop}&area=${area}&unit=${unit}`);
      const data = await res.json();

      if (data.error) {
        fertResult.innerHTML = `❌ ${data.error}`;
      } else {
        fertResult.innerHTML = `
          ✅ <strong>${data.crop}</strong> के लिए <strong>${data.area_in_hectare} हेक्टेयर</strong> में:
          <ul>
            <li>💊 यूरिया: <strong>${data.urea_kg} kg</strong></li>
            <li>🌿 DAP: <strong>${data.dap_kg} kg</strong></li>
            <li>🧂 पोटाश: <strong>${data.potash_kg} kg</strong></li>
          </ul>
        `;
      }
    } catch (err) {
      fertResult.innerHTML = "❌ सर्वर से डेटा नहीं मिला।";
    }
  });
});

// Remaining modal logic unchanged...
