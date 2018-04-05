import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { AppComponent } from './app.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { TestComponent } from './test/test.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
        NavmenuComponent,
        MonitoringComponent,
        ConfigurationComponent,
        TestComponent,
        HeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
          { path: '', redirectTo: 'home', pathMatch: 'full' },
         { path: 'configuration', component: ConfigurationComponent },
          { path: 'monitoring', component: MonitoringComponent },
          { path: 'test', component: TestComponent },
          { path: '**', redirectTo: 'home' }
      ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
