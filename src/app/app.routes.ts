
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page-recherche/page-recherche')
        .then(m => m.PageRecherche)
  }
];
