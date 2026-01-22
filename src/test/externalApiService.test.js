import { jest } from '@jest/globals';

// 1. Mock do Axios (obrigatório para não fazer requisições reais)
jest.unstable_mockModule('axios', () => ({
  default: {
    get: jest.fn()
  }
}));

const axios = (await import('axios')).default;
const { getMovieById, searchMovie, fetchExternalMovieData } = await import('../services/externalApiService.js');

describe('External API Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Testes para getMovieById ---
  it('getMovieById deve retornar dados quando o ID for válido', async () => {
    axios.get.mockResolvedValue({ data: { Title: 'Batman', Response: 'True' } });
    const result = await getMovieById('tt0372784');
    expect(result.Title).toBe('Batman');
  });

  it('getMovieById deve lançar erro quando a API retornar Response False', async () => {
    axios.get.mockResolvedValue({ data: { Response: 'False', Error: 'Movie not found!' } });
    await expect(getMovieById('id_invalido')).rejects.toThrow('Movie not found!');
  });

  // --- Testes para searchMovie ---
  it('searchMovie deve retornar lista de filmes na busca', async () => {
    axios.get.mockResolvedValue({ data: { Search: [{ Title: 'Inception' }], Response: 'True' } });
    const result = await searchMovie('Inception');
    expect(result.Search[0].Title).toBe('Inception');
  });

  // --- Testes para fetchExternalMovieData ---
  it('fetchExternalMovieData deve formatar corretamente os dados para o nosso sistema', async () => {
    axios.get.mockResolvedValue({
      data: {
        Response: 'True',
        Director: 'Nolan',
        Actors: 'Bale',
        Genre: 'Action',
        imdbRating: '8.8',
        Poster: 'link',
        Plot: 'Sinopse'
      }
    });

    const result = await fetchExternalMovieData('tt123');
    expect(result).toEqual({
      diretor: 'Nolan',
      atores: 'Bale',
      genero: 'Action',
      imdbRating: '8.8',
      poster: 'link',
      sinopse: 'Sinopse'
    });
  });

  it('fetchExternalMovieData deve retornar null e logar erro em caso de falha', async () => {
    // Silencia o console.error apenas neste teste para o log ficar limpo
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('API Offline'));

    const result = await fetchExternalMovieData('tt123');

    expect(result).toBeNull();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
