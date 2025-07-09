import { Container, Row, Card, Button, Modal } from "react-bootstrap";
import Sidebar from "../../components/SideBar";
import api from "../../../services/api";
import { useState, useEffect } from "react";
import "./Trail.css"; // Novo CSS para os cards

export default function Trail({ track, title, description, objective }) {
  const [subjects, setSubjects] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    // Busca disciplinas da trilha
    api.get("/subject")
      .then((response) => {
        const filteredSubjects = response.data.filter(
          (subject) => subject.track === track
        );

        // Remove disciplinas duplicadas pelo _id
        const uniqueSubjects = Array.from(
          new Map(filteredSubjects.map((s) => [s._id, s])).values()
        );

        setSubjects(uniqueSubjects);
      })
      .catch((error) => {
        console.error("Erro ao buscar disciplinas:", error);
      });
  }, [track]);

  const handleShowModal = (subject) => {
    setSelectedSubject(subject);
    setShow(true);
  };

  const handleCloseModal = () => setShow(false);

  // Professores únicos
  const uniqueProfessors = [...new Set(subjects.map((s) => s.teacher))];

  const body = (
    <Container fluid>
      <Row className="mt-4">
        <p>{description}</p>

        <h3 className="mt-4">Objetivo da trilha</h3>
        <p>{objective}</p>

        <h3 className="mt-4">Professores</h3>
        <div className="mb-3">
          {uniqueProfessors.map((prof, idx) => (
            <span key={idx} className="professor-pill">
              {prof}
            </span>
          ))}
        </div>

        <h3 className="mt-4">Disciplinas núcleo da trilha</h3>
        <p>
          Estas disciplinas devem ter oferta regular para permitir a manutenção mínima da trilha. Elas são as mais alinhadas com os objetivos da trilha.
        </p>

        <div className="subject-cards">
          {subjects.map((subject, index) => (
            <Card
              key={subject._id}
              className={`subject-card color-${index % 5}`}
              onClick={() => handleShowModal(subject)}
            >
              <Card.Body>
                <Card.Title>{subject.subjectCode} - {subject.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {subject.teacher}
                </Card.Subtitle>
                <Card.Text>
                  {subject.description.substring(0, 80)}...
                </Card.Text>
                <Button variant="light" size="sm">+ Mais informações</Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Modal com detalhes */}
        <Modal show={show} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedSubject?.subjectCode} - {selectedSubject?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSubject && (
              <>
                <p><strong>Trilha:</strong> {selectedSubject.track}</p>
                <p><strong>Professor:</strong> {selectedSubject.teacher}</p>
                <p><strong>Carga Horária:</strong> {selectedSubject.workload}</p>
                <p><strong>Créditos:</strong> {selectedSubject.credits}</p>
                <p><strong>Descrição:</strong> {selectedSubject.description}</p>
                <p><strong>Horários:</strong></p>
                <ul>
                  {selectedSubject.schedule.map((s, index) => (
                    <li key={index}>
                      {s.day}: {s.startTime} - {s.endTime}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Modal.Body>
        </Modal>
      </Row>
    </Container>
  );

  return <Sidebar sidebarTitle={title} content={body} />;
}