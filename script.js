// Navigation buttons logic: show the clicked section
const navButtons = document.querySelectorAll('nav button.nav-btn');
const pages = document.querySelectorAll('main section.page');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-target');
    pages.forEach(page => {
      page.classList.toggle('active', page.id === target);
    });
  });
});

// LocalStorage keys
const TRIP_STORAGE_KEY = 'travelExplorerTrips';
const USER_STORAGE_KEY = 'travelExplorerUser';

// Load saved trips and display
function loadTrips() {
  const tripsJSON = localStorage.getItem(TRIP_STORAGE_KEY);
  if(!tripsJSON) return [];
  try {
    return JSON.parse(tripsJSON);
  } catch {
    return [];
  }
}

function saveTrips(trips) {
  localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trips));
}

function displayTrips() {
  const trips = loadTrips();
  const list = document.getElementById('savedPlansList');
  list.innerHTML = '';
  if(trips.length === 0) {
    list.innerHTML = '<li>No saved trips yet.</li>';
    return;
  }
  trips.forEach(({ destination, date, activities }, idx) => {
    const li = document.createElement('li');
    li.textContent = `${destination} — ${date} — Activities: ${activities || 'N/A'}`;
    list.appendChild(li);
  });
}

// Handle trip form submit
document.getElementById('tripForm').addEventListener('submit', e => {
  e.preventDefault();
  const destination = document.getElementById('destinationInput').value.trim();
  const date = document.getElementById('dateInput').value;
  const activities = document.getElementById('activitiesInput').value.trim();
  if(!destination || !date) {
    alert('Please fill destination and date!');
    return;
  }
  const trips = loadTrips();
  trips.push({ destination, date, activities });
  saveTrips(trips);
  displayTrips();
  alert('Trip plan saved!');
  e.target.reset();
  // Switch to My Trips page
  document.querySelector('nav button[data-target="savedPlans"]').click();
});

// Display trips on page load
displayTrips();

// Dummy register and login (just save user info in localStorage)
const USER_KEY = USER_STORAGE_KEY;

function getUser() {
  const userJSON = localStorage.getItem(USER_KEY);
  if(!userJSON) return null;
  try {
    return JSON.parse(userJSON);
  } catch {
    return null;
  }
}

// Register form
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  if(!name || !email || password.length < 6) {
    alert('Please fill all fields correctly. Password must be 6+ characters.');
    return;
  }
  // Save user in localStorage (for demo only)
  localStorage.setItem(USER_KEY, JSON.stringify({ name, email, password }));
  alert(`Thanks for registering, ${name}! You can now login.`);
  e.target.reset();
});

// Login form
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const user = getUser();
  if(!user || user.email !== email || user.password !== password) {
    alert('Invalid email or password.');
    return;
  }
  alert(`Welcome back, ${user.name}!`);
  // For demo: switch to home page after login
  document.querySelector('nav button[data-target="home"]').click();
  e.target.reset();
});
