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
    const response = await fetch('http://34.227.143.202/api/message', {
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

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    } else {
      console.warn("Hindi voice not found. Using default.");
    }

    speechSynthesis.cancel(); // cancel any previous speech
    window.speechSynthesis.speak(utterance);
  }
}

// force load voices
speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};

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

// Toggle Login/Signup Modal or User Info
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
    const res = await fetch('http://34.227.143.202/api/register', {
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
    const res = await fetch('http://34.227.143.202/api/login', {
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

// 🌦️ Weather Feature
const weatherBtn = document.getElementById('weather-btn');
const weatherModal = document.getElementById('weather-modal');
const weatherText = document.getElementById('weather-text');
const weatherClose = document.getElementById('weather-close');

weatherBtn.addEventListener('click', () => {
  weatherText.textContent = "स्थान की जानकारी प्राप्त की जा रही है...";
  weatherModal.classList.remove('hidden');

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const apiKey = "mukUJUKYnnjzcLsHUARDOgZeLMo2hYsf";
        const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();
        const t = data.timelines?.daily?.[0]?.values;

        if (!t) {
          weatherText.textContent = "मौसम डेटा उपलब्ध नहीं है।";
          return;
        }

        const avgTemp = t.temperatureAvg;
        const rainChance = t.precipitationProbabilityAvg;

        let cropAdvice = "";
        if (avgTemp >= 25 && rainChance >= 50) {
          cropAdvice = "🌾 धान (Rice) के लिए उपयुक्त समय।";
        } else if (avgTemp >= 18 && rainChance <= 30) {
          cropAdvice = "🌿 गेहूं या चना के लिए बेहतर मौसम।";
        } else {
          cropAdvice = "🧑‍🌾 मौसम अनिश्चित है, देखभाल करें।";
        }

        weatherText.innerHTML = `
          📍 स्थिति: ${lat.toFixed(2)}, ${lon.toFixed(2)}<br><br>
          🌡️ तापमान: <strong>${avgTemp}°C</strong><br>
          🌧️ बारिश की संभावना: <strong>${rainChance}%</strong><br><br>
          ✅ सलाह: <strong>${cropAdvice}</strong>
        `;
      } catch (error) {
        weatherText.textContent = "❌ मौसम डेटा प्राप्त नहीं हो सका।";
      }
    }, () => {
      weatherText.textContent = "📍 स्थान अनुमति अस्वीकृत!";
    });
  } else {
    weatherText.textContent = "❌ ब्राउज़र स्थान समर्थन नहीं करता।";
  }
});

weatherClose.addEventListener('click', () => {
  weatherModal.classList.add('hidden');
});
document.getElementById("speak-weather").addEventListener("click", () => {
  const weatherRawText = document.getElementById("weather-text").innerText || document.getElementById("weather-text").textContent;
  speakHindi(weatherRawText);
});





