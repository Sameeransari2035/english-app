// ==========================================
// 1. SIDEBAR TOGGLE (Hamburger Menu)
// ==========================================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('sidebarOverlay').classList.toggle('active');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

// ==========================================
// 2. BOTTOM NAVIGATION (Pages Switch)
// ==========================================
function navigate(pageName, element) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  const targetPage = document.getElementById('page-' + pageName);
  if (targetPage) targetPage.classList.add('active');
  
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if(element) element.classList.add('active');
}

// ==========================================
// 3. SIDEBAR DYNAMIC PAGES
// ==========================================
function showDynamicPage(pageType) {
  closeSidebar();
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-dynamic').classList.add('active');
  
  const titleEl = document.getElementById('dynamicTitle');
  const contentEl = document.getElementById('dynamicContent');
  
  const pages = {
    profile: { 
      title: 'My Profile', 
      html: `
        <div class="info-card">
          <h3>👤 <span id="displayName">John Doe</span></h3>
          <p>Email: <span id="displayEmail">john@example.com</span></p>
          <p>Joined: Jan 2024</p>
          <p>Level: Intermediate (B1)</p>
          <button class="btn-primary" style="margin-top: 15px; padding: 8px 15px; font-size: 13px;" onclick="openEditProfile()">Edit Profile</button>
        </div>
      ` 
    },
  };
  
  const page = pages[pageType];
  if (page) {
    titleEl.textContent = page.title;
    contentEl.innerHTML = page.html;
  }
}

// ==========================================
// 4. FAQ TOGGLE
// ==========================================
function toggleFaq(element) {
  element.classList.toggle('open');
}

// ==========================================
// LEVEL 1: LOCALSTORAGE (DATA SAVE KARNA)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
  let currentCoins = localStorage.getItem('userCoins') || 850;
  let currentLessons = localStorage.getItem('userLessons') || 42;
  let currentStreak = localStorage.getItem('userStreak') || 15;

  updateUI(currentCoins, currentLessons, currentStreak);

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    const statusText = document.getElementById('dark-mode-status');
    if(statusText) statusText.innerText = 'ON';
  }
});

function updateUI(coins, lessons, streak) {
  if(document.getElementById('coins-display')) document.getElementById('coins-display').innerText = coins;
  if(document.getElementById('lessons-display')) document.getElementById('lessons-display').innerText = lessons;
  if(document.getElementById('streak-display')) document.getElementById('streak-display').innerText = streak;
}

function completeLesson() {
  let currentCoins = parseInt(localStorage.getItem('userCoins') || 850);
  let currentLessons = parseInt(localStorage.getItem('userLessons') || 42);
  let currentStreak = parseInt(localStorage.getItem('userStreak') || 15);

  let newCoins = currentCoins + 20;
  let newLessons = currentLessons + 1;

  localStorage.setItem('userCoins', newCoins);
  localStorage.setItem('userLessons', newLessons);
  
  updateUI(newCoins, newLessons, currentStreak);
  
  showToast('🎉 Lesson Completed! +20 Coins', 'success');
}

// ==========================================
// LEVEL 2: QUIZ LOGIC
// ==========================================
const quizData = [
  { question: "What is the meaning of 'Eloquent'?", options: ["Fluent or persuasive", "Very slow", "Extremely angry", "Easily scared"], correctAnswer: 0 },
  { question: "Choose the correct spelling:", options: ["Recieve", "Receive", "Receeve", "Receve"], correctAnswer: 1 },
  { question: "What is the past tense of 'Go'?", options: ["Goed", "Gone", "Went", "Going"], correctAnswer: 2 }
];

let currentQuestionIndex = 0;

function startQuiz() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-quiz').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  currentQuestionIndex = 0;
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
  
  loadQuestion();
}

function loadQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  document.getElementById('question-text').innerText = currentQuestion.question;
  
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  currentQuestion.options.forEach((optionText, index) => {
    const button = document.createElement('button');
    button.className = 'quiz-option-btn';
    button.innerText = optionText;
    button.onclick = () => checkAnswer(index, button);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selectedIndex, clickedButton) {
  const currentQuestion = quizData[currentQuestionIndex];
  const allOptions = document.querySelectorAll('.quiz-option-btn');
  allOptions.forEach(btn => btn.disabled = true);

  if (selectedIndex === currentQuestion.correctAnswer) {
    clickedButton.classList.add('correct');
    let currentCoins = parseInt(localStorage.getItem('userCoins') || 850);
    let newCoins = currentCoins + 10;
    localStorage.setItem('userCoins', newCoins);
    
    if(document.getElementById('coins-display')) document.getElementById('coins-display').innerText = newCoins;
    
    setTimeout(() => { showResult(true, "Correct! 🎉 You earned 10 Coins."); }, 1000);
  } else {
    clickedButton.classList.add('wrong');
    allOptions[currentQuestion.correctAnswer].classList.add('correct');
    setTimeout(() => { showResult(false, "Oops! Wrong answer."); }, 1500);
  }
}

function showResult(isCorrect, message) {
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';
  
  const title = document.getElementById('result-title');
  const msg = document.getElementById('result-message');
  
  if (isCorrect) {
    title.innerText = "Correct! 🎉";
    title.style.color = "#28a745";
    msg.innerText = message;
  } else {
    title.innerText = "Wrong! ❌";
    title.style.color = "#dc3545";
    msg.innerText = message;
  }
}

// ==========================================
// LEVEL 3: PWA SERVICE WORKER
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('ServiceWorker registered!'))
      .catch(error => console.log('ServiceWorker registration failed:', error));
  });
}

// ==========================================
// LEVEL 4: DARK MODE & TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'default') {
  const container = document.getElementById('toast-container');
  if(!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  
  container.appendChild(toast);
  
  setTimeout(() => { toast.remove(); }, 3000);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  const isDarkMode = document.body.classList.contains('dark-mode');
  const statusText = document.getElementById('dark-mode-status');
  
  if (isDarkMode) {
    localStorage.setItem('theme', 'dark');
    if(statusText) statusText.innerText = 'ON';
    showToast('Dark Mode Activated 🌙', 'success');
  } else {
    localStorage.setItem('theme', 'light');
    if(statusText) statusText.innerText = 'OFF';
    showToast('Light Mode Activated ☀️', 'success');
  }
}

function rateUs() {
  closeSidebar();
  showToast('⭐ Thank you! Please rate us 5 stars.', 'success');
}

// ==========================================
// LEVEL 5: SEARCH & FILTER COURSES
// ==========================================
function searchCourse() {
  let input = document.getElementById('courseSearch').value.toLowerCase();
  let courseCards = document.querySelectorAll('#course-list .course-card');
  let visibleCount = 0;

  courseCards.forEach(card => {
    let courseTitle = card.querySelector('h3').innerText.toLowerCase();
    if (courseTitle.includes(input)) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const noCourseMsg = document.getElementById('no-course-msg');
  if (visibleCount === 0) {
    noCourseMsg.style.display = 'block';
  } else {
    noCourseMsg.style.display = 'none';
  }
}

// ==========================================
// LEVEL 6: EDIT PROFILE
// ==========================================
function openEditProfile() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-edit-profile').classList.add('active');
  document.getElementById('profileName').value = localStorage.getItem('userName') || "John Doe";
  document.getElementById('profileEmail').value = localStorage.getItem('userEmail') || "john@example.com";
}

function saveProfile() {
  let nameInput = document.getElementById('profileName').value.trim();
  let emailInput = document.getElementById('profileEmail').value.trim();

  if (nameInput === "") {
    showToast('Name cannot be empty!', 'error');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput)) {
    showToast('Please enter a valid email!', 'error');
    return;
  }

  localStorage.setItem('userName', nameInput);
  localStorage.setItem('userEmail', emailInput);
  document.querySelector('.user-info h3').innerText = nameInput;
  
  showToast('Profile updated successfully! ✅', 'success');
  setTimeout(() => { showDynamicPage('profile'); }, 1500);
}

setTimeout(() => {
  let savedName = localStorage.getItem('userName');
  if (savedName) {
    let sidebarName = document.querySelector('.user-info h3');
    if (sidebarName) sidebarName.innerText = savedName;
  }
}, 500);

// ==========================================
// LEVEL 7: NOTIFICATIONS SYSTEM
// ==========================================
const notificationsData = [
  { icon: "fa-gift", color: "#FFB800", title: "Welcome Bonus!", desc: "You received 50 coins as a welcome gift. Keep learning!" },
  { icon: "fa-book", color: "#4A6CF7", title: "New Course Added", desc: "Business English course is now available. Check it out!" },
  { icon: "fa-fire", color: "#dc3545", title: "Streak Alert!", desc: "You are on a 15-day streak. Complete a lesson today to keep it alive!" }
];

