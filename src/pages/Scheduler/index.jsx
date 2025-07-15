import { useState } from 'react';
import { Modal, Toast, ToastContainer, Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from '../../components/SideBar';
import SubjectSelector from './SubjectSelector';
import CalendarView from './CalendarView';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaFilePdf, FaCalendarAlt } from 'react-icons/fa';
import './index.css';

export function Scheduler() {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalSubject, setModalSubject] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const openModal = (subject) => {
    setModalSubject(subject);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSelect = (subject, checked) => {
    if (checked) {
      const conflict = selectedSubjects.find(existing =>
        existing.schedule.some(existingSlot =>
          subject.schedule.some(newSlot =>
            existingSlot.day === newSlot.day &&
            overlaps(existingSlot.startTime, existingSlot.endTime, newSlot.startTime, newSlot.endTime)
          )
        )
      );

      if (conflict) {
        setToastMessage(`Conflito detectado entre "${subject.subjectCode} -${subject.name}" e "${conflict.subjectCode} ${conflict.name}".`);
        setToastTitle('Conflito de Horário');
        setShowToast(true);
        return;
      }

      setSelectedSubjects(prev => [...prev, subject]);
    } else {
      setSelectedSubjects(prev => prev.filter(s => s._id !== subject._id));
    }
  };

  function overlaps(start1, end1, start2, end2) {
    return (start1 < end2) && (start2 < end1);
  }

  const handleExportPDF = () => {

    setToastMessage(`Sua grade horária semanal está sendo baixada em formato .PDF e estará disponível em breve!.`);
    setToastTitle('Download Iniciado!');
    setShowToast(true);

    const calendar = document.querySelector('.fc');

    html2canvas(calendar, {
      scale: 2,
      useCORS: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = {
        width: canvas.width,
        height: canvas.height
      };

      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;

      const marginX = (pageWidth - imgWidth) / 2;
      const marginY = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', marginX, marginY, imgWidth, imgHeight);
      pdf.save('grade_horaria.pdf');
    });
  };

  const handleExportICS = () => {

    setToastMessage(`Seu calendário está sendo baixado em formato .ICS e em breve estará disponível para ser importado no seu calendário digital favorito!`);
    setToastTitle('Download Iniciado!');
    setShowToast(true);

    const convertDayToRRule = {
      "Domingo": 'SU',
      "Segunda-feira": 'MO',
      "Terça-feira": 'TU',
      "Quarta-feira": 'WE',
      "Quinta-feira": 'TH',
      "Sexta-feira": 'FR',
      "Sábado": 'SA'
    };

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    selectedSubjects.forEach(subject => {
      subject.schedule.forEach(entry => {
        const uid = `${subject._id}-${entry.day}`;
        const dayRRule = convertDayToRRule[entry.day];
        const dtstart = `${subject.startDate.replace(/-/g, '')}T${entry.startTime.replace(':', '')}00`;
        const dtend = `${subject.startDate.replace(/-/g, '')}T${entry.endTime.replace(':', '')}00`;
        const until = `${subject.endDate.replace(/-/g, '')}T235900Z`;

        icsLines.push(
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `SUMMARY:${subject.name}`,
          `DTSTART;TZID=America/Fortaleza:${dtstart}`,
          `DTEND;TZID=America/Fortaleza:${dtend}`,
          `RRULE:FREQ=WEEKLY;BYDAY=${dayRRule};UNTIL=${until}`,
          `DESCRIPTION:${subject.description} – ${subject.credits} créditos (${subject.workload})`,
          `CATEGORIES:${subject.track}`,
          'END:VEVENT'
        );
      });
    });

    icsLines.push('END:VCALENDAR');

    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'grade_horaria.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const body = (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalSubject?.subjectCode} - {modalSubject?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Trilha:</strong> {modalSubject?.track}</p>
          <p><strong>Professor:</strong> {modalSubject?.teacher}</p>
          <p><strong>Carga Horária:</strong> {modalSubject?.workload}</p>
          <p><strong>Créditos:</strong> {modalSubject?.credits}</p>
          <p><strong>Descrição:</strong> {modalSubject?.description}</p>
          <p><strong>Horários:</strong><br />
            {modalSubject?.schedule.map((s, i) => (
              <div key={i}>
                {s.day} – {s.startTime} às {s.endTime}
              </div>
            ))}
          </p>
        </Modal.Body>
      </Modal>

      <Row style={{ flex: 1, overflow: 'hidden'}}>
        <Col md={4} className="d-flex flex-column" style={{ height: '100%'}}>
          <SubjectSelector
            onSelect={handleSelect}
            onOpenDetails={openModal}
            selectedSubjects={selectedSubjects}
          />
        </Col>
        <Col md={8} className="d-flex flex-column" style={{ height: '100%'}}>
          <CalendarView selectedSubjects={selectedSubjects} />
          <div className="export-buttons mt-3 d-flex gap-3">
            <Button
              className="export-btn pdf-btn btn-purple w-100"
              style={{ fontWeight: 'bold', fontSize: '1.1rem', height: '48px' }}
              onClick={handleExportPDF}
            >
              <FaFilePdf className="me-2" /> Exportar como PDF
            </Button>
            <Button
              className="export-btn ics-btn btn-purple w-100"
              style={{ fontWeight: 'bold', fontSize: '1.1rem', height: '48px' }}
              onClick={handleExportICS}
            >
              <FaCalendarAlt className="me-2" /> Exportar como .ICS
            </Button>
          </div>
        </Col>
      </Row>

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast className="toast-purple" show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide>
        <Toast.Header closeButton style={{ backgroundColor: '#5e4b8b', color: '#fff' }}>
          <strong className="me-auto">{toastTitle}</strong>
        </Toast.Header>
        <Toast.Body style={{ backgroundColor: '#7c3aed', color: '#fff' }}>
          {toastMessage}
        </Toast.Body>
      </Toast>
      </ToastContainer>
    </div>
  );

  return (
    <Sidebar 
      sidebarTitle="FERRAMENTA DE GRADE"
      content={body}
    />
  );
}