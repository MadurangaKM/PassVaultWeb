import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.css'],
})
export class PasswordListComponent {
  siteId!: string;
  siteName!: string;
  siteUrl!: string;
  siteImgUrl!: string;
  passwordList!: Observable<Array<any>>;
  email!: string;
  username!: string;
  password!: string;
  passwordId!: string;
  fromState: string = 'Add new';
  isSuccess: boolean = false;
  successMsg!: string;

  constructor(
    private route: ActivatedRoute,
    private passwordManagerService: PasswordManagerService
  ) {
    this.route.queryParams.subscribe((val: any) => {
      this.siteId = val.id;
      this.siteName = val.siteName;
      this.siteUrl = val.siteUrl;
      this.siteImgUrl = val.siteImgUrl;
    });
    this.loadPasswords();
  }
  showAlert(message: string) {
    this.isSuccess = true;
    this.successMsg = message;
  }
  onSubmit(values: object) {
    if (this.fromState == 'Add new') {
      this.passwordManagerService
        .addPassword(values, this.siteId)
        .then(() => {
          this.showAlert('Data saved successfully');
          this.handleCancel();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (this.fromState == 'Edit') {
      this.passwordManagerService
        .updatePassword(this.siteId, this.passwordId, values)
        .then(() => {
          this.showAlert('Data edited successfully');
          this.handleCancel();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  loadPasswords() {
    this.passwordList = this.passwordManagerService.loadPasswords(this.siteId);
  }
  editPassword(
    email: string,
    username: string,
    password: string,
    passwordId: string
  ) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.passwordId = passwordId;
    this.fromState = 'Edit';
  }
  handleCancel() {
    this.email = '';
    this.username = '';
    this.password = '';
    this.passwordId = '';
    this.fromState = 'Add new';
  }
  deletePassword(passwordId: string) {
    this.passwordManagerService
      .deletePassword(this.siteId, passwordId)
      .then(() => {
        this.showAlert('Data deleted successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
