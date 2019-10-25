import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservation-checker',
  templateUrl: './reservation-checker.component.html',
  providers: [NgbCarousel],
  styleUrls: ['./reservation-checker.component.css']
})
export class ReservationCheckerComponent implements OnInit {
  @ViewChild('myCarousel', {static: true}) myCarousel: NgbCarousel;

  constructor(private activeModal: NgbActiveModal,
              private toastrService: ToastrService) { }
  N: number;
  K: number;
  arrivals: number[];
  aux: number[];  // used for tx ngFor
  departures: number[];
  cancel() {
    this.activeModal.dismiss();
  }
  prevSlide() {
    this.myCarousel.prev();
  }
  nextSlide() {
    this.myCarousel.next();
  }
  next() {
    this.arrivals = Array(this.N).fill(0).map((x, i) => i + 1);
    this.aux = Array(this.N).fill(0).map((x, i) => i + 1);
    this.departures = Array(this.N).fill(0).map((x, i) => i + 1);
    this.myCarousel.next();
  }
  compare(a: number, b: number) {
    return a - b;
  }
  testValues() {  // verifies wethere there are any arrivals that are later than their departures
    let ct = 0;
    for (let x = 0; x < this.N; x++) {
      if (this.departures[x] < this.arrivals[x]) {
        this.toastrService.warning('Departures must be after arrivals');
        return;
      } else {
        ct++;
      }
    }
    if (ct === this.N) {  // the data is good
      this.testReservationIntervals();
    }
  }
  testReservationIntervals() {  // runs the algorythm
    // first step is sorting the vectors
    this.arrivals = this.arrivals.sort((a, b) => this.compare(a, b));
    this.departures = this.departures.sort((a, b) => this.compare(a, b));


    let sum = 0;   // used to count the current number of resources in use
    let ok = true; // we assume that the reservations can be made
    let j = 0 ;    // position in arrivals vector
    let i = 0 ;    // position in departures vector

    // Here's the idea behind the algorithm: we sort both the vectors, simulating how the reservations would pan out
    // each time a new arrival appears, it means we're using another resource for it
    // each time a new departure appears, it means that one of our reservations has ended, meaning we stop using one of the resources
    // after sorting both of the vectors, we start iterating through them;
    // At each step, we check wether the smallest arrival is smaller than the smallest departure
    // if that is the case, it means it is overlapping with existing reservations,
    // and is using anothr one of our resources, so we add 1 to the number that is counting them
    // if the smallest departure is smaller than the smallest arrival, it means a reservation has stopped using resources;
    // in that case, we substract 1 from our number of resources in use
    // if, at any point, the number of resources in use exceedes K, that means the reservations can not be made, so we return false
    // otherwise we return true

    while ( i < this.N) {
      if (this.arrivals[j] <= this.departures[i]) {  // it means that a new arrival has come,
        sum++;                                       // so we add 1 to the number of resources in use
        j++;                                         // we use '<=' instead of '<' because if a day has both an arrival and a departure
                                                     // we count that day as both, so it is first considered an arrival

      } else {                                       // here it means that a new departure has come,
        sum--;                                       // so we substract 1 from the number of resources in use
        i++;
      }
      if (sum > this.K) {                            // it means there are more than k departures in a row,
          ok = false;                                // therefore the reservations can not be made with only K resources
      }
    }
    if (sum > this.K) {                              // another verification at the end
      ok = false;
    }
    this.activeModal.close(ok);                      // returns the value of the function
    }
  ngOnInit() {
    this.myCarousel.showNavigationArrows = false;
    this.myCarousel.keyboard = false;
    this.myCarousel.showNavigationIndicators = false;
  }

}
