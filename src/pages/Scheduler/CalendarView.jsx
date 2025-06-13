import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import ptBr from '@fullcalendar/core/locales/pt-br';

export default function CalendarView({ selectedSubjects }) {
  const events = [];

  selectedSubjects.forEach(subject => {
    subject.schedule.forEach(entry => {
      const dayNum = convertDayToRRule(entry.day);
      events.push({
        title: subject.name,
        rrule: {
          freq: 'weekly',
          byweekday: [dayNum],
          dtstart: `${subject.startDate}T${entry.startTime}`,
          until: `${subject.endDate}T23:59:59`,
        },
        duration: getDuration(entry.startTime, entry.endTime)
      });
    });
  });

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
        initialView="timeGridWeek"
        locale={ptBr}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        events={events}
      />
    </div>
  );
}

function convertDayToRRule(day) {
  const map = {
    "Domingo": 'SU',
    "Segunda-feira": 'MO',
    "Terça-feira": 'TU',
    "Quarta-feira": 'WE',
    "Quinta-feira": 'TH',
    "Sexta-feira": 'FR',
    "Sábado": 'SA'
  };
  return map[day];
}

function getDuration(start, end) {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  const durationMin = (h2 * 60 + m2) - (h1 * 60 + m1);
  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;
  return `PT${hours}H${minutes > 0 ? minutes + 'M' : ''}`;
}