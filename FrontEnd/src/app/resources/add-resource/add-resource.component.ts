import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../resources.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.css']
})
export class AddResourceComponent implements OnInit {
  name = '';
  constructor(private activeModal: NgbActiveModal,
              private resourceService: ResourcesService) { }
  cancel() {
    this.activeModal.dismiss();
  }
  add() {
    const data = {
      resource_id: 0,
      resource_name: this.name
    };
    this.resourceService.addResource(data).then(res => {
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
  ngOnInit() {
  }

}
