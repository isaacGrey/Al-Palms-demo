// Fictional records for the public portfolio demonstration.
const names = [
  'Sofia Reyes', 'Liam Navarro', 'Mika Santos', 'Noah Cruz', 'Ava Mendoza',
  'Ethan Flores', 'Isabella Ramos', 'Lucas Villanueva', 'Chloe Garcia',
  'Adrian Bautista', 'Ella Fernandez', 'Gabriel Aquino', 'Zoe Martinez',
  'Jacob Lim', 'Hannah Rivera', 'Caleb Torres', 'Amelia Dizon', 'Nathan Lopez',
  'Olivia Castillo', 'Daniel Sy', 'Grace Velasco', 'Leo Domingo', 'Emma Tan', 'Kai Mercado'
];
export const sampleCampuses = [
  { id: 1, name: 'Bacolor (Main Campus)', colleges: [{ id: 11, name: 'College of Computing', programs: [{ id: 101, name: 'BS Information Technology' }, { id: 102, name: 'BS Computer Science' }] }, { id: 12, name: 'College of Business', programs: [{ id: 103, name: 'BS Business Administration' }] }] },
  { id: 2, name: 'San Fernando Campus', colleges: [{ id: 21, name: 'College of Education', programs: [{ id: 201, name: 'Bachelor of Elementary Education' }] }] },
  { id: 3, name: 'Porac Campus', colleges: [{ id: 31, name: 'College of Arts', programs: [{ id: 301, name: 'BA Communication' }] }] }
];
export const sampleStudents = names.map((name, i) => ({
  id: 1001 + i, name, email: name.toLowerCase().replaceAll(' ', '.') + '@example.edu',
  campus: sampleCampuses[i % 3].name,
  year: ['1st Year', '2nd Year', '3rd Year', '4th Year'][i % 4],
  college: ['College of Computing', 'College of Business', 'College of Education'][i % 3],
  program: ['BS Information Technology', 'BS Business Administration', 'Bachelor of Elementary Education'][i % 3],
  sex: i % 2 ? 'Male' : 'Female',
  status: i % 9 === 0 ? 'REJECTED' : i % 4 === 0 ? 'PENDING' : 'APPROVED'
}));
const dateIn = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export const sampleEvents = [
  { id: 1, title: 'Freshmen Orientation', date: dateIn(2), time: '09:00', venue: 'Main Auditorium', campus: 'Bacolor (Main Campus)', description: 'Welcome session for incoming students.' },
  { id: 2, title: 'Career Pathways Seminar', date: dateIn(5), time: '13:30', venue: 'Innovation Hall', campus: 'San Fernando Campus', description: 'Meet professionals and explore career options.' },
  { id: 3, title: 'Campus Community Day', date: dateIn(9), time: '10:00', venue: 'Open Grounds', campus: 'Porac Campus', description: 'Community projects and student activities.' },
  { id: 4, title: 'Student Research Showcase', date: dateIn(14), time: '08:30', venue: 'Main Auditorium', campus: 'Bacolor (Main Campus)', description: 'Student projects and research presentations.' }
];
export const sampleActivity = [
  { id: 1, student_name: 'Sofia Reyes', action: 'Profile updated', details: 'Student information reviewed', created_at: dateIn(0) },
  { id: 2, student_name: 'Liam Navarro', action: 'Enrollment approved', details: 'Application approved', created_at: dateIn(-1) },
  { id: 3, student_name: 'Mika Santos', action: 'Registration submitted', details: 'New application received', created_at: dateIn(-1) },
  { id: 4, student_name: 'Ava Mendoza', action: 'Campus assigned', details: 'Campus information confirmed', created_at: dateIn(-2) }
];
export const accounts = [
  { email: 'admin@alpalms.demo', username: 'admin', role: 'Administrator', name: 'Alex Morgan', description: 'Full dashboard access' },
  { email: 'registrar@alpalms.demo', username: 'registrar', role: 'Registrar', name: 'Jamie Rivera', description: 'Review student admissions' },
  { email: 'viewer@alpalms.demo', username: 'viewer', role: 'Viewer', name: 'Taylor Cruz', description: 'Read-only access' }
];
