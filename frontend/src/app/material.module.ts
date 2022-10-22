import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

const matModules: any[] = [
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatCardModule,
];

@NgModule({
  imports: matModules,
  exports: matModules,
})
export class MaterialModule {}
