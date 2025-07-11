import { useEffect, useState } from 'react';
import { getAllSubjects } from '../../../services/calendar';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import './SubjectSelector.css';

export default function SubjectSelector({ onSelect, onOpenDetails, selectedSubjects }) {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllSubjects()
      .then((data) => {
        const uniqueSubjects = Array.from(
          new Map(data.map((subject) => [subject.subjectCode, subject])).values()
        );
        setSubjects(uniqueSubjects);
      })
      .finally(() => setLoading(false));
  }, []);

  const tracks = [...new Set(subjects.map(s => s.track))];

  const filteredSubjects = subjects.filter(subject => {
    const matchesText =
      subject.name.toLowerCase().includes(search.toLowerCase()) ||
      subject.track.toLowerCase().includes(search.toLowerCase()) ||
      subject.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      subject.teacher.toLowerCase().includes(search.toLowerCase());

    const matchesTrack = trackFilter === '' || subject.track === trackFilter;

    return matchesText && matchesTrack;
  });

  return (
    <div className="subject-selector">
      <h4 className="title mb-3">Disciplinas Disponíveis</h4>

      <Form.Select
        className="mb-3 filter-select"
        value={trackFilter}
        onChange={(e) => setTrackFilter(e.target.value)}
      >
        <option value="">Todos os filtros</option>
        {tracks.map(track => (
          <option key={track} value={track}>
            {track}
          </option>
        ))}
      </Form.Select>

      <Form.Control
        type="text"
        placeholder="Pesquisar disciplina, trilha ou professor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 search-input"
      />

      <div className="subject-list">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
            <div>Carregando disciplinas...</div>
          </div>
        ) : filteredSubjects.length > 0 ? (
          filteredSubjects.map(subject => (
          <Card key={subject._id} className="subject-card mb-3 shadow-sm">
            <Card.Body>
              <Form.Check
                type="checkbox"
                className="subject-checkbox"
                id={`subject-${subject._id}`} 
                checked={selectedSubjects.some(s => s._id === subject._id)}
                onChange={(e) => onSelect(subject, e.target.checked)}
                label={
                  <label
                    htmlFor={`subject-${subject._id}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{subject.subjectCode} - {subject.name}</strong><br />
                    <small>Trilha: {subject.track}</small><br />
                    <small>Professor: {subject.teacher}</small><br />
                    <small>
                      {subject.schedule.map(s =>
                        `${s.day} (${s.startTime} - ${s.endTime})`
                      ).join(', ')}
                    </small>
                  </label>
                }
              />
              <Button
                variant="link"
                size="sm"
                className="info-btn"
                onClick={() => onOpenDetails(subject)}
              >
                + Mais informações
              </Button>
            </Card.Body>
          </Card>
          ))
        ) : (
          <div className="text-muted text-center">Nenhuma disciplina encontrada.</div>
        )}
      </div>
    </div>
  );
}