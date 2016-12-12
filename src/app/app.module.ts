import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-ng2/main';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from './auth/auth.module';

import { AuthService } from './auth/shared/auth.service';
import { DataService } from './data/shared/data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AgGridModule.withComponents([]),
    AuthModule
  ],
  providers: [AuthService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