function openNotifications() {
  document.getElementById('notifDot').classList.remove('show');
  localStorage.setItem('notificationsRead', 'true');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-notifications').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const listContainer = document.getElementById('notification-list');
  listContainer.innerHTML = '';

  notificationsData.forEach(notif => {
    const item = document.createElement('div');
    item.className = 'notif-item';
    item.innerHTML = `
      <div class="notif-icon" style="background-color: ${notif.color};">
        <i class="fas ${notif.icon}"></i>
      </div>
      <div class="notif-content">
        <h4>${notif.title}</h4>
        <p>${notif.desc}</p>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  let isRead = localStorage.getItem('notificationsRead');
  let dot = document.getElementById('notifDot');
  
  if (isRead === 'true') {
    if(dot) dot.classList.remove('show');
  } else {
    if(dot) dot.classList.add('show');
  }
});

// ==========================================
// LEVEL 8: VIDEO PLAYER LOGIC
// ==========================================
function playVideo(videoUrl, title, description) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-video-player').classList.add('active');
  
  const videoPlayer = document.getElementById('mainVideoPlayer');
  const videoSource = document.getElementById('mainVideoSource');
  
  videoSource.src = videoUrl;
  videoPlayer.load();
  
  document.getElementById('videoTitle').innerText = title;
  document.getElementById('videoDesc').innerText = description;
  
  videoPlayer.play().catch(error => {
      console.log("Autoplay blocked by browser", error);
  });
}

// ==========================================
// LEVEL 10: AUTO-SCROLL FEEDBACK & POPUP
// ==========================================
const slider = document.getElementById('autoSlider');
let scrollInterval;

if (slider) {
  slider.addEventListener('mouseenter', () => {
    slider.style.animationPlayState = 'paused';
    clearInterval(scrollInterval);
  });
  
  slider.addEventListener('mouseleave', () => {
    startAutoScroll();
  });

  slider.addEventListener('touchstart', () => clearInterval(scrollInterval));
  slider.addEventListener('touchend', () => startAutoScroll());

  function startAutoScroll() {
    scrollInterval = setInterval(() => {
      if (!document.getElementById('page-home').classList.contains('active')) return;

      let maxScroll = slider.scrollWidth - slider.clientWidth;
      
      if (slider.scrollLeft >= maxScroll - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: 295, behavior: 'smooth' });
      }
    }, 3000);
  }

  startAutoScroll();
}

function openReviewPopup(name, stars, text) {
  document.getElementById('popupName').innerText = name;
  document.getElementById('popupStars').innerText = stars;
  document.getElementById('popupText').innerText = `"${text}"`;
  document.getElementById('popupAvatar').innerText = name.charAt(0);
  
  document.getElementById('reviewPopup').classList.add('active');
}

function closeReviewPopup() {
  document.getElementById('reviewPopup').classList.remove('active');
}

// ==========================================
// LEVEL 11: SHORTS VIDEO POPUP LOGIC
// ==========================================
function playShortVideo(videoUrl) {
  document.getElementById('videoPopup').classList.add('active');
  
  const videoPlayer = document.getElementById('shortVideoPlayer');
  const videoSource = document.getElementById('shortVideoSource');
  
  videoSource.src = videoUrl;
  videoPlayer.load();
  videoPlayer.play().catch(e => console.log("Autoplay blocked:", e));
}

function closeVideoPopup() {
  const videoPlayer = document.getElementById('shortVideoPlayer');
  videoPlayer.pause();
  document.getElementById('videoPopup').classList.remove('active');
  
  setTimeout(() => {
    document.getElementById('shortVideoSource').src = "";
  }, 300);
}

// ==========================================
// LEVEL 12: SHORTS PAGE PLAY/PAUSE
// ==========================================
function toggleReelPlay(btn) {
  const video = btn.closest('.reel-card').querySelector('video');
  
  if (video.paused) {
    video.muted = false;
    video.play();
    btn.innerHTML = '<i class="fas fa-pause"></i>';
    setTimeout(() => btn.style.display = 'none', 1000);
  } else {
    video.pause();
    btn.innerHTML = '<i class="fas fa-play"></i>';
    btn.style.display = 'block';
  }
}

// ==========================================
// LEVEL 13: SHORTS ACTIONS (LIKE, COMMENT, SHARE)
// ==========================================
function likeVideo(btn) {
  btn.classList.toggle('liked');
  
  let countSpan = btn.querySelector('span');
  let count = parseFloat(countSpan.innerText);
  
  if (btn.classList.contains('liked')) {
    countSpan.innerText = (count + 0.1).toFixed(1) + 'K';
    showToast('Liked! ❤️', 'success');
  } else {
    countSpan.innerText = (count - 0.1).toFixed(1) + 'K';
  }
}

function openComments() {
  showToast('Comments section coming soon! 💬', 'success');
}

function shareVideo() {
  if (navigator.share) {
    navigator.share({
      title: 'EnglishPro Short',
      text: 'Check out this amazing English learning video!',
      url: window.location.href
    }).then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Error sharing', error));
  } else {
    showToast('Link copied to clipboard! 🔗', 'success');
  }
}