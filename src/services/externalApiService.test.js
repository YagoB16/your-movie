import { jest } from '@jest/globals';
import axios from 'axios';
import { getMovieById } from './externalApiService.js';

describe('External API Service', () => {

  // Limpa todos os espiões após cada teste
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve retornar dados formatados quando o ID for válido', async () => {
    const mockData = {
      data: {
        Title: 'Batman',
        Response: 'True',
        imdbID: 'tt0372784'
      }
    };

    // Um espião no método 'get' do axios e definimos o retorno
    const spy = jest.spyOn(axios, 'get').mockResolvedValue(mockData);

    const result = await getMovieById('tt0372784');

    expect(result.Title).toBe('Batman');
    expect(spy).toHaveBeenCalledTimes(1);

    // Verifica se a URL chamada contém o ID e a API_KEY (mesmo que seja undefined no teste)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('tt0372784'));
  });

  it('deve lançar um erro quando a OMDb retornar Response False', async () => {
    const mockError = {
      data: { Response: 'False', Error: 'Movie not found!' }
    };

    jest.spyOn(axios, 'get').mockResolvedValue(mockError);

    await expect(getMovieById('id_invalido')).rejects.toThrow('Movie not found!');
  });
});
