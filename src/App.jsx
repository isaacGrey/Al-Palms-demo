import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, BookOpen, Building2, CalendarDays,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3,
  GraduationCap, LayoutDashboard, LogOut, Menu, MoreHorizontal, Plus, RefreshCw,
  Search, Settings2, ShieldCheck, Sparkles, TrendingUp, UserRound, UserRoundCheck,
  Users, X
} from 'lucide-react';
import { API_BASE, DEMO_MODE } from './config.js';
import { accounts, sampleActivity, sampleCampuses, sampleEvents, sampleStudents } from './data.js';

const sections = [
  { label: 'WORKSPACE', items: [
    ['dashboard', 'Dashboard', LayoutDashboard], ['students', 'Students', GraduationCap],
    ['admissions', 'Admissions', UserRoundCheck], ['analytics', 'Analytics', TrendingUp]
  ] },
  { label: 'MANAGEMENT', items: [
    ['campuses', 'Campuses', Building2], ['events', 'Events', CalendarDays],
    ['activity', 'Activity log', Activity], ['users', 'Users', Users]
  ] },
  { label: 'ACCOUNT', items: [['settings', 'Settings', Settings2]] }
];
const routeName = (value) => {
  const id = String(value || '').split('/').filter(Boolean)[0] || 'dashboard';
  return sections.some(s => s.items.some(item => item[0] === id)) ? id : 'dashboard';
};
const initDemo = (key, fallback) => {
  if (!DEMO_MODE) return [];
  try { const value = JSON.parse(localStorage.getItem('alpalms-demo-' + key)); return Array.isArray(value) ? value : fallback; }
  catch { return fallback; }
};
const initials = (name) => String(name || 'U').split(' ').slice(0, 2).map(word => word[0] || '').join('').toUpperCase();
const titleCase = (value) => String(value || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
const readableDate = (value) => {
  if (!value) return '—';
  const d = new Date(String(value).slice(0, 10) + 'T12:00:00');
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const percent = (n, d) => d ? Math.round(n / d * 100) : 0;
const datum = (students, key) => {
  const counts = {};
  students.forEach(s => { const k = String(s[key] || 'Unspecified'); counts[k] = (counts[k] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
};
const request = async (path, options = {}) => {
  if (!API_BASE) throw new Error('The production API is not configured. Set VITE_API_BASE_URL in Vercel.');
  const res = await fetch(API_BASE.replace(/\/$/, '') + path, options);
  const value = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(value.error || ('Request failed (' + res.status + ')'));
  return value;
};

function Avatar({ name, index = 0, size = 'normal' }) {
  return <span className={'avatar avatar-' + size + ' avatar-color-' + (index % 5)} aria-hidden="true">{initials(name)}</span>;
}
function Status({ value }) {
  return <span className={'status status-' + String(value || 'pending').toLowerCase()}><span className="status-dot" />{titleCase(value || 'Pending')}</span>;
}
function Panel({ title, action, children, className = '' }) {
  return <section className={'panel ' + className}><div className="panel-head"><h3>{title}</h3>{action}</div>{children}</section>;
}
function Empty({ icon: Icon = Users, title = 'Nothing here yet', detail = 'Records will appear here when available.' }) {
  return <div className="empty"><Icon size={24} /><strong>{title}</strong><span>{detail}</span></div>;
}
function MiniCalendar({ events, onOpen }) {
  const [month, setMonth] = useState(new Date());
  const year = month.getFullYear(); const m = month.getMonth();
  const first = new Date(year, m, 1).getDay(); const count = new Date(year, m + 1, 0).getDate();
  const today = new Date();
  const cells = Array.from({ length: Math.ceil((first + count) / 7) * 7 }, (_, i) => i - first + 1);
  const eventDays = new Set(events.filter(e => {
    const d = new Date(String(e.date).slice(0, 10) + 'T12:00:00');
    return d.getMonth() === m && d.getFullYear() === year;
  }).map(e => Number(String(e.date).slice(8, 10))));
  const move = step => setMonth(new Date(year, m + step, 1));
  return <Panel title={month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} className="calendar-panel"
    action={<div className="calendar-controls"><button aria-label="Previous month" onClick={() => move(-1)}><ChevronLeft size={15} /></button><button aria-label="Next month" onClick={() => move(1)}><ChevronRight size={15} /></button></div>}>
    <div className="cal-grid">{['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => <span className="cal-week" key={day}>{day}</span>)}
      {cells.map((day, i) => <button key={i} disabled={day < 1 || day > count} onClick={() => onOpen('events')}
        className={'cal-day ' + (day === today.getDate() && m === today.getMonth() && year === today.getFullYear() ? 'cal-today ' : '') + (eventDays.has(day) ? 'cal-event' : '')}>
        {day > 0 && day <= count ? day : ''}</button>)}
    </div>
    <div className="cal-foot"><span className="legend-event" /> Scheduled events <button className="text-link" onClick={() => setMonth(new Date())}>Today</button></div>
  </Panel>;
}
function Login({ onLogin, busy, error }) {
  const [email, setEmail] = useState(DEMO_MODE ? accounts[0].email : '');
  const [password, setPassword] = useState(DEMO_MODE ? 'Demo123!' : '');
  return <div className="login-shell">
    <div className="login-decoration"><div className="brand brand-light"><span className="brand-mark"><GraduationCap size={19} /></span><span>AL·PALMS</span></div>
      <div className="login-art"><div className="art-circle art-circle-one" /><div className="art-circle art-circle-two" /><div className="art-card"><GraduationCap size={48} /><span className="art-lines" /><span className="art-lines short" /></div></div>
      <div><span className="light-eyebrow">STUDENT MANAGEMENT PLATFORM</span><h1>A smarter way to manage your campus.</h1><p>One connected space for student records, admissions, events, and campus insights.</p></div>
    </div>
    <div className="login-right"><div className="login-box">
      {DEMO_MODE && <div className="demo-ribbon"><Sparkles size={14} /> Portfolio demonstration · fictional records</div>}
      <div className="login-icon"><ShieldCheck size={25} /></div><h2>Welcome back</h2><p className="muted">Sign in to your Al-Palms workspace.</p>
      <form onSubmit={e => { e.preventDefault(); onLogin(email, password); }}>
        <label>Email or username<input type="text" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your account" /></label>
        <label>Password<input type="password" required autoComplete={DEMO_MODE ? 'off' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" /></label>
        {error && <div className="form-error">{error}</div>}
        <button className="primary login-submit" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button>
      </form>
      {DEMO_MODE && <div className="demo-accounts"><div className="demo-accounts-label">Quick access · password: <strong>Demo123!</strong></div>
        {accounts.map((a, i) => <button key={a.email} onClick={() => { setEmail(a.email); setPassword('Demo123!'); }} className={'account-choice ' + (email === a.email ? 'selected' : '')}>
          <Avatar name={a.name} index={i} size="sm" /><span><strong>{a.role}</strong><small>{a.email}</small></span><ArrowRight size={15} />
        </button>)}
      </div>}
      <div className="login-footer">© {new Date().getFullYear()} Al-Palms {DEMO_MODE ? '· Demo environment' : '· Administration'}</div>
    </div></div>
  </div>;
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(DEMO_MODE ? 'alpalms-demo-user' : 'alpalms-user') || 'null'); } catch { return null; }
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('alpalms-token') || '');
  const [page, setPage] = useState(routeName(location.pathname));
  const [sidebar, setSidebar] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [campusFilter, setCampusFilter] = useState('All');
  const [students, setStudents] = useState(() => initDemo('students', sampleStudents));
  const [campuses, setCampuses] = useState(() => initDemo('campuses', sampleCampuses));
  const [events, setEvents] = useState(() => initDemo('events', sampleEvents));
  const [activity, setActivity] = useState(() => initDemo('activity', sampleActivity));
  const [staff, setStaff] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [form, setForm] = useState({});
  const isViewer = user && String(user.role).toLowerCase().includes('viewer');

  useEffect(() => { const fn = () => setPage(routeName(location.pathname)); window.addEventListener('popstate', fn); return () => window.removeEventListener('popstate', fn); }, []);
  useEffect(() => { if (DEMO_MODE) {
    localStorage.setItem('alpalms-demo-students', JSON.stringify(students));
    localStorage.setItem('alpalms-demo-campuses', JSON.stringify(campuses));
    localStorage.setItem('alpalms-demo-events', JSON.stringify(events));
    localStorage.setItem('alpalms-demo-activity', JSON.stringify(activity));
  } }, [students, campuses, events, activity]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 3600); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (user && !DEMO_MODE) refresh(token); }, [user?.id, token]);

  const go = id => { history.pushState({}, '', '/' + id); setPage(id); setQuery(''); setStatusFilter('All'); setCampusFilter('All'); setSidebar(false); setNotifications(false); window.scrollTo(0, 0); };
  const refresh = async (currentToken) => {
    if (DEMO_MODE) { setToast('Demo records are up to date'); return; }
    setLoading(true); setError('');
    const data = await Promise.allSettled([
      request('/api/students'), request('/api/campuses'), request('/api/events'),
      request('/api/student-logs'), request('/api/users', { headers: { Authorization: 'Bearer ' + (currentToken || token) } })
    ]);
    const setters = [setStudents, setCampuses, setEvents, setActivity, setStaff];
    let failures = [];
    data.forEach((v, i) => {
      if (v.status === 'fulfilled' && Array.isArray(v.value)) setters[i](v.value);
      else if (i !== 4) failures.push(['students','campuses','events','activity'][i]);
    });
    if (failures.length) setError('Unable to load ' + failures.join(', ') + '. Check your API connection and database.');
    setLoading(false);
  };
  const onLogin = async (email, password) => {
    setBusy(true); setAuthError('');
    try {
      let next;
      if (DEMO_MODE) {
        next = accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase() || a.username === email.trim().toLowerCase());
        if (!next || password !== 'Demo123!') throw new Error('Use a demo account and the password Demo123!');
      } else {
        const res = await request('/api/users/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email.trim(), password })
        });
        next = { ...res.user, name: res.user?.username || email, role: res.user?.role || 'Staff' };
        setToken(res.token); sessionStorage.setItem('alpalms-token', res.token);
      }
      setUser(next); sessionStorage.setItem(DEMO_MODE ? 'alpalms-demo-user' : 'alpalms-user', JSON.stringify(next));
      go('dashboard');
    } catch (e) { setAuthError(e.message); } finally { setBusy(false); }
  };
  const logout = () => {
    sessionStorage.removeItem(DEMO_MODE ? 'alpalms-demo-user' : 'alpalms-user');
    sessionStorage.removeItem('alpalms-token'); setUser(null); setToken(''); setAuthError(''); setError('');
  };
  const updateStatus = async (student, status) => {
    if (isViewer) { setToast('Viewer access is read-only'); return; }
    setBusy(true);
    try {
      if (!DEMO_MODE) await request('/api/students/' + student.id + '/status', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: status === 'APPROVED' ? 'APPROVE' : 'REJECT' })
      });
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status } : s));
      setSelected(prev => prev?.id === student.id ? { ...prev, status } : prev);
      if (DEMO_MODE) setActivity(prev => [{ id: Date.now(), student_name: student.name, action: status === 'APPROVED' ? 'Enrollment approved' : 'Application rejected', details: 'Reviewed by ' + user.name, created_at: new Date().toISOString() }, ...prev]);
      setToast(student.name + ' · ' + titleCase(status));
    } catch (e) { setToast(e.message); } finally { setBusy(false); }
  };
  const createRecord = async e => {
    e.preventDefault(); if (isViewer) return;
    setBusy(true);
    try {
      if (modal === 'campus') {
        const name = String(form.name || '').trim();
        if (!name) throw new Error('Campus name is required');
        const item = DEMO_MODE ? { id: Date.now(), name, colleges: [] } : await request('/api/campuses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
        setCampuses(prev => [...prev, item]); setToast('Campus added');
      } else if (modal === 'event') {
        if (!form.title || !form.description || !form.date || !form.campus || !form.venue) throw new Error('Complete the required event fields');
        let item;
        if (DEMO_MODE) item = { id: Date.now(), ...form };
        else {
          const body = new FormData(); Object.entries(form).forEach(([k, v]) => body.append(k, v));
          await request('/api/events', { method: 'POST', body });
          const list = await request('/api/events'); setEvents(list);
        }
        if (item) setEvents(prev => [...prev, item]); setToast('Event created');
      } else if (modal === 'student') {
        const required = ['name', 'studentNumber', 'contactNumber', 'address', 'email', 'birthday', 'sex', 'campus', 'yearSection', 'password'];
        for (const key of required) if (!String(form[key] || '').trim()) throw new Error('Complete all required student fields');
        if (DEMO_MODE) {
          setStudents(prev => [{ id: Date.now(), name: form.name, email: form.email, campus: form.campus, year: form.yearSection, program: form.program || 'Unassigned', status: 'PENDING', sex: form.sex }, ...prev]);
        } else {
          const body = new FormData(); Object.entries(form).forEach(([k, v]) => body.append(k, v));
          await request('/api/students', { method: 'POST', body });
          const list = await request('/api/students'); setStudents(list);
        }
        setToast('Student registration submitted');
      }
      setModal(null); setForm({});
    } catch (e2) { setToast(e2.message); } finally { setBusy(false); }
  };
  const openModal = (name) => {
    setForm(name === 'event' ? { date: new Date().toISOString().slice(0, 10), time: '09:00', campus: campuses[0]?.name || '' } :
      name === 'student' ? { sex: 'Female', campus: campuses[0]?.name || '', yearSection: '1st Year', birthday: '2005-01-01' } : {});
    setModal(name);
  };
  const exportCSV = () => {
    const cols = ['id', 'name', 'email', 'campus', 'year', 'program', 'status'];
    const csv = [cols.join(','), ...shownStudents.map(s => cols.map(k => '"' + String(s[k] ?? '').replaceAll('"', '""') + '"').join(','))].join('\r\n');
    const u = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a'); anchor.href = u; anchor.download = 'al-palms-students.csv'; anchor.click(); URL.revokeObjectURL(u);
    setToast('CSV export downloaded');
  };
  const approved = students.filter(s => s.status === 'APPROVED').length;
  const pending = students.filter(s => s.status === 'PENDING').length;
  const rejected = students.filter(s => s.status === 'REJECTED').length;
  const allCampuses = campuses.map(c => c.name);
  const shownStudents = students.filter(s => {
    const search = [s.name, s.email, s.campus, s.program, s.year, s.studentNumber].join(' ').toLowerCase().includes(query.toLowerCase());
    return search && (campusFilter === 'All' || s.campus === campusFilter) && (statusFilter === 'All' || s.status === statusFilter) && (page !== 'admissions' || s.status === 'PENDING');
  });
  const recent = students.slice(0, 5);
  const upcoming = [...events].filter(e => String(e.date).slice(0, 10) >= new Date().toISOString().slice(0, 10)).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(0, 4);
  const byCampus = datum(students, 'campus');
  const byYear = datum(students, 'year');
  const greeting = (new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening');
  const navigation = () => <nav className="nav">{sections.map(section => <div className="nav-group" key={section.label}><div className="nav-label">{section.label}</div>
    {section.items.map(([id, label, Icon]) => <button key={id} className={'nav-link ' + (page === id ? 'active' : '')} onClick={() => go(id)}><Icon size={17} strokeWidth={1.85} /><span>{label}</span>{id === 'admissions' && pending > 0 && <small className="nav-count">{pending}</small>}</button>)}
  </div>)}</nav>;
  const studentTable = (rows) => <div className="table-scroll"><table className="data-table"><thead><tr><th>STUDENT</th><th>CAMPUS</th><th>YEAR LEVEL</th><th>STATUS</th><th></th></tr></thead>
    <tbody>{rows.map((s, i) => <tr key={s.id} onClick={() => setSelected(s)} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') setSelected(s); }}>
      <td><div className="person"><Avatar name={s.name} index={i} /><div><strong>{s.name}</strong><small>{s.email || 'No email'}</small></div></div></td>
      <td><span className="cell-text">{s.campus || 'Unassigned'}</span></td><td>{s.year || s.yearSection || '—'}</td><td><Status value={s.status} /></td><td><button className="icon-button row-arrow" aria-label={'View ' + s.name} onClick={e => { e.stopPropagation(); setSelected(s); }}><ArrowRight size={16} /></button></td>
    </tr>)}</tbody></table>{rows.length === 0 && <Empty title="No matching students" detail="Try another search or filter." />}</div>;

  if (!user) return <Login onLogin={onLogin} busy={busy} error={authError} />;

  return <div className="app-shell">
    {sidebar && <div className="mobile-scrim" onClick={() => setSidebar(false)} />}
    <aside className={'sidebar ' + (sidebar ? 'sidebar-open' : '')}>
      <div className="sidebar-logo"><span className="brand-mark"><GraduationCap size={19} /></span><strong>AL<span>·</span>PALMS</strong><button className="close-mobile" onClick={() => setSidebar(false)} aria-label="Close menu"><X size={19} /></button></div>
      <div className="workspace-caption">CAMPUS ADMINISTRATION</div>
      {navigation()}
      <div className="sidebar-bottom"><div className="sidebar-help"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need assistance?</strong><p>Manage your campus with confidence.</p><button onClick={() => go('settings')}>Go to settings <ArrowRight size={13} /></button></div>
        <button className="profile-block" onClick={logout}><Avatar name={user.name || user.username} index={3} /><span><strong>{user.name || user.username}</strong><small>{user.role || 'Staff'}</small></span><LogOut size={16} /></button>
      </div>
    </aside>
    <div className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="menu-mobile icon-button" onClick={() => setSidebar(true)} aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{sections.flatMap(s => s.items).find(i => i[0] === page)?.[1]}</strong></div></div>
        <div className="topbar-right"><div className="top-search"><Search size={16} /><input aria-label="Search students" placeholder="Search students..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && page !== 'students') { const searchValue = query; go('students'); setQuery(searchValue); } }} /></div>
          <button className="icon-button refresh-button" aria-label="Refresh data" title="Refresh data" onClick={() => refresh(token)}><RefreshCw size={17} className={loading ? 'spin' : ''} /></button>
          <div className="notification-wrap"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotifications(v => !v)}><Bell size={18} />{pending > 0 && <span className="notification-dot" />}</button>
            {notifications && <div className="notification-pop"><strong>Notifications</strong><p>{pending ? pending + ' student applications need review.' : 'You are all caught up.'}</p><button onClick={() => go('admissions')}>View admissions <ArrowRight size={14} /></button></div>}</div>
          <div className="top-avatar"><Avatar name={user.name || user.username} index={3} size="sm" /></div>
        </div>
      </header>
      <main className="content">
        {DEMO_MODE && <div className="demo-banner"><Sparkles size={15} /><span><strong>Portfolio demo</strong> — fictional student records; changes stay in this browser only.</span><button onClick={() => { if (confirm('Reset demo data to its original state?')) { ['students','campuses','events','activity'].forEach(k => localStorage.removeItem('alpalms-demo-' + k)); setStudents(sampleStudents); setCampuses(sampleCampuses); setEvents(sampleEvents); setActivity(sampleActivity); setToast('Demo data reset'); } }}>Reset demo</button></div>}
        {error && <div className="error-banner"><CircleHelp size={17} /><span>{error}</span><button onClick={() => refresh(token)}>Retry</button></div>}
        {page === 'dashboard' && <>
          <div className="page-heading"><div><span className="eyebrow">OVERVIEW</span><h1>Dashboard</h1><p>Here's what's happening across your campuses today.</p></div><span className="date-chip"><CalendarDays size={15} /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
          <div className="dashboard-layout"><div className="dashboard-main">
            <div className="welcome-banner"><div><span className="hero-kicker"><Sparkles size={13} /> Your campus at a glance</span><h2>{greeting}, {String(user.name || user.username || 'Admin').split(' ')[0]}!</h2><p>You have <strong>{pending} applications</strong> awaiting your review. Keep your student community moving forward.</p><button onClick={() => go('admissions')}>Review admissions <ArrowRight size={15} /></button></div><div className="hero-art"><span className="hero-orbit" /><span className="hero-card hero-card-one"><GraduationCap size={38} /></span><span className="hero-card hero-card-two"><CheckCircle2 size={25} /></span><span className="hero-small-dot" /></div></div>
            <div className="metric-grid">
              {[[Users, 'Total students', students.length, '#e7efff', '#2261dc'], [CheckCircle2, 'Approved', approved, '#dcf8ec', '#149e67'], [Clock3, 'Pending review', pending, '#fff1df', '#ed8b25'], [Building2, 'Campuses', campuses.length, '#ece8ff', '#7654d6']].map(([Icon, label, value, bg, fg]) => <div className="metric-card" key={label}><span className="metric-icon" style={{ background: bg, color: fg }}><Icon size={19} /></span><div><span className="metric-label">{label}</span><div className="metric-number">{value.toLocaleString()}</div></div><ArrowRight size={15} className="metric-arrow" /></div>)}
            </div>
            <div className="dashboard-two">
              <Panel title="Student enrollment" action={<button className="text-link" onClick={() => go('students')}>View all <ArrowRight size={13} /></button>}>
                <div className="enrollment-main"><div className="donut" style={{ '--donut': percent(approved, students.length) + '%' }}><div><strong>{percent(approved, students.length)}%</strong><small>Approved</small></div></div><div className="donut-breakdown"><div><span className="swatch blue" /><span>Approved</span><strong>{approved}</strong></div><div><span className="swatch orange" /><span>Pending</span><strong>{pending}</strong></div><div><span className="swatch gray" /><span>Rejected</span><strong>{rejected}</strong></div></div></div>
              </Panel>
              <Panel title="Students by campus" action={<button className="text-link" onClick={() => go('analytics')}>Insights <ArrowRight size={13} /></button>}>
                <div className="progress-list">{byCampus.slice(0, 4).map(([name, count], i) => <div className="progress-item" key={name}><div><span title={name}>{name}</span><strong>{count}</strong></div><div className="progress-track"><span style={{ width: percent(count, students.length) + '%', background: ['#2868db','#ff9c41','#69c9c1','#a48bf0'][i] }} /></div></div>)}{!byCampus.length && <Empty />}</div>
              </Panel>
            </div>
            <Panel title="Recent students" className="recent-panel" action={<button className="text-link" onClick={() => go('students')}>View all students <ArrowRight size={13} /></button>}>{studentTable(recent)}</Panel>
          </div>
          <aside className="dashboard-aside"><MiniCalendar events={events} onOpen={go} />
            <Panel title="Upcoming events" action={<button className="text-link" onClick={() => go('events')}>View all <ArrowRight size={13} /></button>}>
              <div className="event-mini-list">{upcoming.length ? upcoming.slice(0, 3).map((e, i) => <button className="event-mini" key={e.id} onClick={() => go('events')}><span className={'event-datebox event-date-' + i}><strong>{new Date(String(e.date).slice(0, 10) + 'T12:00:00').getDate()}</strong><small>{new Date(String(e.date).slice(0, 10) + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}</small></span><span><strong>{e.title}</strong><small><Clock3 size={12} /> {e.time || 'All day'} · {e.venue || 'Campus'}</small></span><ArrowRight size={14} /></button>) : <Empty icon={CalendarDays} title="No upcoming events" />}</div>
            </Panel>
            <div className="quick-card"><div className="quick-star"><Sparkles size={18} /></div><h3>Everything in one place</h3><p>Review enrollment, explore campus insights and stay organized.</p><button onClick={() => go('analytics')}>Explore insights <ArrowRight size={14} /></button></div>
          </aside></div>
        </>}
        {(page === 'students' || page === 'admissions') && <>
          <div className="page-heading"><div><span className="eyebrow">{page === 'students' ? 'STUDENT MANAGEMENT' : 'APPLICATION REVIEW'}</span><h1>{page === 'students' ? 'Students' : 'Admissions'}</h1><p>{page === 'students' ? 'A complete overview of your student directory.' : 'Review applications waiting for an enrollment decision.'}</p></div>
            <div className="heading-actions">{page === 'students' && <button className="secondary" onClick={exportCSV}><ArrowDownToLine size={15} /> Export CSV</button>}{!isViewer && page === 'students' && <button className="primary" onClick={() => openModal('student')}><Plus size={16} /> Add student</button>}</div>
          </div>
          <div className="submetric-row"><span><strong>{page === 'admissions' ? pending : students.length}</strong> {page === 'admissions' ? 'Awaiting review' : 'Total students'}</span><span><span className="status-dot green-dot" /> {approved} Approved</span><span><span className="status-dot amber-dot" /> {pending} Pending</span></div>
          <Panel title={page === 'students' ? 'Student directory' : 'Pending applications'} className="directory-panel" action={<span className="muted">{shownStudents.length} records</span>}>
            <div className="filter-row"><div className="filter-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, email or program" /></div>
              <select aria-label="Filter campus" value={campusFilter} onChange={e => setCampusFilter(e.target.value)}><option>All</option>{allCampuses.map(c => <option key={c}>{c}</option>)}</select>
              {page === 'students' && <select aria-label="Filter status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All</option><option>APPROVED</option><option>PENDING</option><option>REJECTED</option></select>}
            </div>
            {studentTable(shownStudents)}
          </Panel>
        </>}
        {page === 'analytics' && <>
          <div className="page-heading"><div><span className="eyebrow">DATA & INSIGHTS</span><h1>Analytics</h1><p>Understand enrollment and track campus activity.</p></div><button className="secondary" onClick={() => refresh(token)}><RefreshCw size={15} /> Refresh</button></div>
          <div className="metric-grid analytics-metrics">{[['Total enrollment', students.length], ['Approval rate', percent(approved, students.length) + '%'], ['Pending applications', pending], ['Upcoming events', upcoming.length]].map(([name, val]) => <div className="metric-card" key={name}><div><span className="metric-label">{name}</span><div className="metric-number">{val}</div></div></div>)}</div>
          <div className="analytics-grid"><Panel title="Enrollment by campus"><div className="chart-bars">{byCampus.map(([name, count], i) => <div className="chart-row" key={name}><div className="chart-label"><span>{name}</span><strong>{count}</strong></div><div className="chart-track"><span style={{ width: percent(count, Math.max(...byCampus.map(v => v[1]), 1)) + '%', background: ['#2868db', '#ff9e49', '#76c7c6', '#8c7beb'][i % 4] }} /></div></div>)}{!byCampus.length && <Empty />}</div></Panel>
            <Panel title="Year level distribution"><div className="chart-bars">{byYear.map(([name, count], i) => <div className="chart-row" key={name}><div className="chart-label"><span>{name}</span><strong>{count}</strong></div><div className="chart-track"><span style={{ width: percent(count, Math.max(...byYear.map(v => v[1]), 1)) + '%', background: ['#ff9e49', '#2868db', '#69c5b7', '#9b86e5'][i % 4] }} /></div></div>)}{!byYear.length && <Empty />}</div></Panel>
          </div><div className="analytics-grid"><Panel title="Application status"><div className="large-status-list">{[['Approved', approved, '#2e6fe4'], ['Pending', pending, '#ff9c41'], ['Rejected', rejected, '#cbd3e2']].map(([name, val, color]) => <div key={name}><span className="swatch" style={{ background: color }} /><span>{name}</span><strong>{val}</strong><span className="muted">{percent(val, students.length)}%</span></div>)}</div></Panel>
            <Panel title="Recent activity"><div className="activity-list">{activity.slice(0, 5).map((a, i) => <div className="activity-row" key={a.id || i}><span className="activity-icon"><Activity size={15} /></span><div><strong>{a.action}</strong><span>{a.student_name || 'System'} · {readableDate(a.created_at)}</span></div></div>)}{!activity.length && <Empty />}</div></Panel>
          </div>
        </>}
        {page === 'campuses' && <>
          <div className="page-heading"><div><span className="eyebrow">INSTITUTION DIRECTORY</span><h1>Campuses</h1><p>Organize campuses, colleges, and academic programs.</p></div>{!isViewer && <button className="primary" onClick={() => openModal('campus')}><Plus size={16} /> Add campus</button>}</div>
          <div className="campus-grid">{campuses.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).map((c, i) => <div className="campus-card" key={c.id}><div className="campus-card-top"><div className={'campus-icon campus-color-' + i % 4}><Building2 size={21} /></div><Status value="ACTIVE" /></div><h3>{c.name}</h3><p>Campus ID #{c.id}</p><div className="campus-summary"><span><strong>{c.colleges?.length || 0}</strong> Colleges</span><span><strong>{(c.colleges || []).reduce((n, col) => n + (col.programs || []).length, 0)}</strong> Programs</span><span><strong>{students.filter(s => s.campus === c.name).length}</strong> Students</span></div><div className="campus-programs">{(c.colleges || []).slice(0, 3).map(col => <div key={col.id}><BookOpen size={14} /> {col.name}</div>)}{!c.colleges?.length && <span>No colleges yet</span>}</div></div>)}
          </div>{!campuses.length && <Empty icon={Building2} title="No campuses yet" detail="Add your first campus to organize programs." />}
        </>}
        {page === 'events' && <>
          <div className="page-heading"><div><span className="eyebrow">CAMPUS LIFE</span><h1>Events</h1><p>Keep students connected to upcoming campus activities.</p></div>{!isViewer && <button className="primary" onClick={() => openModal('event')}><Plus size={16} /> Create event</button>}</div>
          <div className="events-grid">{[...events].filter(e => [e.title, e.campus, e.venue].join(' ').toLowerCase().includes(query.toLowerCase())).sort((a,b) => String(a.date).localeCompare(String(b.date))).map((e, i) => <article className="event-card" key={e.id}><div className={'event-cover cover-' + (i % 4)}><div><CalendarDays size={32} /></div><span>{String(e.date).slice(0, 10) >= new Date().toISOString().slice(0, 10) ? 'Upcoming' : 'Past event'}</span></div><div className="event-body"><div className="event-meta"><CalendarDays size={14} /> {readableDate(e.date)} <span>·</span> <Clock3 size={14} /> {e.time || 'TBA'}</div><h3>{e.title}</h3><p>{e.description || 'Campus activity'}</p><div className="event-location"><Building2 size={14} /><span>{e.campus || 'All campuses'} · {e.venue || 'TBA'}</span></div></div></article>)}</div>
          {!events.length && <Empty icon={CalendarDays} title="No events yet" />}
        </>}
        {page === 'activity' && <>
          <div className="page-heading"><div><span className="eyebrow">AUDIT TRAIL</span><h1>Activity log</h1><p>Recent changes and student-related activity.</p></div></div>
          <Panel title="Recent activity" className="activity-panel"><div className="activity-list">{activity.filter(a => [a.student_name, a.action, a.details].join(' ').toLowerCase().includes(query.toLowerCase())).map((a, i) => <div className="activity-row" key={a.id || i}><span className="activity-icon"><Activity size={16} /></span><div><strong>{a.action || 'Activity'}</strong><span>{a.student_name || 'System'} · {a.details || 'No additional details'}</span></div><time>{readableDate(a.created_at)}</time></div>)}{!activity.length && <Empty icon={Activity} />}</div></Panel>
        </>}
        {page === 'users' && <>
          <div className="page-heading"><div><span className="eyebrow">ACCESS MANAGEMENT</span><h1>Users</h1><p>Administrator, registrar, and staff access to Al-Palms.</p></div></div>
          <Panel title="Workspace accounts" className="directory-panel"><div className="user-cards">{(DEMO_MODE ? accounts : staff).map((s, i) => <div className="user-card" key={s.id || s.email}><Avatar name={s.name || s.username} index={i} /><div><strong>{s.name || s.username}</strong><small>{s.email || s.username}</small></div><span className="role-tag">{s.role || 'Staff'}</span></div>)}</div>{!DEMO_MODE && !staff.length && <Empty icon={Users} title="User directory unavailable" detail="This view requires an authorized administrator API session." />}</Panel>
        </>}
        {page === 'settings' && <>
          <div className="page-heading"><div><span className="eyebrow">PREFERENCES</span><h1>Settings</h1><p>Workspace information and environment details.</p></div></div>
          <div className="settings-grid"><Panel title="Your account"><div className="settings-profile"><Avatar name={user.name || user.username} index={3} /><div><h3>{user.name || user.username}</h3><p>{user.email || user.username}</p><Status value={user.role || 'Staff'} /></div></div><button className="secondary" onClick={logout}><LogOut size={15} /> Sign out</button></Panel>
            <Panel title="Environment"><div className="setting-line"><span>Application</span><strong>Al-Palms</strong></div><div className="setting-line"><span>Mode</span><strong>{DEMO_MODE ? 'Portfolio demo' : 'Production'}</strong></div><div className="setting-line"><span>Data source</span><strong>{DEMO_MODE ? 'Synthetic browser data' : (API_BASE || 'Not configured')}</strong></div><div className="setting-line"><span>Role</span><strong>{user.role}</strong></div>{DEMO_MODE && <button className="secondary" onClick={() => { ['students','campuses','events','activity'].forEach(k => localStorage.removeItem('alpalms-demo-' + k)); setStudents(sampleStudents); setCampuses(sampleCampuses); setEvents(sampleEvents); setActivity(sampleActivity); setToast('Demo records restored'); }}>Restore sample records</button>}</Panel>
          </div>
        </>}
        <footer className="page-footer">Al-Palms Student Management <span>·</span> {DEMO_MODE ? 'Demo environment — no real student records' : 'Campus administration'}</footer>
      </main>
    </div>
    {toast && <div role="status" className="toast"><CheckCircle2 size={17} /> {toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={15} /></button></div>}
    {selected && <><div className="drawer-overlay" onClick={() => setSelected(null)} /><aside className="detail-drawer"><div className="drawer-head"><h3>Student details</h3><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close details"><X size={19} /></button></div><div className="student-detail-hero"><Avatar name={selected.name} size="lg" /><h2>{selected.name}</h2><p>{selected.email}</p><Status value={selected.status} /></div>
      <div className="detail-rows">{[['Student ID', selected.id], ['Campus', selected.campus], ['Year level', selected.year || selected.yearSection], ['Program', selected.program], ['College', selected.college], ['Status', titleCase(selected.status)]].map(([k, v]) => <div key={k}><span>{k}</span><strong>{v || '—'}</strong></div>)}</div>
      {selected.status === 'PENDING' && !isViewer && <div className="drawer-actions"><button className="primary" disabled={busy} onClick={() => updateStatus(selected, 'APPROVED')}><Check size={16} /> Approve application</button><button className="secondary danger" disabled={busy} onClick={() => updateStatus(selected, 'REJECTED')}><X size={16} /> Reject</button></div>}
    </aside></>}
    {modal && <><div className="modal-overlay" onClick={() => setModal(null)} /><div className="modal-box" role="dialog" aria-modal="true" aria-label={'Add ' + modal}><div className="modal-head"><div><h2>{modal === 'student' ? 'Add student' : modal === 'event' ? 'Create event' : 'Add campus'}</h2><p>Complete the fields below to continue.</p></div><button className="icon-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div>
      <form onSubmit={createRecord} className="modal-form">
        {modal === 'campus' && <label>Campus name<input required placeholder="Campus name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></label>}
        {modal === 'event' && <><label>Event title<input required value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label>Description<textarea required rows="3" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></label><div className="form-grid"><label>Date<input required type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} /></label><label>Time<input required type="time" value={form.time || ''} onChange={e => setForm({ ...form, time: e.target.value })} /></label></div><label>Campus<select required value={form.campus || ''} onChange={e => setForm({ ...form, campus: e.target.value })}>{campuses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></label><label>Venue<input required value={form.venue || ''} onChange={e => setForm({ ...form, venue: e.target.value })} /></label></>}
        {modal === 'student' && <><div className="form-grid"><label>Full name<input required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Student number<input required value={form.studentNumber || ''} onChange={e => setForm({ ...form, studentNumber: e.target.value })} /></label></div><label>Email<input required type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></label><div className="form-grid"><label>Contact number<input required value={form.contactNumber || ''} onChange={e => setForm({ ...form, contactNumber: e.target.value })} /></label><label>Date of birth<input required type="date" value={form.birthday || ''} onChange={e => setForm({ ...form, birthday: e.target.value })} /></label></div><label>Address<input required value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} /></label><div className="form-grid"><label>Sex<select required value={form.sex || 'Female'} onChange={e => setForm({ ...form, sex: e.target.value })}><option>Female</option><option>Male</option><option>Other</option></select></label><label>Year level<input required value={form.yearSection || ''} onChange={e => setForm({ ...form, yearSection: e.target.value })} /></label></div><label>Campus<select required value={form.campus || ''} onChange={e => setForm({ ...form, campus: e.target.value })}>{campuses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></label><label>Program<input value={form.program || ''} onChange={e => setForm({ ...form, program: e.target.value })} /></label><label>Initial password<input type="password" required minLength={8} value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} /></label></>}
        <div className="modal-buttons"><button className="secondary" type="button" onClick={() => setModal(null)}>Cancel</button><button className="primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'} <ArrowRight size={15} /></button></div>
      </form>
    </div></>}
  </div>;
}
