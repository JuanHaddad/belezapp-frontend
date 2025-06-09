import { Routes } from '@angular/router';
import { ClientesListComponent } from './features/clientes/clientes-list/clientes-list.component';
import { ServicosListComponent } from './features/servicos/servicos-list/servicos-list.component';
import { AtendimentosListComponent } from './features/atendimentos/atendimentos-list/atendimentos-list.component';
import { HistoricoClienteComponent } from './features/clientes/historico-cliente/historico-cliente.component';
import { AgendaComponent } from './features/agenda';

export const routes: Routes = [
    { path: 'clientes', component: ClientesListComponent },
    { path: 'servicos', component: ServicosListComponent },
    { path: 'atendimentos', component: AtendimentosListComponent },
    { path: 'agenda', component: AgendaComponent },
    { path: '', redirectTo: 'clientes', pathMatch: 'full' },
    { path: 'clientes/:id/historico', component: HistoricoClienteComponent },
    // se quiser que o default seja clientes
    { path: '**', redirectTo: 'clientes' } // fallback (rota não encontrada)
];
