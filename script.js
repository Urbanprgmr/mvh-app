const tg = window.Telegram.WebApp;
const userId = tg.initDataUnsafe.user.id;
const username = tg.initDataUnsafe.user.username;

// DOM Elements
const usernameElement = document.getElementById('username');
const pointsElement = document.getElementById('points');
const taskListElement = document.getElementById('task-list');
const referralCodeElement = document.getElementById('referral-code');
const friendListElement = document.getElementById('friend-list');
const miningStatusElement = document.getElementById('mining-status');
const claimMiningButton = document.getElementById('claim-mining');
const leaderboardListElement = document.getElementById('leaderboard-list');

// Backend API URL
const API_URL = 'https://your-backend-api.com';

// Initialize App
tg.expand(); // Expand the Mini App to full screen
usernameElement.innerText = User: ${username};

// Fetch User Data
async function fetchUserData() {
  const response = await fetch(${API_URL}/user/${userId});
  const data = await response.json();
  pointsElement.innerText = Points: ${data.points};
  referralCodeElement.innerText = data.referralCode;
  friendListElement.innerText = data.referrals.length;
}

// Fetch Tasks
async function fetchTasks() {
  const response = await fetch(${API_URL}/tasks);
  const tasks = await response.json();
  taskListElement.innerHTML = tasks.map(task => 
    <li>
      <strong>${task.taskName}</strong> - ${task.points} points
      <button onclick="completeTask('${task.taskId}')">Complete</button>
    </li>
  ).join('');
}

// Complete Task
async function completeTask(taskId) {
  const response = await fetch(${API_URL}/completeTask, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, taskId }),
  });
  const data = await response.json();
  if (data.success) {
    fetchUserData();
  }
}

// Fetch Mining Status
async function fetchMiningStatus() {
  const response = await fetch(${API_URL}/miningStatus/${userId});
  const data = await response.json();
  miningStatusElement.innerText = data.available ? 'Available' : 'Not Available';
  claimMiningButton.disabled = !data.available;
}

// Claim Mining
claimMiningButton.addEventListener('click', async () => {
  const response = await fetch(${API_URL}/claimMining, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  if (data.success) {
    fetchUserData();
    fetchMiningStatus();
  }
});

// Fetch Leaderboard
async function fetchLeaderboard() {
  const response = await fetch(${API_URL}/leaderboard);
  const leaderboard = await response.json();
  leaderboardListElement.innerHTML = leaderboard.map((user, index) => 
    <li>${index + 1}. ${user.username} - ${user.totalPoints} points</li>
  ).join('');
}

// Show Section
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

// Initial Load
fetchUserData();
fetchTasks();
fetchMiningStatus();
fetchLeaderboard();
