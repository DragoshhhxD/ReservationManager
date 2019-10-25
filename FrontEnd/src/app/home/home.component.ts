import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations/reservations.service';
import { ResourcesService } from '../resources/resources.service';
import { Reservation } from '../reservations/Reservation';
import { Resource } from '../resources/Resource';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddResourceComponent } from '../resources/add-resource/add-resource.component';
import { ToastrService } from 'ngx-toastr';
import { EditResourceComponent } from '../resources/edit-resource/edit-resource.component';
import { AddReservationComponent } from '../reservations/add-reservation/add-reservation.component';
import { EditReservationComponent } from '../reservations/edit-reservation/edit-reservation.component';
import { ReservationCheckerComponent } from './reservation-checker/reservation-checker.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private reservationService: ReservationsService,
              private resourceService: ResourcesService,
              private toastrService: ToastrService,
              private modalService: NgbModal) {
  if (this.resourceSubscription == null) {
    this.resourceSubscription = this.resourceService.resources$.subscribe(resources => {
      this.resources = resources;
    });
  }
  if (this.reservationSubscription == null) {
    this.reservationSubscription = this.reservationService.reservations$.subscribe(reservations => {
      this.reservations = reservations;
    });
  }
}
  reservations: Reservation[];
  resources: Resource[];
  resourceSubscription: any;
  reservationSubscription: any;
  activeButton: boolean;
  ngOnInit() {

    this.resourceService.fetchData();
    this.reservationService.fetchData();
    this.activeButton = true;
  }

  // RESOURCES
  openResourceEdit(resource: Resource) {
    this.activeButton = false;
    const modal = this.modalService.open(EditResourceComponent, {centered: true, windowClass: 'my-modal', size: 'sm'});
    modal.componentInstance.resource = resource;
    modal.result.then(
      async res => { // When user closes
                     this.activeButton = true;
                     if (res) {
                        this.toastrService.success('Resource successfully edited');
                        this.resourceService.fetchData();
                      } else {
                        this.toastrService.error
                        ('Resource could not be edited!! Maybe there is already another resource with the same name');
                        this.resourceService.fetchData();
                    }
                  },
            () => { // Backdrop click
                    this.activeButton = true;
                    });
   }
  deleteToast(res: any, del: string) {
    if (res.status === 200) {
      this.toastrService.success('', 'This ' + del + ' was deleted!!');
    } else {
      this.toastrService.error('',
      'This ' + del + ' could not be deleted! Check to see if it\'s part of an already existing reservation ');
    }
  }
  deleteResource(resource: Resource) {
    if (confirm('Are you sure you want to delete this resource?')) {
      this.activeButton = false;
      this.resourceService.deleteResource(resource.resource_id).then(
        res => {
          this.resourceService.fetchData();
          this.deleteToast(res, 'Resource');
          this.activeButton = true;
        })
      .catch(
        fail => {
          this.resourceService.fetchData();
          this.deleteToast(fail, 'Resource');
          this.activeButton = true;
      });
   }
 }
  openResourceAdd() {
    this.activeButton = false;
    const modal = this.modalService.open(AddResourceComponent, {centered: true, windowClass: 'my-modal', size: 'sm'});
    modal.result.then(
      async res => { // 'When user closes'
                     this.activeButton = true;
                     if (res) {
                        this.toastrService.success('Resource successfully added');
                        this.resourceService.fetchData();
                      } else {
                        this.toastrService.error
                        ('Resource could not be added!! Maybe there is already another resource with the same name');
                        this.resourceService.fetchData();
                    }
                  },
            () => { // Backdrop click
                    this.activeButton = true;
                    });
  }
  findResource(reservation: Reservation) {
    return this.resources.find(r => r.resource_id === reservation.resource_id).resource_name;
  }
  checkReservationIntervals() {
    this.activeButton = false;
    const modal = this.modalService.open(ReservationCheckerComponent, {centered: true, windowClass: 'my-modal'});
    modal.result.then(
      async res => { // When user closes
                     this.activeButton = true;
                     if (res) {
                        this.toastrService.success('Reservations can be made!!');
                      } else {
                        this.toastrService.error
                        ('Reservations can not be made!!');
                    }
                  },
            () => { // Backdrop click
                    this.activeButton = true;
                   });
  }

///////////////////////////////////////////////

// RESERVATIONS
openReservationEdit(reservation: Reservation) {
  this.activeButton = false;
  const modal = this.modalService.open(EditReservationComponent, {centered: true, windowClass: 'my-modal', size: 'sm'});
  modal.componentInstance.reservation = reservation;
  modal.componentInstance.resources = this.resources;
  modal.result.then(
    async res => { // When user closes
                   this.activeButton = true;
                   if (res) {
                      this.toastrService.success('Reservation successfully edited');
                      this.reservationService.fetchData();
                    } else {
                      this.toastrService.error
                      ('Reservation could not be edited!!');
                      this.reservationService.fetchData();
                  }
                },
          () => { // Backdrop click
                  this.activeButton = true;
                  });
}
formatDate(date: Date) {
  const newDate = new Date(date.toString());
  return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
}
deleteReservation(reservation: Reservation) {
  if (confirm('Are you sure you want to delete this reservation?')) {
    this.activeButton = false;
    this.reservationService.deleteReservation(reservation.reservation_id).then(
      res => {
        this.reservationService.fetchData();
        this.deleteToast(res, 'Reservation');
        this.activeButton = true;
      })
    .catch(
      fail => {
        this.reservationService.fetchData();
        this.deleteToast(fail, 'Reservation');
        this.activeButton = true;
    });
  }
}
openReservationAdd() {
  if (this.resources.length < 1) {
    this.toastrService.warning('There are no resources available!! Please add a resource first');
  } else {
    this.activeButton = false;
    const modal = this.modalService.open(AddReservationComponent, {centered: true, windowClass: 'my-modal', size: 'sm'});
    modal.componentInstance.resources = this.resources;
    modal.result.then(
    async res => {  // When user closes
                    this.activeButton = true;
                    if (res) {
                      this.toastrService.success('Reservation successfully added');
                      this.reservationService.fetchData();
                    } else {
                      this.toastrService.error
                      ('Resource could not be added!! Maybe there is already another reservation with the same name');
                      this.reservationService.fetchData();
                  }
                },
          () => { // Backdrop click
                  this.activeButton = true;
                  });
    }
  }
///////////////////////////////////////////////
}
