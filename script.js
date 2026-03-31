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
if (!localStorage.getItem('ibento_bookmarks')) { localStorage.setItem('ibento_bookmarks', JSON.stringify({})); }
if (!localStorage.getItem('ibento_interested')) { localStorage.setItem('ibento_interested', JSON.stringify({})); }

const getEvents = () => JSON.parse(localStorage.getItem('ibento_events')) || [];
const saveEvents = (events) => localStorage.setItem('ibento_events', JSON.stringify(events));

const getCurrentUserEmail = () => {
    const sessionStr = localStorage.getItem('ibento_session');
    if (!sessionStr) return null;
    try { const session = JSON.parse(sessionStr); return session.email; } catch(e) { return null; }
};

const getBookmarks = () => {
    const all = JSON.parse(localStorage.getItem('ibento_bookmarks')) || {};
    if (Array.isArray(all)) return [];
    const email = getCurrentUserEmail();
    return email && all[email] ? all[email] : [];
};
const saveBookmarks = (bm) => {
    let all = JSON.parse(localStorage.getItem('ibento_bookmarks')) || {};
    if (Array.isArray(all)) all = {};
    const email = getCurrentUserEmail();
    if (email) { all[email] = bm; localStorage.setItem('ibento_bookmarks', JSON.stringify(all)); }
};
const getInterested = () => {
    const all = JSON.parse(localStorage.getItem('ibento_interested')) || {};
    if (Array.isArray(all)) return [];
    const email = getCurrentUserEmail();
    return email && all[email] ? all[email] : [];
};
const saveInterested = (int) => {
    let all = JSON.parse(localStorage.getItem('ibento_interested')) || {};
    if (Array.isArray(all)) all = {};
    const email = getCurrentUserEmail();
    if (email) { all[email] = int; localStorage.setItem('ibento_interested', JSON.stringify(all)); }
};

const defaultUsers = [
    { email: 'student@ibento.com', password: '1234', name: 'Student Demo', role: 'student', regdno: 'STU001', college: 'MIT' },
    { email: 'admin@ibento.com', password: 'admin123', name: 'Admin Demo', role: 'admin' }
];
if (!localStorage.getItem('ibento_users')) { localStorage.setItem('ibento_users', JSON.stringify(defaultUsers)); }
const getUsers = () => JSON.parse(localStorage.getItem('ibento_users')) || [];
const saveUsers = (users) => localStorage.setItem('ibento_users', JSON.stringify(users));

let currentUserRole = null;
let currentLoginTab = 'student';

function switchLoginTab(role) {
    currentLoginTab = role;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab${role.charAt(0).toUpperCase() + role.slice(1)}`).classList.add('active');
    document.getElementById('loginTitle').textContent = role === 'student' ? 'Student Portal' : 'Admin Portal';
    
    const credsText = role === 'student' ? "Demo: student@ibento.com / 1234" : "Demo: admin@ibento.com / admin123";
    document.getElementById('demoCreds').innerHTML = `<small>${credsText}</small>`;
    
    const toggleEl = document.getElementById('toggleAuthText');
    if (toggleEl) {
        toggleEl.style.display = role === 'admin' ? 'none' : 'block';
        if (role === 'admin' && typeof isSignUpMode !== 'undefined' && isSignUpMode) toggleAuthMode(new Event('click'));
    }
    
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginForm').reset();
}

let isSignUpMode = false;

function toggleAuthMode(e) {
    if(e) e.preventDefault();
    isSignUpMode = !isSignUpMode;
    const nameGroup = document.getElementById('nameGroup');
    const regdnoGroup = document.getElementById('regdnoGroup');
    const collegeGroup = document.getElementById('collegeGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    const btn = document.getElementById('authSubmitBtn');
    const toggleText = document.getElementById('toggleAuthText');
    const fullName = document.getElementById('fullName');
    const regdno = document.getElementById('regdno');
    const college = document.getElementById('college');
    const phone = document.getElementById('phone');
    
    if (isSignUpMode) {
        nameGroup.style.display = 'block';
        regdnoGroup.style.display = 'block';
        collegeGroup.style.display = 'block';
        phoneGroup.style.display = 'block';
        fullName.setAttribute('required', 'true');
        regdno.setAttribute('required', 'true');
        college.setAttribute('required', 'true');
        phone.setAttribute('required', 'true');
        btn.textContent = 'Sign Up';
        toggleText.innerHTML = `Already have an account? <a href="#" onclick="toggleAuthMode(event)" style="color: var(--primary); font-weight: 500;">Login</a>`;
        document.getElementById('loginTitle').textContent = 'Create Student Account';
    } else {
        nameGroup.style.display = 'none';
        regdnoGroup.style.display = 'none';
        collegeGroup.style.display = 'none';
        phoneGroup.style.display = 'none';
        fullName.removeAttribute('required');
        regdno.removeAttribute('required');
        college.removeAttribute('required');
        phone.removeAttribute('required');
        btn.textContent = 'Login';
        toggleText.innerHTML = `Don't have an account? <a href="#" onclick="toggleAuthMode(event)" style="color: var(--primary); font-weight: 500;">Sign Up</a>`;
        document.getElementById('loginTitle').textContent = 'Student Portal';
    }
    document.getElementById('loginError').textContent = '';
}

