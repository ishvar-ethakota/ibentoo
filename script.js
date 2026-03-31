const initialEvents = [
    { id: '1', title: 'TechNova Hackathon', college: 'MIT', date: getFutureDate(5), venue: 'Main Auditorium', category: 'Tech', poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400', link: '#', desc: 'A 48-hour competitive hackathon for all tech enthusiasts.', status: 'Approved', interested: 45 },
    { id: '2', title: 'Cultural Fest 2026', college: 'Harvard', date: getFutureDate(12), venue: 'Open Grounds', category: 'Cultural', poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400', link: '#', desc: 'Annual cultural extravaganza featuring dance, music, and art.', status: 'Approved', interested: 120 },
    { id: '3', title: 'Inter-College Basketball', college: 'Stanford', date: getFutureDate(3), venue: 'Sports Complex', category: 'Sports', poster: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400', link: '#', desc: 'The biggest basketball tournament of the year. Come support your team!', status: 'Approved', interested: 85 },
    { id: '4', title: 'AI & Future Summit', college: 'MIT', date: getFutureDate(20), venue: 'Seminar Hall B', category: 'Tech', poster: 'https://images.unsplash.com/photo-1620712948343-008423671ce8?auto=format&fit=crop&q=80&w=400', link: '#', desc: 'Industry leaders discuss the future of AI and Machine Learning.', status: 'Pending', interested: 0 }
];

function getFutureDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

if (!localStorage.getItem('ibento_events')) { localStorage.setItem('ibento_events', JSON.stringify(initialEvents)); }
if (!localStorage.getItem('ibento_bookmarks')) { localStorage.setItem('ibento_bookmarks', JSON.stringify([])); }
if (!localStorage.getItem('ibento_interested')) { localStorage.setItem('ibento_interested', JSON.stringify([])); }

const getEvents = () => JSON.parse(localStorage.getItem('ibento_events')) || [];
const saveEvents = (events) => localStorage.setItem('ibento_events', JSON.stringify(events));
const getBookmarks = () => JSON.parse(localStorage.getItem('ibento_bookmarks')) || [];
const saveBookmarks = (bm) => localStorage.setItem('ibento_bookmarks', JSON.stringify(bm));
const getInterested = () => JSON.parse(localStorage.getItem('ibento_interested')) || [];
const saveInterested = (int) => localStorage.setItem('ibento_interested', JSON.stringify(int));

let currentUserRole = null;
let currentLoginTab = 'student';

function switchLoginTab(role) {
    currentLoginTab = role;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab${role.charAt(0).toUpperCase() + role.slice(1)}`).classList.add('active');
    document.getElementById('loginTitle').textContent = role === 'student' ? 'Student Portal' : 'Admin Portal';
    
    const credsText = role === 'student' ? "Demo: student@ibento.com / 1234" : "Demo: admin@ibento.com / admin123";
    document.getElementById('demoCreds').innerHTML = `<small>${credsText}</small>`;
    
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginForm').reset();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    if (currentLoginTab === 'student') {
        if (email === 'student@ibento.com' && pass === '1234') {
            loginSuccess('student');
        } else {
            errorEl.textContent = 'Invalid student credentials.';
        }
    } else {
         if (email === 'admin@ibento.com' && pass === 'admin123') {
            loginSuccess('admin');
        } else {
            errorEl.textContent = 'Invalid admin credentials.';
        }
    }
}

function loginSuccess(role) {
    currentUserRole = role;
    localStorage.setItem('ibento_session', role);
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(role + 'Portal').classList.add('active-section');
    
    if(role === 'student'){
        switchStudentTab('home');
    } else {
        switchAdminTab('dashboard');
    }
}

function handleLogout() {
    currentUserRole = null;
    localStorage.removeItem('ibento_session');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
    document.getElementById('loginSection').classList.add('active-section');
    document.getElementById('loginForm').reset();
}

window.onload = () => {
    const session = localStorage.getItem('ibento_session');
    if(session) loginSuccess(session);
};

function toggleMenu(menuId) {
    document.getElementById(menuId).classList.toggle('active');
}

function switchStudentTab(tab) {
    if(event && event.target && event.target.tagName === 'A') {
        document.querySelectorAll('#studentMenu a').forEach(a => a.classList.remove('active'));
        event.target.classList.add('active');
    }
    document.querySelectorAll('.student-view').forEach(v => v.classList.remove('active-view'));
    document.getElementById('student' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active-view');
    document.getElementById('studentMenu').classList.remove('active');

    if(tab === 'home') renderStudentDashboard();
    if(tab === 'events') renderStudentEvents();
    if(tab === 'bookmarks') renderBookmarks();
}

function calculateCountdown(dateStr) {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Event Ended";
    if (diffDays === 0) return "Starts Today!";
    if (diffDays === 1) return "Starts Tomorrow";
    return `Starts in ${diffDays} days`;
}

function renderStudentDashboard() {
    const events = getEvents().filter(e => e.status === 'Approved');
    const bms = getBookmarks();
    const ints = getInterested();
    
    document.getElementById('sTotalEvents').textContent = events.length;
    document.getElementById('sBookmarked').textContent = bms.length;
    document.getElementById('sInterested').textContent = ints.length;
}

function renderStudentEvents() {
    const catFilter = document.getElementById('filterCategory').value;
    const colFilter = document.getElementById('filterCollege').value;
    
    let events = getEvents().filter(e => e.status === 'Approved');
    
    if (catFilter) events = events.filter(e => e.category === catFilter);
    if (colFilter) events = events.filter(e => e.college === colFilter);
    
    renderEventCards(events, 'eventsContainer');
}

function renderBookmarks() {
    const bms = getBookmarks();
    const events = getEvents().filter(e => e.status === 'Approved' && bms.includes(e.id));
    renderEventCards(events, 'bookmarksContainer');
}

function renderEventCards(events, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if(events.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-light);">No events found.</p>`;
        return;
    }
    
    const bms = getBookmarks();
    const ints = getInterested();

    events.forEach(ev => {
        const isBm = bms.includes(ev.id);
        const isInt = ints.includes(ev.id);
        
        const markup = `
            <div class="event-card">
                <img src="${ev.poster}" alt="${ev.title}" class="event-img" onerror="this.src='https://via.placeholder.com/400x200?text=Event+Poster'">
                <div class="event-details">
                    <span class="event-category">${ev.category}</span>
                    <h3 class="event-title">${ev.title}</h3>
                    <div class="event-meta"><i class="fas fa-university"></i> ${ev.college}</div>
                    <div class="event-meta"><i class="far fa-calendar-alt"></i> ${new Date(ev.date).toLocaleDateString()}</div>
                    <div class="countdown">${calculateCountdown(ev.date)}</div>
                    
                    <div class="event-actions">
                        <div>
                            <button class="icon-btn interested ${isInt?'active':''}" onclick="toggleInterested('${ev.id}')" title="Interested">
                                <i class="${isInt?'fas':'far'} fa-heart"></i>
                            </button>
                            <button class="icon-btn bookmark ${isBm?'active':''}" onclick="toggleBookmark('${ev.id}')" title="Bookmark">
                                <i class="${isBm?'fas':'far'} fa-star"></i>
                            </button>
                        </div>
                        <button class="btn primary-btn details-btn" onclick="openEventDetails('${ev.id}')">View Details</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += markup;
    });
}

function toggleBookmark(id) {
    let bms = getBookmarks();
    if(bms.includes(id)) {
        bms = bms.filter(b => b !== id);
    } else {
        bms.push(id);
    }
    saveBookmarks(bms);
    document.getElementById('studentEvents').classList.contains('active-view') ? renderStudentEvents() : renderBookmarks();
    renderStudentDashboard();
}

function toggleInterested(id) {
    let ints = getInterested();
    let events = getEvents();
    const eventIdx = events.findIndex(e => e.id === id);
    if(eventIdx === -1) return;
    
    if(ints.includes(id)) {
        ints = ints.filter(i => i !== id);
        events[eventIdx].interested -= 1;
    } else {
        ints.push(id);
        events[eventIdx].interested += 1;
    }
    saveInterested(ints);
    saveEvents(events);
    
    document.getElementById('studentEvents').classList.contains('active-view') ? renderStudentEvents() : renderBookmarks();
    renderStudentDashboard();
    
    const modal = document.getElementById('eventModal');
    if(modal.style.display === 'flex') openEventDetails(id);
}

function openEventDetails(id) {
    const ev = getEvents().find(e => e.id === id);
    if(!ev) return;
    
    const ints = getInterested();
    const isInt = ints.includes(ev.id);
    
    const html = `
        <div class="modal-header">
            <span class="event-category">${ev.category}</span>
            <h2 class="modal-title">${ev.title}</h2>
            <div class="modal-meta-row">
                <span><i class="fas fa-university"></i> ${ev.college}</span>
                <span><i class="far fa-calendar-alt"></i> ${new Date(ev.date).toLocaleDateString()}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${ev.venue}</span>
            </div>
        </div>
        <img src="${ev.poster}" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:1rem;" onerror="this.src='https://via.placeholder.com/600x200?text=Event'">
        <p class="modal-desc">${ev.desc}</p>
        
        <div style="font-weight:500; margin-bottom:1rem;">
            <i class="fas fa-users"></i> ${ev.interested} Students Interested
            <button class="icon-btn interested ${isInt?'active':''}" onclick="toggleInterested('${ev.id}')" style="margin-left:10px;">
                <i class="${isInt?'fas':'far'} fa-heart"></i>
            </button>
        </div>
        
        <div class="modal-footer">
            <label class="team-toggle">
                <input type="checkbox"> Looking for Team
            </label>
            <a href="${ev.link}" target="_blank" class="btn primary-btn">Register Now</a>
        </div>
    `;
    
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('eventModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target == modal) {
        closeModal();
    }
}

function handleEventUpload(e) {
    e.preventDefault();
    const title = document.getElementById('upTitle').value;
    const date = document.getElementById('upDate').value;
    
    const events = getEvents();
    
    const newEvent = {
        id: Date.now().toString(),
        title: title,
        college: document.getElementById('upCollege').value,
        date: date,
        venue: document.getElementById('upVenue').value,
        category: document.getElementById('upCategory').value,
        poster: document.getElementById('upPoster').value,
        link: document.getElementById('upLink').value,
        desc: document.getElementById('upDesc').value,
        status: 'Pending',
        interested: 0
    };
    
    events.push(newEvent);
    saveEvents(events);
    
    alert('Event submitted successfully! Waiting for admin approval.');
    document.getElementById('uploadForm').reset();
    switchStudentTab('home');
    document.querySelectorAll('#studentMenu a').forEach(a => a.classList.remove('active'));
    document.querySelector(`#studentMenu a[onclick="switchStudentTab('home')"]`).classList.add('active');
}

function switchAdminTab(tab) {
    if(event && event.target && event.target.tagName === 'A') {
        document.querySelectorAll('#adminMenu a').forEach(a => a.classList.remove('active'));
        event.target.classList.add('active');
    }
    
    document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active-view'));
    document.getElementById('admin' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active-view');
    document.getElementById('adminMenu').classList.remove('active');

    if(tab === 'dashboard') renderAdminDashboard();
    if(tab === 'manage') renderAdminManage();
}

function renderAdminDashboard() {
    const events = getEvents();
    const total = events.length;
    const pending = events.filter(e => e.status === 'Pending').length;
    const approved = events.filter(e => e.status === 'Approved').length;
    
    document.getElementById('aTotal').textContent = total;
    document.getElementById('aPending').textContent = pending;
    document.getElementById('aApproved').textContent = approved;
}

function renderAdminManage() {
    const events = getEvents();
    events.sort((a,b) => new Date(b.date) - new Date(a.date));
    const tbody = document.getElementById('adminEventsTable');
    tbody.innerHTML = '';
    
    if(events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No events found.</td></tr>`;
        return;
    }

    events.forEach(ev => {
        const isDuplicate = events.some(e => e.id !== ev.id && e.title.toLowerCase().trim() === ev.title.toLowerCase().trim() && e.date === ev.date);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight:500;">${ev.title}</div>
                ${isDuplicate ? '<div class="duplicate-warning"><i class="fas fa-exclamation-triangle"></i> Potential Duplicate</div>' : ''}
            </td>
            <td>${ev.college}</td>
            <td>${new Date(ev.date).toLocaleDateString()}</td>
            <td><span class="status-badge status-${ev.status.toLowerCase()}">${ev.status}</span></td>
            <td>
                <div class="action-btns">
                    ${ev.status === 'Pending' ? `
                        <button class="action-btn approve" onclick="changeEventStatus('${ev.id}', 'Approved')" title="Approve"><i class="fas fa-check-circle"></i></button>
                        <button class="action-btn reject" onclick="changeEventStatus('${ev.id}', 'Rejected')" title="Reject"><i class="fas fa-times-circle"></i></button>
                    ` : ''}
                    <button class="action-btn delete" onclick="deleteEvent('${ev.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function changeEventStatus(id, newStatus) {
    const events = getEvents();
    const idx = events.findIndex(e => e.id === id);
    if(idx !== -1) {
        events[idx].status = newStatus;
        saveEvents(events);
        renderAdminManage();
        renderAdminDashboard();
    }
}

function deleteEvent(id) {
    if(!confirm("Are you sure you want to delete this event?")) return;
    
    let events = getEvents();
    events = events.filter(e => e.id !== id);
    saveEvents(events);
    
    let bms = getBookmarks().filter(b => b !== id);
    saveBookmarks(bms);
    let ints = getInterested().filter(i => i !== id);
    saveInterested(ints);
    
    renderAdminManage();
    renderAdminDashboard();
}
