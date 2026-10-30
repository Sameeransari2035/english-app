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
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show target page
  const targetPage = document.getElementById('page-' + pageName);
  if (targetPage) targetPage.classList.add('active');
  
  // Update bottom nav active state
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
  // Load Data on startup
  let currentCoins = localStorage.getItem('userCoins') || 850;
  let currentLessons = localStorage.getItem('userLessons') || 42;
  let currentStreak = localStorage.getItem('userStreak') || 15;

  updateUI(currentCoins, currentLessons, currentStreak);

  // Dark mode check on load
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
  if(!container) return; // Safety check
  
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
  // 1. User ne jo type kiya hai wo lo aur chhota (lowercase) kar do
  let input = document.getElementById('courseSearch').value.toLowerCase();
  
  // 2. Saare course cards ko select karo
  let courseCards = document.querySelectorAll('#course-list .course-card');
  
  let visibleCount = 0;

  // 3. Har card ko check karo
  courseCards.forEach(card => {
    // Card ke andar jo course ka naam (h3) hai usko lo
    let courseTitle = card.querySelector('h3').innerText.toLowerCase();
    
    // Agar course ke naam mein user ka typed word hai...
    if (courseTitle.includes(input)) {
      card.style.display = 'flex'; // Card ko dikhao
      visibleCount++;
    } else {
      card.style.display = 'none'; // Card ko chupao
    }
  });

  // 4. Agar koi course nahi mila, toh "No courses found" message dikhao
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

  // Email check (@ aur . hona chahiye)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput)) {
    showToast('Please enter a valid email!', 'error');
    return;
  }

  // Save to LocalStorage
  localStorage.setItem('userName', nameInput);
  localStorage.setItem('userEmail', emailInput);
  
  // Sidebar ka naam update karo
  document.querySelector('.user-info h3').innerText = nameInput;
  
  showToast('Profile updated successfully! ✅', 'success');
  setTimeout(() => { showDynamicPage('profile'); }, 1500);
}

// App khulte hi saved naam dikhane ke liye
setTimeout(() => {
  let savedName = localStorage.getItem('userName');
  if (savedName) {
    let sidebarName = document.querySelector('.user-info h3');
    if (sidebarName) sidebarName.innerText = savedName;
  }
}, 500);