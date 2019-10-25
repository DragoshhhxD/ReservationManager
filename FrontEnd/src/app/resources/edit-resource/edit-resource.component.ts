import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../resources.service';
import { Resource } from '../Resource';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.css']
})
export class EditResourceComponent implements OnInit {
  resource: Resource;
  backup: string;
  constructor(private activeModal: NgbActiveModal,
              private resourceService: ResourcesService) {
  }
  cancel() {
    this.activeModal.dismiss();
    this.resource.resource_name = this.backup;
  }
  edit() {
    const data = {
      resource_id: this.resource.resource_id,
      resource_name: this.resource.resource_name
    };
    this.resourceService.editResource(data).then(res => {
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
    this.backup = this.resource.resource_name;
  }

}
