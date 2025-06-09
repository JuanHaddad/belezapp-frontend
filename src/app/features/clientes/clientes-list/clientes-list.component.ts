import { Component, OnInit } from '@angular/core';
import { ClienteService, Cliente } from '../../../core/services/cliente.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit {

  filtro: string = '';
  exibindoFormulario: boolean = false;

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  novoCliente: Cliente = {
    id: undefined as unknown as number,
    nome: '',
    telefone: null,
    aniversario: null,
    observacoes: null
  };


  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
        this.aplicarFiltro();
      },
      error: (err: any) => {
        console.error('Erro ao buscar clientes', err);
      }
    });
  }
  aplicarFiltro(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(filtroLower)
    );
  }


  excluirCliente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.excluirCliente(id).subscribe({
        next: () => {
          console.log(`Cliente com id ${id} excluído com sucesso.`);
          // Após excluir, atualiza a lista de clientes
          this.clienteService.listarClientes().subscribe({
            next: (data: Cliente[]) => {
              this.clientes = data;
              this.aplicarFiltro(); // 👈 aqui garante que atualiza a tela!
            },
            error: (err: any) => {
              console.error('Erro ao atualizar lista de clientes', err);
            }
          });
        },
        error: (err: any) => {
          console.error('Erro ao excluir cliente', err);
        }
      });
    }
  }

  salvarCliente(): void {
    const clienteParaSalvar = {
      ...this.novoCliente,
      aniversario: this.novoCliente.aniversario
        ? new Date(this.novoCliente.aniversario).toISOString().split('T')[0]
        : null
    };

    this.clienteService.criarCliente(clienteParaSalvar).subscribe({
      next: (clienteSalvo: Cliente) => {
        console.log('Cliente criado:', clienteSalvo);
        this.exibindoFormulario = false;
        this.clienteService.listarClientes().subscribe({
          next: (data: Cliente[]) => {
            this.clientes = data;
            this.aplicarFiltro();
            this.novoCliente = {
              id: undefined as unknown as number,
              nome: '',
              telefone: '',
              aniversario: '',
              observacoes: ''
            };
          },
          error: (err: any) => {
            console.error('Erro ao atualizar lista de clientes', err);
          }
        });
      },
      error: (err: any) => {
        console.error('Erro ao criar cliente', err);
      }
    });
  }



}
