import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from '../password-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AES, enc } from 'crypto-js';
import Helper from '../helper';

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
  passwordId!: string;
  fromState: string = 'Add new';
  isSuccess: boolean = false;
  successMsg!: string;
  isLoading: boolean = false;
  isLoadingForm: boolean = false;
  passwordListForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private passwordManagerService: PasswordManagerService,
    private formBuilder: FormBuilder
  ) {
    this.route.queryParams.subscribe((val: any) => {
      this.siteId = val.id;
      this.siteName = val.siteName;
      this.siteUrl = val.siteUrl;
      this.siteImgUrl = val.siteImgUrl;
    });
    this.loadPasswords();
    this.passwordListForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  showAlert(message: string) {
    this.isSuccess = true;
    this.successMsg = message;
    setTimeout(() => {
      this.isSuccess = false;
    }, 2000);
  }
  onSubmit(values: any) {
    const encriptedPw = this.encryptPassword(values.password);
    values.password = encriptedPw;
    this.formSubmitted = true;
    if (
      Helper.hasAnyPropertyEmptyString(values) &&
      this.passwordListForm.valid
    ) {
      this.passwordListForm.get('email')?.setErrors({ required: true });
      this.passwordListForm.get('username')?.setErrors({ required: true });
      this.passwordListForm.get('password')?.setErrors({ required: true });
      return;
    }
    if (this.passwordListForm.valid) {
      this.isLoadingForm = true;
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
  }
  loadPasswords() {
    this.isLoading = true;
    this.passwordManagerService.loadPasswords(this.siteId).subscribe((val) => {
      this.passwordList = val;
      this.isLoading = false;
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
    this.passwordListForm?.get('email')?.setValue(email);
    this.passwordListForm?.get('username')?.setValue(username);
    this.passwordListForm?.get('password')?.setValue(password);
    this.passwordId = passwordId;
    this.fromState = 'Edit';
  }
  handleCancel() {
    this.passwordListForm?.get('email')?.setValue('');
    this.passwordListForm?.get('email')?.setErrors(null);
    this.passwordListForm?.get('username')?.setValue('');
    this.passwordListForm?.get('username')?.setErrors(null);
    this.passwordListForm?.get('password')?.setValue('');
    this.passwordListForm?.get('password')?.setErrors(null);

    this.passwordId = '';
    this.fromState = 'Add new';
    this.isLoadingForm = false;
  }
  deletePassword(passwordId: string) {
    this.isLoadingForm = true;
    this.passwordManagerService
      .deletePassword(this.siteId, passwordId)
      .then(() => {
        this.showAlert('Data deleted successfully');
        this.isLoadingForm = false;
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
