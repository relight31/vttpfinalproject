import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

const matModules: any[] = [MatToolbarModule, MatSidenavModule, MatIconModule];

@NgModule({
  imports: matModules,
  exports: matModules,
})
export class MaterialModule {}