document.addEventListener('DOMContentLoaded', function () {
  const newsBtn = document.getElementById('news-btn');
  const newsModal = document.getElementById('news-modal');
  const newsClose = document.getElementById('news-close');
  const newsList = document.getElementById('news-list');
  const nextNews = document.getElementById('next-news');
  const prevNews = document.getElementById('prev-news');

  const agriNews = [
    "केंद्र सरकार ने MSP में ₹200 की वृद्धि की घोषणा की।",
    "खरीफ फसलों की बुआई 10% अधिक हुई इस वर्ष।",
    "बिहार में पहली बार ड्रोन से कीटनाशक छिड़काव शुरू।",
    "कर्नाटक में भारी बारिश से प्याज फसल को नुकसान।",
    "ICAR ने नया हाई-प्रोटीन गेहूं किस्म लॉन्च किया।",
    "किसानों के लिए 0% ब्याज दर पर क्रेडिट कार्ड योजना।",
    "गुजरात में ऑर्गेनिक खेती को बढ़ावा मिलेगा सब्सिडी से।",
    "सभी किसानों को सॉयल हेल्थ कार्ड देने का लक्ष्य रखा।",
    "भारत से आम का निर्यात UAE को 15% बढ़ा।",
    "पंजाब में पानी की कमी से धान की खेती में गिरावट।",
    "बायो-फर्टिलाइज़र पर नई रिसर्च रिपोर्ट जारी की।",
    "मुफ्त बीज वितरण कार्यक्रम शुरू।",
    "AI आधारित फसल बीमा प्लेटफॉर्म लॉन्च।",
    "गेहूं की रिकॉर्ड उत्पादन की उम्मीद।",
    "फसल कैलेंडर ऐप अब हिंदी में भी उपलब्ध।"
  ];

  let currentNewsIndex = 0;
  const pageSize = 3;

  function renderNews() {
    newsList.innerHTML = '';
    const visibleNews = agriNews.slice(currentNewsIndex, currentNewsIndex + pageSize);

    visibleNews.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'news-card';
      div.innerHTML = `<strong>📰 खबर ${currentNewsIndex + index + 1}:</strong> ${item}`;
      newsList.appendChild(div);
    });

    prevNews.disabled = currentNewsIndex === 0;
    nextNews.disabled = currentNewsIndex + pageSize >= agriNews.length;
  }

  newsBtn.addEventListener('click', () => {
    currentNewsIndex = 0;
    renderNews();
    newsModal.classList.remove('hidden');
  });

  newsClose.addEventListener('click', () => {
    newsModal.classList.add('hidden');
  });

  nextNews.addEventListener('click', () => {
    if (currentNewsIndex + pageSize < agriNews.length) {
      currentNewsIndex += pageSize;
      renderNews();
    }
  });

  prevNews.addEventListener('click', () => {
    if (currentNewsIndex - pageSize >= 0) {
      currentNewsIndex -= pageSize;
      renderNews();
    }
  });
});



// 🆕 Mandi Modal Logic
const mandiBtn = document.getElementById('mandi-btn');
const mandiModal = document.getElementById('mandi-modal');
const mandiClose = document.getElementById('mandi-close');
const mandiList = document.getElementById('mandi-list');
const mandiNext = document.getElementById('mandi-next');
const mandiPrev = document.getElementById('mandi-prev');

let mandiPage = 1;

async function loadMandiData(page) {
  try {
    const res = await fetch(`http://34.227.143.202/api/mandi?page=${page}`);
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
      const res = await fetch(`http://34.227.143.202/api/farming-calendar?state=${state}&month=${month}`);
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

  speakCalendar.addEventListener('click', () => {
    const cards = document.querySelectorAll('.calendar-card');
    let speech = '';
    cards.forEach(card => speech += card.textContent + '। ');
    speakHindi(speech || 'कोई डेटा नहीं मिला');
  });

  function getHindiMonth(num) {
    const names = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
    return names[num - 1] || num;
  }

  function speakHindi(text) {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'hi-IN';
      speechSynthesis.cancel();
      speechSynthesis.speak(msg);
    }
  }
});



