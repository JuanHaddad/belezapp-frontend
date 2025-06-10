import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from './cliente.service';
import { Servico } from './servico.service';
import { environment } from '../../../environments/environment';

export interface Atendimento {
  id: number;
  cliente: Cliente;
  servicos: Servico[];
  dataHoraInicio: string; // ISO string → ex: "2025-06-09T14:30:00"
  precoCobrado: number;
  corUsada: string | null;
  observacoes: string | null;
}

export interface AtendimentoRequest {
  cliente: { id: number };
  servicos: { id: number }[];
  dataHoraInicio: string;
  precoCobrado: number;
  corUsada: string | null;
  observacoes: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  private apiUrl = `${environment.apiUrl}/atendimentos`;

  constructor(private http: HttpClient) { }

  listarAtendimentos(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(this.apiUrl);
  }

  listarAtendimentosPorCliente(clienteId: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  criarAtendimento(atendimento: AtendimentoRequest): Observable<Atendimento> {
  return this.http.post<Atendimento>(this.apiUrl, atendimento);
}


  excluirAtendimento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
