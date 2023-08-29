import { Component } from '@angular/core';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css'],
})
export class SiteListComponent {
  allSites!: Observable<Array<any>>;
  siteName!: string;
  siteUrl!: string;
  siteImgUrl!: string;
  siteId!: string;
  formState: string = 'Add new';
  isSuccess: boolean = false;
  successMsg!: string;
  isLoading: boolean = false;

  constructor(private passwordManager: PasswordManagerService) {
    this.loadSite();
  }
  showAlert(message: string) {
    this.isSuccess = true;
    this.successMsg = message;
  }
  onSubmit(values: object) {
    if (this.formState == 'Add new') {
      this.passwordManager
        .addSite(values)
        .then((docRef) => {
          this.showAlert('Data saved successfully');
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (this.formState == 'Edit') {
      this.passwordManager
        .updateSite(this.siteId, values)
        .then((docRef) => {
          this.showAlert('Data edited successfully');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  loadSite() {
    this.allSites = this.passwordManager.loadSites();
  }
  handleEditSite(
    siteName: string,
    siteUrl: string,
    siteImgUrl: string,
    siteId: string
  ) {
    this.siteName = siteName;
    this.siteUrl = siteUrl;
    this.siteImgUrl = siteImgUrl;
    this.siteId = siteId;
    this.formState = 'Edit';
  }
  handleCancel() {
    this.siteName = '';
    this.siteUrl = '';
    this.siteImgUrl = '';
    this.siteId = '';
    this.formState = 'Add';
  }
  handleDelete(id: string) {
    this.passwordManager
      .deleteSite(id)
      .then((docRef) => {
        this.showAlert('Data deleted successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
