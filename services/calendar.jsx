import api from './api'

export const getSubjectsBySemester = async (semester) => {
  try {
    const response = await api.get(`/semester/${semester}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);
    return [];
  }
}