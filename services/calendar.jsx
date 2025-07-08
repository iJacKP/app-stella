import api from './api'

export const getAllSubjects = async () => {
  try {
    const response = await api.get('/subject');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);
    return [];
  }
};