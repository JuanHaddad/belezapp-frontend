import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { Atendimento, AtendimentoService } from '../../core/services/atendimento.service';
import { Servico, ServicoService } from '../../core/services/servico.service';
import { Cliente, ClienteService } from '../../core/services/cliente.service';
import { AtendimentoRequest } from '../../core/services/atendimento.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locale: 'pt-br',
    dateClick: this.onDateClick.bind(this),
    events: []
  };
  clientes: Cliente[] = [];
  servicos: Servico[] = [];

  exibindoFormulario: boolean = false;

  novoAtendimento: AtendimentoRequest = {
    cliente: { id: 0 },
    servicos: [],
    dataHoraInicio: '',
    precoCobrado: 0,
    corUsada: null,
    observacoes: null
  };

  horaSelecionada: string = '12:00';



  @ViewChild('detalhesDia') detalhesDia!: ElementRef<HTMLDivElement>;

  atendimentos: Atendimento[] = [];
  atendimentosDoDia: Atendimento[] = [];
  dataSelecionada: string | null = null;

  constructor(
    private atendimentoService: AtendimentoService,
    private clienteService: ClienteService,
    private servicoService: ServicoService
  ) { }

  ngOnInit(): void {
    this.atendimentoService.listarAtendimentos().subscribe({
      next: (data: Atendimento[]) => {
        this.atendimentos = data;
        this.calendarOptions.events = this.atendimentos.map(atendimento => ({
          title: atendimento.cliente.nome,
          date: atendimento.dataHoraInicio.split('T')[0]
        }));
      },
      error: (err: any) => {
        console.error('Erro ao buscar atendimentos', err);
      }
    });

    this.clienteService.listarClientes().subscribe({
      next: (clientes: Cliente[]) => {
        this.clientes = clientes;
      },
      error: (err: any) => {
        console.error('Erro ao buscar clientes', err);
      }
    });

    this.servicoService.listarServicos().subscribe({
      next: (servicos: Servico[]) => {
        this.servicos = servicos;
      },
      error: (err: any) => {
        console.error('Erro ao buscar serviços', err);
      }
    });
  }


  onDateClick(arg: DateClickArg): void {
    this.dataSelecionada = arg.dateStr;
    this.atendimentosDoDia = this.atendimentos.filter(atendimento =>
      atendimento.dataHoraInicio.startsWith(this.dataSelecionada!)
    );

    // scroll suave para baixo
    setTimeout(() => {
      if (this.detalhesDia) {
        this.detalhesDia.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  getDescricaoServicos(atendimento: Atendimento): string {
    return atendimento.servicos.map(servico => servico.descricao).join(', ');
  }

  novoAtendimentoParaDia(): void {
    this.exibindoFormulario = true;
    this.horaSelecionada = '12:00'; // <= ISSO aqui precisa estar presente
    this.novoAtendimento = {
      cliente: { id: 0 },
      servicos: [],
      dataHoraInicio: `${this.dataSelecionada}T12:00:00`,
      precoCobrado: 0,
      corUsada: null,
      observacoes: null
    };


    setTimeout(() => {
      if (this.detalhesDia) {
        this.detalhesDia.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  salvarAtendimento(): void {
    if (this.novoAtendimento.cliente.id === 0 || this.novoAtendimento.servicos.length === 0) {
      alert('Selecione um cliente e pelo menos um serviço.');
      return;
    }

    this.atendimentoService.criarAtendimento(this.novoAtendimento).subscribe({
      next: (atendimentoCriado: Atendimento) => {
        console.log('Atendimento criado:', atendimentoCriado);

        // Atualiza a lista de atendimentos
        this.atendimentoService.listarAtendimentos().subscribe({
          next: (data: Atendimento[]) => {
            this.atendimentos = data;
            this.atendimentosDoDia = this.atendimentos.filter(atendimento =>
              atendimento.dataHoraInicio.startsWith(this.dataSelecionada!)
            );
            this.calendarOptions.events = this.atendimentos.map(atendimento => ({
              title: atendimento.cliente.nome,
              date: atendimento.dataHoraInicio.split('T')[0]
            }));

            this.exibindoFormulario = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Erro ao criar atendimento', err);
      }
    });
  }

  ajustarHora(hora: string): void {
    this.horaSelecionada = hora;
    if (this.dataSelecionada) {
      this.novoAtendimento.dataHoraInicio = `${this.dataSelecionada}T${hora}:00`;
    }
  }



}