// 🌾 Fertilizer Calculator Logic
document.addEventListener('DOMContentLoaded', function () {
  const fertBtn = document.getElementById('fertilizer-btn');
  const fertModal = document.getElementById('fertilizer-modal');
  const fertClose = document.getElementById('fertilizer-close');
  const fertCalcBtn = document.getElementById('fertilizer-calculate');
  const fertResult = document.getElementById('fertilizer-result');

  // Open modal
  fertBtn.addEventListener('click', () => {
    fertResult.innerHTML = "";
    fertModal.classList.remove('hidden');
  });

  // Close modal
  fertClose.addEventListener('click', () => {
    fertModal.classList.add('hidden');
  });

  // Calculate Fertilizer
  fertCalcBtn.addEventListener('click', async () => {
    const crop = document.getElementById('fertilizer-crop').value.trim().toLowerCase();
    const area = parseFloat(document.getElementById('fertilizer-area').value);
    const unit = document.getElementById('fertilizer-unit').value;

    if (!crop || isNaN(area) || area <= 0) {
      fertResult.innerHTML = "⚠️ कृपया सभी फ़ील्ड सही से भरें।";
      return;
    }

    try {
      const res = await fetch(`http://34.227.143.202/api/fertilizer?crop=${crop}&area=${area}&unit=${unit}`);
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




  const lockerBtn = document.getElementById("krishi-locker-btn");
  const lockerModal = document.getElementById("krishi-locker-modal");
  const lockerClose = document.getElementById("krishi-locker-close");
  const uploadBtn = document.getElementById("upload-btn");
  const fileInput = document.getElementById("file-upload");
  const fileList = document.getElementById("file-list");
  const uploadMsg = document.getElementById("upload-message");

  let uploadedFiles = [];

  // Open modal
  lockerBtn.addEventListener("click", () => {
    lockerModal.classList.remove("hidden");
  });

  // Close modal
  lockerClose.addEventListener("click", () => {
    lockerModal.classList.add("hidden");
  });

  // Upload files to memory
  uploadBtn.addEventListener("click", () => {
    const files = Array.from(fileInput.files);

    if (files.length === 0) {
      uploadMsg.textContent = "कृपया पहले कुछ फ़ाइलें चुनें।";
      uploadMsg.style.color = "red";
      return;
    }

    uploadedFiles.push(...files);
    displayFiles();

    uploadMsg.textContent = `${files.length} फ़ाइलें सफलतापूर्वक अपलोड हो गईं!`;
    uploadMsg.style.color = "green";

    fileInput.value = "";
  });

  function displayFiles() {
    fileList.innerHTML = "";

    uploadedFiles.forEach((file, index) => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.textContent = file.name;
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      link.target = "_blank";

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.onclick = () => {
        uploadedFiles.splice(index, 1);
        displayFiles();
      };

      li.appendChild(link);
      li.appendChild(removeBtn);
      fileList.appendChild(li);
    });
  }





  









    // ✅ Emergency Modal Toggle
document.addEventListener('DOMContentLoaded', function () {
  const emergencyBtn = document.getElementById('emergencyBtn');
  const emergencyModal = document.getElementById('emergency-modal');
  const closeEmergency = document.getElementById('close-emergency');

  // Show modal on click
  emergencyBtn.addEventListener('click', () => {
    emergencyModal.style.display = 'flex';
  });

  // Close modal on close button click
  closeEmergency.addEventListener('click', () => {
    emergencyModal.style.display = 'none';
  });

  // Optional: close modal when clicking outside the box
  emergencyModal.addEventListener('click', (e) => {
    if (e.target === emergencyModal) {
      emergencyModal.style.display = 'none';
    }
  });
});



  // Get elements
  const aboutBtn = document.getElementById("aboutBtn");
  const contactBtn = document.getElementById("contactBtn");
  const popupOverlay = document.getElementById("popupOverlay");
  const popupTitle = document.getElementById("popupTitle");
  const popupContent = document.getElementById("popupContent");
  const closePopup = document.getElementById("closePopup");

  // About Us button click
  aboutBtn.addEventListener("click", () => {
    popupTitle.innerText = "हमारे बारे में";
    popupContent.innerText = "AgriVaani किसानों के लिए एक डिजिटल साथी है जो मौसम, कृषि सलाह और मंडी भाव की जानकारी प्रदान करता है।";
    popupOverlay.style.display = "block";
  });

  // Contact Us button click
  contactBtn.addEventListener("click", () => {
    popupTitle.innerText = "संपर्क करें";
    popupContent.innerText = "📧 support@agrivaani.in\n📞 +91-1234567890";
    popupOverlay.style.display = "block";
  });

  // Close popup on ✖
  closePopup.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Optional: Close popup when clicking outside content
  window.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });


