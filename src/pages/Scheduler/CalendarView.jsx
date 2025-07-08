import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import ptBr from '@fullcalendar/core/locales/pt-br';
import './CalendarView.css';

export default function CalendarView({ selectedSubjects }) {
  const events = [];

  selectedSubjects.forEach(subject => {
    subject.schedule.forEach(entry => {
      console.log(subject, "pois toma carai")
      const dayNum = convertDayToRRule(entry.day);
      events.push({
        title: `${entry.startTime} - ${entry.endTime}\n${subject.name}`, // mostra horário e nome
        rrule: {
          freq: 'weekly',
          byweekday: [dayNum],
          dtstart: `${subject.startDate}T${entry.startTime}:00`,
          until: `${subject.endDate}T23:59:59`,
        },
        duration: getDuration(`${entry.startTime}:00`, `${entry.endTime}:00`),
      });
    });
  });

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin, rrulePlugin]}
        initialView="timeGridWeek"
        locale={ptBr}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        height="auto"
        events={events}
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'prev,next today',
        }}
        buttonText={{
          today: 'Hoje'
        }}
        eventContent={renderEventContent}
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

  return `${hours}:${minutes > 0 ? minutes : '00'}`;

}

function renderEventContent(arg) {
  const [timeRange, name] = arg.event.title.split('\n');
  return (
    <div style={{ textAlign: 'left', fontSize: '0.65rem', fontWeight: 400 }}>
      <div style={{ textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, marginBottom:5 }}>{timeRange}</div>
      <div>{name}</div>
    </div>
  );
}