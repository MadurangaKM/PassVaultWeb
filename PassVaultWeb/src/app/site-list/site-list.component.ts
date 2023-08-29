import { Component } from '@angular/core';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { asyncUrlValidator } from '../validators/url.validators';
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
  siteListForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(
    private passwordManager: PasswordManagerService,
    private formBuilder: FormBuilder
  ) {
    this.loadSite();
    const urlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.siteListForm = this.formBuilder.group({
      siteName: ['', Validators.required],
      siteUrl: ['', Validators.required, asyncUrlValidator()],
      siteImgUrl: ['', Validators.required, asyncUrlValidator()],
    });
  }
  showAlert(message: string) {
    this.isSuccess = true;
    this.successMsg = message;
    setTimeout(() => {
      this.isSuccess = false;
    }, 2000);
  }
  areAllPropertiesEmptyString(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== '') {
        return false;
      }
    }
    return true;
  }
  onSubmit(values: object) {
    this.formSubmitted = true;
    if (this.areAllPropertiesEmptyString(values) && this.siteListForm.valid) {
      this.siteListForm.get('siteUrl')?.setErrors({ required: true });
      this.siteListForm.get('siteName')?.setErrors({ required: true });
      this.siteListForm.get('siteImgUrl')?.setErrors({ required: true });
      return;
    }
    if (this.siteListForm.valid) {
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
    this.siteListForm?.get('siteUrl')?.setValue(siteUrl);
    this.siteListForm?.get('siteName')?.setValue(siteName);
    this.siteListForm?.get('siteImgUrl')?.setValue(siteImgUrl);
    this.siteId = siteId;
    this.formState = 'Edit';
  }
  handleCancel() {
    this.siteListForm?.get('siteUrl')?.setValue('');
    this.siteListForm?.get('siteUrl')?.setErrors(null);
    this.siteListForm?.get('siteName')?.setValue('');
    this.siteListForm?.get('siteName')?.setErrors(null);
    this.siteListForm?.get('siteImgUrl')?.setValue('');
    this.siteListForm?.get('siteImgUrl')?.setErrors(null);
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
