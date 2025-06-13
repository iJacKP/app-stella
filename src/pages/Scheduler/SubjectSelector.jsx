import { useEffect, useState } from 'react';
import { getSubjectsBySemester } from '../../../services/calendar';
import { Button, Card, Form } from 'react-bootstrap';

export default function SubjectSelector({ onSelect, onOpenDetails, selectedSubjects }) {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('');

  useEffect(() => {
    getSubjectsBySemester(5).then(setSubjects); //dinamizar depois
  }, []);

  const tracks = [...new Set(subjects.map(s => s.track))];

const filteredSubjects = subjects.filter(subject => {
  const matchesText = subject.name.toLowerCase().includes(search.toLowerCase())
    || subject.track.toLowerCase().includes(search.toLowerCase())
    || subject.teacher.toLowerCase().includes(search.toLowerCase());

  const matchesTrack = trackFilter === '' || subject.track === trackFilter;

  return matchesText && matchesTrack;
});

  return (
    <div>
      <h4 className="mb-3">Disciplinas disponíveis</h4>
      
      <Form.Select
        className="mb-3"
        value={trackFilter}
        onChange={(e) => setTrackFilter(e.target.value)}
      >
        <option value="">Todas as Trilhas</option>
          {tracks.map(track => (
            <option key={track} value={track}>{track}</option>
          ))}
      </Form.Select>

      <Form.Control
        type="text"
        placeholder="Pesquisar disciplina, trilha ou professor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
        {filteredSubjects.map(subject => (
          <Card key={subject._id} className="mb-3 shadow-sm">
            <Card.Body>
              <Form.Check
                type="checkbox"
                label={
                  <div>
                    <strong>{subject.name}</strong>
                    <br />
                    <small>Trilha: {subject.track}</small><br />
                    <small>Professor: {subject.teacher}</small><br />
                    <small>
                      {subject.schedule.map(s =>
                        `${s.day} (${s.startTime} - ${s.endTime})`
                      ).join(', ')}
                    </small>
                  </div>
                }
                checked={selectedSubjects.some(s => s._id === subject._id)}
                onChange={(e) => onSelect(subject, e.target.checked)}
              />
              <Button
                variant="link"
                size="sm"
                onClick={() => onOpenDetails(subject)}
              >
                + Mais informações
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}