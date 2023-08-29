import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';
import { AES, enc } from 'crypto-js';

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
  passwordList!: Array<any>;
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
  onSubmit(values: any) {
    const encriptedPw = this.encryptPassword(values.password);
    values.password = encriptedPw;
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
    this.passwordManagerService.loadPasswords(this.siteId).subscribe((val) => {
      this.passwordList = val;
    });
  }
  editPassword(
    email: string,
    username: string,
    password: string,
    passwordId: string
  ) {
    if (password.length > 10) {
      password = this.decriptPassword(password);
    }
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
  encryptPassword(password: string) {
    const secretKey =
      'ZKY3ng1wnAaWXk6GwOfkuiZZSQO4ynA3saMzbq7ks8B5eo5hgKE7ce64J';
    const encriptedPS = AES.encrypt(password, secretKey).toString();
    return encriptedPS;
  }
  decriptPassword(password: string) {
    const secretKey =
      'ZKY3ng1wnAaWXk6GwOfkuiZZSQO4ynA3saMzbq7ks8B5eo5hgKE7ce64J';
    const decriptedPS = AES.decrypt(password, secretKey).toString(enc.Utf8);
    return decriptedPS;
  }
  handleDecrypt(password: string, index: number) {
    const decryptPw = this.decriptPassword(password);
    this.passwordList[index].password = decryptPw;
  }
  handleEncrypt(password: string, index: number) {
    const encryptPw = this.encryptPassword(password);
    this.passwordList[index].password = encryptPw;
  }
}
