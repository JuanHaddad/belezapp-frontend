import { Component, OnInit } from '@angular/core';
import { AtendimentoService, Atendimento } from '../../../core/services/atendimento.service';
import { ClienteService, Cliente } from '../../../core/services/cliente.service';
import { ServicoService, Servico } from '../../../core/services/servico.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-atendimentos-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './atendimentos-list.component.html',
  styleUrls: ['./atendimentos-list.component.scss']
})
export class AtendimentosListComponent implements OnInit {

  filtro: string = '';
  exibindoFormulario: boolean = false;

  atendimentos: Atendimento[] = [];
  atendimentosFiltrados: Atendimento[] = [];

  clientes: Cliente[] = [];
  servicos: Servico[] = [];

  novoAtendimento = {
    cliente: null as unknown as Cliente,
    servicos: [] as Servico[],
    dataHoraInicio: '',
    precoCobrado: 0,
    corUsada: '',
    observacoes: ''
  };

  constructor(
    private atendimentoService: AtendimentoService,
    private clienteService: ClienteService,
    private servicoService: ServicoService
  ) { }

  ngOnInit(): void {
    this.carregarAtendimentos();
    this.carregarClientes();
    this.carregarServicos();
  }

  carregarAtendimentos(): void {
    this.atendimentoService.listarAtendimentos().subscribe({
      next: (data: Atendimento[]) => {
        this.atendimentos = data;
        this.aplicarFiltro();
      },
      error: (err: any) => {
        console.error('Erro ao buscar atendimentos', err);
      }
    });
  }

  carregarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
      },
      error: (err: any) => {
        console.error('Erro ao buscar clientes', err);
      }
    });
  }

  carregarServicos(): void {
    this.servicoService.listarServicos().subscribe({
      next: (data: Servico[]) => {
        this.servicos = data;
      },
      error: (err: any) => {
        console.error('Erro ao buscar serviços', err);
      }
    });
  }

  aplicarFiltro(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.atendimentosFiltrados = this.atendimentos.filter(atendimento =>
      atendimento.cliente.nome.toLowerCase().includes(filtroLower)
    );
  }

  excluirAtendimento(id: number): void {
    if (confirm('Tem certeza que deseja excluir este atendimento?')) {
      this.atendimentoService.excluirAtendimento(id).subscribe({
        next: () => {
          console.log(`Atendimento com id ${id} excluído com sucesso.`);
          this.carregarAtendimentos();
        },
        error: (err: any) => {
          console.error('Erro ao excluir atendimento', err);
        }
      });
    }
  }

  salvarAtendimento(): void {
    const atendimentoParaSalvar = {
      cliente: { id: this.novoAtendimento.cliente.id },
      servicos: this.novoAtendimento.servicos.map(s => ({ id: s.id })),
      dataHoraInicio: new Date(this.novoAtendimento.dataHoraInicio).toISOString(),
      precoCobrado: this.novoAtendimento.precoCobrado,
      corUsada: this.novoAtendimento.corUsada,
      observacoes: this.novoAtendimento.observacoes
    };

    this.atendimentoService.criarAtendimento(atendimentoParaSalvar).subscribe({
      next: (atendimentoSalvo: Atendimento) => {
        console.log('Atendimento criado:', atendimentoSalvo);
        this.exibindoFormulario = false;
        this.carregarAtendimentos();
        this.novoAtendimento = {
          cliente: null as unknown as Cliente,
          servicos: [],
          dataHoraInicio: '',
          precoCobrado: 0,
          corUsada: '',
          observacoes: ''
        };
      },
      error: (err: any) => {
        console.error('Erro ao criar atendimento', err);
      }
    });
  }

}
