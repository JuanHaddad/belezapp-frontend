import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servico {
  id: number;
  descricao: string;
  duracaoPadrao: number | null;
  observacoes: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  private apiUrl = 'https://belezapp.onrender.com/api/servicos';

  constructor(private http: HttpClient) { }

  listarServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  criarServico(servico: Omit<Servico, 'id'>): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico);
  }

  excluirServico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