function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');
    const users = getUsers();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorEl.textContent = 'Please enter a valid email address.';
        return;
    }

    if (currentLoginTab === 'student') {
        if (isSignUpMode) {
            const phone = document.getElementById('phone').value.trim();
            const regdno = document.getElementById('regdno').value.trim();
            const college = document.getElementById('college').value.trim();
            const name = document.getElementById('fullName').value.trim() || 'Student';
            
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                errorEl.textContent = 'Please enter a valid 10-digit phone number.';
                return;
            }

            if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                errorEl.textContent = 'Email already registered!';
                return;
            }
            
            if (users.find(u => u.regdno && u.regdno.toLowerCase() === regdno.toLowerCase())) {
                errorEl.textContent = 'Registration number already registered!';
                return;
            }
            
            if (users.find(u => u.phone === phone)) {
                errorEl.textContent = 'Phone number already registered!';
                return;
            }

            users.push({ email, password: pass, name, regdno, college, phone, role: 'student' });
            saveUsers(users);
            loginSuccess('student', name, email);
        } else {
            const user = users.find(u => u.email === email && u.password === pass && u.role === 'student');
            if (user) {
                loginSuccess('student', user.name, user.email);
            } else {
                errorEl.textContent = 'Invalid student credentials.';
            }
        }
    } else {
        const user = users.find(u => u.email === email && u.password === pass && u.role === 'admin');
        if (user) {
            loginSuccess('admin', user.name, user.email);
        } else {
            errorEl.textContent = 'Invalid admin credentials.';
        }
    }
}

function loginSuccess(role, name = '', email = '') {
    currentUserRole = role;
    localStorage.setItem('ibento_session', JSON.stringify({role, name, email}));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(role + 'Portal').classList.add('active-section');
    
    if(role === 'student') {
        if (name) {
            const welcomeEl = document.querySelector('#studentHome .welcome-text');
            if (welcomeEl) welcomeEl.innerHTML = `Welcome back, ${name.split(' ')[0]}! 👋`;
        }
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
    
    // Auto-revert to login mode if logged out while in sign-up mode
    if (typeof isSignUpMode !== 'undefined' && isSignUpMode) toggleAuthMode(new Event('click'));
}

window.onload = () => {
    const session = localStorage.getItem('ibento_session');
    if(session) {
        try {
            const data = JSON.parse(session);
            if (data.role) loginSuccess(data.role, data.name, data.email);
        } catch(e) {
            loginSuccess(session); // backward compatibility if session was purely string
        }
    }
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
    if(tab === 'connect') renderConnect();
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
    if (colFilter) events = events.filter(e => e.college.toLowerCase().includes(colFilter.toLowerCase()));    
    renderEventCards(events, 'eventsContainer');
}

function renderBookmarks() {
    const bms = getBookmarks();
    const events = getEvents().filter(e => e.status === 'Approved' && bms.includes(e.id));
    renderEventCards(events, 'bookmarksContainer');
}

function renderConnect() {
    const container = document.getElementById('connectContainer');
    container.innerHTML = '';
    
    const email = getCurrentUserEmail();
    if (!email) return;
    
    const myInt = getInterested();
    if (myInt.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 2rem;">You haven't shown interest in any events yet.</p>`;
        return;
    }
    
    const users = getUsers();
    const me = users.find(u => u.email === email);
    if (!me || !me.college) return;
    
    const allInt = JSON.parse(localStorage.getItem('ibento_interested')) || {};
    const allEvents = getEvents();
    
    let matesFound = false;
    
    users.forEach(u => {
        if (u.email === email || (u.college || '').toLowerCase() !== me.college.toLowerCase()) return;
        
        const theirInt = allInt[u.email] || [];
        const commonEvents = theirInt.filter(id => myInt.includes(id));
        
        if (commonEvents.length > 0) {
            matesFound = true;
            commonEvents.forEach(eventId => {
                const ev = allEvents.find(e => e.id === eventId);
                if(!ev) return;
                
                const card = `
                    <div class="connect-card">
                        <div class="connect-header">
                            <div class="connect-avatar">${u.name.charAt(0).toUpperCase()}</div>
                            <div class="connect-user-info">
                                <h4>${u.name}</h4>
                                <p><i class="fas fa-id-card"></i> ${u.regdno || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="connect-event">
                            <strong>Also attending:</strong>
                            ${ev.title}
                        </div>
                        <div class="connect-action">
                            <a href="mailto:${u.email}?subject=Interested%20in%20attending%20${encodeURIComponent(ev.title)}%20together" class="btn primary-btn">
                                <i class="fas fa-envelope"></i> Connect via Email
                            </a>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        }
    });
    
    if (!matesFound) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 2rem;">No mates from your college are attending your interested events yet.</p>`;
    }
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
    const fileInput = document.getElementById('upPoster');
    
    function saveEventWithPoster(posterData) {
        const events = getEvents();
        const newEvent = {
            id: Date.now().toString(),
            title: title,
            college: document.getElementById('upCollege').value,
            date: date,
            venue: document.getElementById('upVenue').value,
            category: document.getElementById('upCategory').value,
            poster: posterData,
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

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            saveEventWithPoster(evt.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveEventWithPoster('https://via.placeholder.com/400x200?text=Event+Poster');
    }
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
