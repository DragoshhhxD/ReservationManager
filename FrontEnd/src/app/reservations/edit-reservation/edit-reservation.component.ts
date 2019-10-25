import { Component, OnInit } from '@angular/core';
import { Resource } from 'src/app/resources/Resource';
import { NgbDateStruct, NgbActiveModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ReservationsService } from '../reservations.service';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from '../Reservation';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.css']
})
export class EditReservationComponent implements OnInit {

  name = '';
  email = '';
  comments = '';
  resources: Resource[];
  reservation: Reservation;
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
        reservation_id: this.reservation.reservation_id,
        resource_id: this.resource_id,
        reservation_name: this.name,
        start_date: startDate,
        end_date: endDate,
        owner_email:  this.email,
        comments:  this.comments
      };
      this.reservationService.editReservation(data).then(res => {
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
  convertToNgbDateStruct(date: string) {
    const newDate = new Date(date);
    const newNgbDate = new NgbDate(newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate());
    return newNgbDate;
  }
  ngOnInit() {
    this.resource_id = this.reservation.resource_id;
    this.name = this.reservation.reservation_name;
    this.email = this.reservation.owner_email;
    this.comments = this.reservation.comments;
    this.start_date = this.convertToNgbDateStruct(this.reservation.start_date.toString());
    this.end_date = this.convertToNgbDateStruct(this.reservation.end_date.toString());
  }
}
