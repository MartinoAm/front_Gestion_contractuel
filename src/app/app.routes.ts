import { Routes } from '@angular/router';
import { EtablissementComponent } from './component/etablissement/etablissement.component';
import { AgentComponent } from './component/agent/agent.component';
import { ContratComponent } from './component/contrat/contrat.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'etablissement', pathMatch: 'full'
    },
    {
        path: 'etablissement', component: EtablissementComponent
    },
    {
        path: 'agent', component: AgentComponent
    },
    {
        path: 'contrat', component: ContratComponent
    },

]
