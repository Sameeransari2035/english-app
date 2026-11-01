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
        <div class="info-card" style="text-align: center; padding: 30px 20px;">
          
          <!-- Avatar Image -->
          <div style="position: relative; display: inline-block; margin-bottom: 15px;">
            <img id="profileAvatar" src="${localStorage.getItem('userAvatar') || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" 
                 style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid #4A6CF7; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <button onclick="openEditProfile()" style="position: absolute; bottom: 0; right: 0; background: #4A6CF7; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
              <i class="fas fa-camera" style="font-size: 14px;"></i>
            </button>
          </div>

          <!-- Name & Bio -->
          <h3 style="font-size: 20px; margin-bottom: 5px; color: #222;">${localStorage.getItem('userName') || 'John Doe'}</h3>
          <p style="font-size: 13px; color: #777; margin-bottom: 15px;">${localStorage.getItem('userEmail') || 'john@example.com'}</p>
          
          <div style="display: inline-block; background: #f0f4ff; color: #4A6CF7; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px;">
            Level: Intermediate (B1)
          </div>

          <!-- Stats Row -->
          <div style="display: flex; justify-content: space-around; border-top: 1px solid #eee; padding-top: 20px; margin-top: 10px;">
            <div>
              <h4 style="font-size: 18px; color: #4A6CF7; margin-bottom: 2px;">${localStorage.getItem('userLessons') || 42}</h4>
              <p style="font-size: 11px; color: #777;">Lessons</p>
            </div>
            <div>
              <h4 style="font-size: 18px; color: #4A6CF7; margin-bottom: 2px;">${localStorage.getItem('userStreak') || 15}</h4>
              <p style="font-size: 11px; color: #777;">Day Streak</p>
            </div>
            <div>
              <h4 style="font-size: 18px; color: #4A6CF7; margin-bottom: 2px;">850</h4>
              <p style="font-size: 11px; color: #777;">Coins</p>
            </div>
          </div>

          <!-- Edit Button -->
          <button class="btn-primary" style="margin-top: 25px; width: 100%; padding: 12px;" onclick="openEditProfile()">
            <i class="fas fa-edit"></i> Edit Profile
          </button>
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
// LEVEL 6: EDIT PROFILE (UPDATED)
// ==========================================

// 1. Edit Profile kholna
function openEditProfile() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-edit-profile').classList.add('active');
  
  // Purana data form mein daalo
  document.getElementById('profileName').value = localStorage.getItem('userName') || "John Doe";
  document.getElementById('profileEmail').value = localStorage.getItem('userEmail') || "john@example.com";
  
  // Avatar preview set karo
  const savedAvatar = localStorage.getItem('userAvatar') || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  document.getElementById('editAvatarPreview').src = savedAvatar;
}

// 2. Naya Avatar upload karte waqt preview dikhana
let newAvatarBase64 = null; // Temp variable nayi image save karne ke liye

function previewAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('editAvatarPreview').src = e.target.result;
      newAvatarBase64 = e.target.result; // Base64 save kar liya
    };
    reader.readAsDataURL(file);
  }
}

// 3. Profile Save karna (Validation ke saath)
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

  // Data save karo
  localStorage.setItem('userName', nameInput);
  localStorage.setItem('userEmail', emailInput);
  
  // Agar nayi image select ki gayi hai toh use save karo
  if (newAvatarBase64) {
    localStorage.setItem('userAvatar', newAvatarBase64);
    newAvatarBase64 = null; // Reset karo
  }
  
  // Sidebar ka naam aur avatar update karo
  document.querySelector('.user-info h3').innerText = nameInput;
  
  showToast('Profile updated successfully! ✅', 'success');
  
  // Wapas profile page par jao aur usko refresh karo
  setTimeout(() => { 
    showDynamicPage('profile'); 
  }, 1000);
}

// 4. App khulte hi Sidebar mein saved avatar dikhana
setTimeout(() => {
  let savedName = localStorage.getItem('userName');
  let savedAvatar = localStorage.getItem('userAvatar');
  
  if (savedName) {
    let sidebarName = document.querySelector('.user-info h3');
    if (sidebarName) sidebarName.innerText = savedName;
  }
  
  if (savedAvatar) {
    let sidebarAvatar = document.querySelector('.user-avatar');
    if (sidebarAvatar) {
      sidebarAvatar.innerHTML = `<img src="${savedAvatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }
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
// ==========================================
// LEVEL 17: PHOTO GALLERY POPUP
// ==========================================

function openPhotoPopup(imageUrl, caption) {
  // Image aur caption set karo
  document.getElementById('popupPhotoImg').src = imageUrl;
  document.getElementById('popupPhotoCaption').innerText = caption;
  
  // Popup kholo
  document.getElementById('photoPopup').classList.add('active');
}

function closePhotoPopup() {
  document.getElementById('photoPopup').classList.remove('active');
}
// ==========================================
// LEVEL 14: COURSE FOLDERS LOGIC
// ==========================================

// Folder ka Data (Yahan aap jitni chahein videos add kar sakte hain)
const folderData = {
  grammar: {
    title: 'English Grammar',
    videos: [
      { title: 'Introduction to Tenses', desc: 'Learn the basics of present, past, and future tenses.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '10:15' },
      { title: 'Nouns and Pronouns', desc: 'Understand how nouns and pronouns work in sentences.', videoUrl: 'https://www.w3schools.com/html/movie.mp4', duration: '08:30' },
      { title: 'Active and Passive Voice', desc: 'Convert sentences from active to passive voice.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '12:45' }
    ]
  },
  speaking: {
    title: 'Spoken English',
    videos: [
      { title: 'How to Introduce Yourself', desc: 'Master the art of self-introduction.', videoUrl: 'https://www.w3schools.com/html/movie.mp4', duration: '06:20' },
      { title: 'Daily Use Sentences', desc: 'Common sentences used in everyday life.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '15:00' }
    ]
  },
  vocabulary: {
    title: 'Vocabulary Builder',
    videos: [
      { title: '10 Advanced Words', desc: 'Boost your vocabulary with advanced words.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '09:10' },
      { title: 'Idioms and Phrases', desc: 'Learn common English idioms.', videoUrl: 'https://www.w3schools.com/html/movie.mp4', duration: '11:25' }
    ]
  }
};

// Folder kholne ka function
function openFolder(folderKey) {
  const folder = folderData[folderKey];
  if (!folder) return;

  // Page change karo
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-folder-videos').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Title set karo
  document.getElementById('folderTitle').innerText = folder.title;

  // Videos ki list banakar dikhao
  const videoListContainer = document.getElementById('folderVideosList');
  videoListContainer.innerHTML = '';

  folder.videos.forEach(video => {
    const item = document.createElement('div');
    item.className = 'video-list-item';
    // Click karne par playVideo function chalega jo aapke paas pehle se hai
    item.setAttribute('onclick', `playVideo('${video.videoUrl}', '${video.title}', '${video.desc}')`);
    
    item.innerHTML = `
      <div style="width: 100px; height: 65px; background: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <i class="fas fa-play" style="color: white; font-size: 20px;"></i>
      </div>
      <div style="padding: 0 10px;">
        <h3 style="font-size: 14px; margin-bottom: 4px; color: #222;">${video.title}</h3>
        <p style="font-size: 12px; color: #777; margin-bottom: 5px;">${video.desc}</p>
        <span style="font-size: 11px; color: #999;">${video.duration}</span>
      </div>
    `;
    videoListContainer.appendChild(item);
  });
}