import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AddReservationComponent } from './reservations/add-reservation/add-reservation.component';
import { AddResourceComponent } from './resources/add-resource/add-resource.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditResourceComponent } from './resources/edit-resource/edit-resource.component';
import { EditReservationComponent } from './reservations/edit-reservation/edit-reservation.component';
import { ReservationCheckerComponent } from './home/reservation-checker/reservation-checker.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddReservationComponent,
    AddResourceComponent,
    EditResourceComponent,
    EditReservationComponent,
    ReservationCheckerComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [
    AddReservationComponent,
    EditResourceComponent,
    EditReservationComponent,
    ReservationCheckerComponent,
    AddResourceComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
