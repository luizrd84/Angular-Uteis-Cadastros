import { Routes } from '@angular/router';


export const routes: Routes = [
    // Rotas públicas
    {   
        path: "", 
        loadComponent: () => import('./features/home/home')
            .then(m=>m.Home)
    },
    {   
        path: "contato", 
        loadComponent: () => import('./features/contact/contact')
            .then(m=>m.Contact)
    },

];
