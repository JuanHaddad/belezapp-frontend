import { Component, OnInit } from '@angular/core';
import { ServicoService, Servico } from '../../../core/services/servico.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicos-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './servicos-list.component.html',
  styleUrls: ['./servicos-list.component.scss']
})
export class ServicosListComponent implements OnInit {

  filtro: string = '';
  exibindoFormulario: boolean = false;

  servicos: Servico[] = [];
  servicosFiltrados: Servico[] = [];

  novoServico = {
    descricao: '',
    duracaoPadrao: null,
    observacoes: ''
  };


  constructor(private servicoService: ServicoService) { }

  ngOnInit(): void {
    this.servicoService.listarServicos().subscribe({
      next: (data: Servico[]) => {
        this.servicos = data;
        this.aplicarFiltro();
      },
      error: (err: any) => {
        console.error('Erro ao buscar serviços', err);
      }
    });
  }

  aplicarFiltro(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.servicosFiltrados = this.servicos.filter(servico =>
      servico.descricao.toLowerCase().includes(filtroLower)
    );
  }

  excluirServico(id: number): void {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      this.servicoService.excluirServico(id).subscribe({
        next: () => {
          console.log(`Serviço com id ${id} excluído com sucesso.`);
          this.servicoService.listarServicos().subscribe({
            next: (data: Servico[]) => {
              this.servicos = data;
              this.aplicarFiltro();
            },
            error: (err: any) => {
              console.error('Erro ao atualizar lista de serviços', err);
            }
          });
        },
        error: (err: any) => {
          console.error('Erro ao excluir serviço', err);
        }
      });
    }
  }

  salvarServico(): void {
    this.servicoService.criarServico(this.novoServico).subscribe({
      next: (servicoSalvo: Servico) => {
        console.log('Serviço criado:', servicoSalvo);
        this.exibindoFormulario = false;
        this.servicoService.listarServicos().subscribe({
          next: (data: Servico[]) => {
            this.servicos = data;
            this.aplicarFiltro();
            this.novoServico = {
              descricao: '',
              duracaoPadrao: null,
              observacoes: ''
            };

          },
          error: (err: any) => {
            console.error('Erro ao atualizar lista de serviços', err);
          }
        });
      },
      error: (err: any) => {
        console.error('Erro ao criar serviço', err);
      }
    });
  }

}
