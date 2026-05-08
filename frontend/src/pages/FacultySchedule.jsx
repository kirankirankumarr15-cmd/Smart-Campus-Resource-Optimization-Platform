import { useState } from 'react'
import { Calendar, Clock, BookOpen, Users, MapPin, ChevronLeft, ChevronRight, Plus, X, CheckCircle2, Edit3 } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

const SUBJECTS = [
  { code: 'CS601', name: 'Machine Learning', dept: 'CSE', credits: 4 },
  { code: 'CS602', name: 'Cloud Computing', dept: 'CSE', credits: 3 },
  { code: 'CS603', name: 'Software Engineering', dept: 'CSE', credits: 4 },
  { code: 'CS604', name: 'Computer Networks', dept: 'CSE', credits: 3 },
  { code: 'CS605', name: 'Database Systems', dept: 'CSE', credits: 3 },
]

const ROOMS = ['A-101', 'A-202', 'A-301', 'B-102', 'B-201', 'C-101', 'Seminar Hall 1', 'Lab 3']

const FACULTY = [
  { id: 1, name: 'Dr. Ravi Kumar',     dept: 'CSE', designation: 'Professor',        subjects: ['CS601', 'CS603'] },
  { id: 2, name: 'Prof. Anitha Rao',   dept: 'CSE', designation: 'Assoc. Professor',  subjects: ['CS602', 'CS604'] },
  { id: 3, name: 'Dr. Suresh Patil',   dept: 'CSE', designation: 'Asst. Professor',   subjects: ['CS605', 'CS601'] },
  { id: 4, name: 'Ms. Kavitha Nair',   dept: 'CSE', designation: 'Asst. Professor',   subjects: ['CS602', 'CS605'] },
  { id: 5, name: 'Dr. Mohan Hegde',    dept: 'CSE', designation: 'Professor',          subjects: ['CS603', 'CS604'] },
]

const CLASS_COLORS = ['bg-blue-100 text-blue-800', 'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-700', 'bg-orange/10 text-orange', 'bg-pink-100 text-pink-700']

function generateSchedule() {
  const schedule = {}
  DAYS.forEach(day => {
    schedule[day] = {}
    TIME_SLOTS.forEach(slot => { schedule[day][slot] = null })
  })
  // Pre-fill some classes
  const entries = [
    { day: 'Monday',    time: '09:00', subject: SUBJECTS[0], faculty: FACULTY[0], room: 'A-202', students: 45 },
    { day: 'Monday',    time: '11:00', subject: SUBJECTS[2], faculty: FACULTY[4], room: 'A-101', students: 38 },
    { day: 'Monday',    time: '14:00', subject: SUBJECTS[4], faculty: FACULTY[2], room: 'B-102', students: 52 },
    { day: 'Tuesday',   time: '08:00', subject: SUBJECTS[1], faculty: FACULTY[1], room: 'A-301', students: 41 },
    { day: 'Tuesday',   time: '10:00', subject: SUBJECTS[3], faculty: FACULTY[3], room: 'B-201', students: 33 },
    { day: 'Tuesday',   time: '15:00', subject: SUBJECTS[0], faculty: FACULTY[0], room: 'Lab 3', students: 20 },
    { day: 'Wednesday', time: '09:00', subject: SUBJECTS[2], faculty: FACULTY[4], room: 'Seminar Hall 1', students: 80 },
    { day: 'Wednesday', time: '11:00', subject: SUBJECTS[4], faculty: FACULTY[2], room: 'C-101', students: 44 },
    { day: 'Thursday',  time: '10:00', subject: SUBJECTS[1], faculty: FACULTY[1], room: 'A-202', students: 39 },
    { day: 'Thursday',  time: '13:00', subject: SUBJECTS[3], faculty: FACULTY[3], room: 'A-101', students: 55 },
    { day: 'Friday',    time: '09:00', subject: SUBJECTS[0], faculty: FACULTY[0], room: 'A-301', students: 48 },
    { day: 'Friday',    time: '14:00', subject: SUBJECTS[2], faculty: FACULTY[4], room: 'B-102', students: 36 },
    { day: 'Saturday',  time: '09:00', subject: SUBJECTS[4], faculty: FACULTY[2], room: 'C-101', students: 22 },
  ]
  entries.forEach((e, idx) => {
    schedule[e.day][e.time] = { ...e, colorClass: CLASS_COLORS[idx % CLASS_COLORS.length], id: idx + 1 }
  })
  return schedule
}

function AddClassModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    day: 'Monday', time: '09:00', subjectIdx: 0, facultyIdx: 0, room: ROOMS[0], students: 40
  })

  const handleAdd = () => {
    onAdd({
      day: form.day, time: form.time,
      subject: SUBJECTS[form.subjectIdx],
      faculty: FACULTY[form.facultyIdx],
      room: form.room, students: form.students,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px]"
           onClick={e => e.stopPropagation()}>
        <div className="bg-navy text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <p className="text-nav font-semibold">Schedule New Class</p>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-label uppercase tracking-wider text-textmute block mb-1">Day</label>
              <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-body">
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-label uppercase tracking-wider text-textmute block mb-1">Time Slot</label>
              <select value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-body">
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-label uppercase tracking-wider text-textmute block mb-1">Subject</label>
            <select value={form.subjectIdx} onChange={e => setForm(f => ({ ...f, subjectIdx: +e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-body">
              {SUBJECTS.map((s, i) => <option key={s.code} value={i}>{s.code} – {s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-label uppercase tracking-wider text-textmute block mb-1">Faculty</label>
            <select value={form.facultyIdx} onChange={e => setForm(f => ({ ...f, facultyIdx: +e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-body">
              {FACULTY.map((f, i) => <option key={f.id} value={i}>{f.name} – {f.designation}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-label uppercase tracking-wider text-textmute block mb-1">Room</label>
              <select value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-body">
                {ROOMS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-label uppercase tracking-wider text-textmute block mb-1">Students</label>
              <input type="number" value={form.students} onChange={e => setForm(f => ({ ...f, students: +e.target.value }))}
                     className="w-full px-3 py-2 border border-gray-200 rounded-lg text-body" />
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={handleAdd}
                  className="flex-1 h-10 bg-orange hover:bg-orange/90 text-white text-body font-medium rounded-pill transition-colors">
            <Plus size={15} className="inline mr-1.5" /> Add to Schedule
          </button>
          <button onClick={onClose}
                  className="px-4 h-10 border border-gray-200 text-navy text-body rounded-pill hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FacultySchedule() {
  const [schedule, setSchedule] = useState(generateSchedule)
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [toast, setToast] = useState(null)

  const handleAddClass = (entry) => {
    const colorClass = CLASS_COLORS[Math.floor(Math.random() * CLASS_COLORS.length)]
    setSchedule(prev => ({
      ...prev,
      [entry.day]: {
        ...prev[entry.day],
        [entry.time]: { ...entry, colorClass, id: Date.now() },
      }
    }))
    setShowAdd(false)
    setToast(`Class scheduled: ${entry.subject.code} on ${entry.day} at ${entry.time}`)
    setTimeout(() => setToast(null), 4000)
  }

  const removeEntry = (day, time) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [time]: null }
    }))
  }

  // Filter by faculty if selected
  const getCell = (day, time) => {
    const entry = schedule[day]?.[time]
    if (!entry) return null
    if (selectedFaculty && entry.faculty.id !== selectedFaculty) return null
    return entry
  }

  const getWeekLabel = () => {
    const now = new Date()
    now.setDate(now.getDate() + weekOffset * 7)
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay() + 1)
    const end = new Date(start)
    end.setDate(start.getDate() + 5)
    return `${start.toLocaleDateString('en-IN', { day:'2-digit', month:'short' })} – ${end.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}`
  }

  const totalClasses = Object.values(schedule).flatMap(d => Object.values(d)).filter(Boolean).length
  const totalStudents = Object.values(schedule).flatMap(d => Object.values(d))
    .filter(Boolean).reduce((a, e) => a + e.students, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-hero font-medium text-navy">Faculty Schedule</h2>
          <p className="text-body text-textmute mt-1">
            Weekly class timetable — {totalClasses} classes · {totalStudents} student-slots
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-4 h-10 bg-orange hover:bg-orange/90 text-white text-body font-medium rounded-pill transition-colors">
          <Plus size={16} /> Schedule Class
        </button>
      </div>

      {/* Faculty filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedFaculty(null)}
          className={`px-3 h-8 rounded-full text-label transition-colors
            ${!selectedFaculty ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-textmute hover:text-navy'}`}
        >
          All Faculty
        </button>
        {FACULTY.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFaculty(f.id === selectedFaculty ? null : f.id)}
            className={`px-3 h-8 rounded-full text-label transition-colors
              ${selectedFaculty === f.id ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-textmute hover:text-navy'}`}
          >
            {f.name.split(' ').slice(-1)[0]}
          </button>
        ))}
      </div>

      {/* Week nav */}
      <div className="flex items-center gap-3">
        <button onClick={() => setWeekOffset(o => o - 1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-page">
          <ChevronLeft size={16} className="text-navy" />
        </button>
        <span className="text-body font-medium text-navy">{getWeekLabel()}</span>
        <button onClick={() => setWeekOffset(o => o + 1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-page">
          <ChevronRight size={16} className="text-navy" />
        </button>
        {weekOffset !== 0 && (
          <button onClick={() => setWeekOffset(0)} className="text-label text-orange hover:underline">
            Today
          </button>
        )}
      </div>

      {/* Timetable grid */}
      <div className="bg-white rounded-card border border-gray-100 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-label uppercase tracking-wider text-textmute w-20 bg-page">
                Time
              </th>
              {DAYS.map(day => (
                <th key={day} className="px-3 py-3 text-left text-label uppercase tracking-wider text-textmute bg-page border-l border-gray-100">
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-2 text-label text-textmute font-medium whitespace-nowrap align-top pt-3">
                  {time}
                </td>
                {DAYS.map(day => {
                  const entry = getCell(day, time)
                  return (
                    <td key={day} className="px-2 py-1.5 border-l border-gray-100 align-top min-w-[140px]">
                      {entry ? (
                        <div className={`rounded-xl p-2 ${entry.colorClass} relative group`}>
                          <button
                            onClick={() => removeEntry(day, time)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:bg-black/10 rounded p-0.5 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                          <p className="text-[11px] font-bold leading-tight">{entry.subject.code}</p>
                          <p className="text-[10px] leading-tight mt-0.5 opacity-80">{entry.subject.name}</p>
                          <p className="text-[10px] mt-1 opacity-70 flex items-center gap-1">
                            <MapPin size={8} /> {entry.room}
                          </p>
                          <p className="text-[10px] opacity-70 flex items-center gap-1">
                            <Users size={8} /> {entry.students} students
                          </p>
                          <p className="text-[10px] opacity-70 truncate">{entry.faculty.name.split(' ').slice(-2).join(' ')}</p>
                        </div>
                      ) : (
                        <div className="h-full min-h-[60px]" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Faculty Load Summary */}
      <div>
        <h3 className="text-nav font-medium text-navy mb-3">Faculty Load Summary</h3>
        <div className="grid grid-cols-3 gap-3">
          {FACULTY.map(f => {
            const classCount = Object.values(schedule)
              .flatMap(d => Object.values(d))
              .filter(e => e && e.faculty.id === f.id).length
            const studentCount = Object.values(schedule)
              .flatMap(d => Object.values(d))
              .filter(e => e && e.faculty.id === f.id)
              .reduce((a, e) => a + e.students, 0)
            const load = classCount > 4 ? 'High' : classCount > 2 ? 'Medium' : 'Low'
            const loadColor = load === 'High' ? 'text-red-600 bg-red-50' :
                              load === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'
            return (
              <div key={f.id} className="bg-white rounded-card p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-full bg-navy text-white text-nav font-medium flex items-center justify-center">
                    {f.name[0]}
                  </div>
                  <span className={`text-label px-2 py-0.5 rounded-full ${loadColor}`}>{load}</span>
                </div>
                <p className="text-body font-medium text-navy">{f.name}</p>
                <p className="text-label text-textmute">{f.designation}</p>
                <div className="flex gap-4 mt-2">
                  <div>
                    <p className="text-stat font-medium text-navy leading-none">{classCount}</p>
                    <p className="text-label text-textmute">Classes</p>
                  </div>
                  <div>
                    <p className="text-stat font-medium text-navy leading-none">{studentCount}</p>
                    <p className="text-label text-textmute">Students</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      {showAdd && <AddClassModal onClose={() => setShowAdd(false)} onAdd={handleAddClass} />}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-2xl
                        flex items-center gap-3 z-50">
          <CheckCircle2 size={18} />
          <p className="text-body font-medium">{toast}</p>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80"><X size={14} /></button>
        </div>
      )}
    </div>
  )
}
