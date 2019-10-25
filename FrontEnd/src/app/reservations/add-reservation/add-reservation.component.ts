import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ReservationsService } from '../reservations.service';
import { Resource } from 'src/app/resources/Resource';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {

  name = '';
  email = '';
  comments = '';
  resources: Resource[];
  resource_id: number;
  today = this.calendar.getToday();
  start_date: NgbDateStruct;
  end_date: NgbDateStruct;
  constructor(private activeModal: NgbActiveModal,
              private reservationService: ReservationsService,
              private toastrService: ToastrService,
              private calendar: NgbCalendar) { }
  cancel() {
    this.activeModal.dismiss();
  }
  add() {
    const startDate = new Date(this.start_date.year, this.start_date.month - 1, this.start_date.day);
    const endDate = new Date(this.end_date.year, this.end_date.month - 1, this.end_date.day);


    if (endDate < startDate) {
      this.toastrService.warning('End date can not be set before start date');
      return;
    } else {
      const data = {
        reservation_id: 0,
        resource_id: this.resource_id,
        reservation_name: this.name,
        start_date: startDate,
        end_date: endDate,
        owner_email:  this.email,
        comments:  this.comments
      };
      this.reservationService.addReservation(data).then(res => {
        if (res.status === 200) {
          this.activeModal.close(true);
        } else {
          this.activeModal.close(false);
        }
      }
      ).catch(res => {
        if (res.status === 200) {
          this.activeModal.close(true);
        } else {
          this.activeModal.close(false);
        }
      });
    }
}
  selectTodayStart() {
    this.start_date = this.calendar.getToday();
  }
  ngOnInit() {
    this.resource_id = this.resources[0].resource_id;
    this.start_date = this.calendar.getToday();
    this.end_date = this.calendar.getToday();
  }
}
