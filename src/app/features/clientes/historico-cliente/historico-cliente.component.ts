import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtendimentoService, Atendimento } from '../../../core/services/atendimento.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-historico-cliente',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
        RouterModule
    ],
    templateUrl: './historico-cliente.component.html',
    styleUrls: ['./historico-cliente.component.scss']
})
export class HistoricoClienteComponent implements OnInit {

    clienteId!: number;
    atendimentos: Atendimento[] = [];

    constructor(
        private route: ActivatedRoute,
        private atendimentoService: AtendimentoService
    ) { }

    ngOnInit(): void {
        this.clienteId = Number(this.route.snapshot.paramMap.get('id'));

        this.atendimentoService.listarAtendimentosPorCliente(this.clienteId).subscribe({
            next: (data: Atendimento[]) => {
                this.atendimentos = data;
            },
            error: (err: any) => {
                console.error('Erro ao buscar histórico do cliente', err);
            }
        });
    }

    formatarServicos(atendimento: Atendimento): string {
        return atendimento.servicos.map(servico => servico.descricao).join(', ');
    }


}
