import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  DocumentReference,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PasswordManagerService {
  constructor(private firestore: Firestore) {}

  addSite(data: object): Promise<DocumentReference> {
    const dbInstance = collection(this.firestore, 'sites');
    return addDoc(dbInstance, data);
  }
  loadSites() {
    const dbInstance = collection(this.firestore, 'sites');
    return collectionData(dbInstance, { idField: 'id' });
  }
  updateSite(id: string, data: object) {
    const docInstance = doc(this.firestore, 'sites', id);
    return updateDoc(docInstance, data);
  }
  deleteSite(id: string) {
    const docInstance = doc(this.firestore, 'sites', id);
    return deleteDoc(docInstance);
  }
  //password queries

  addPassword(data: object, siteId: string) {
    const dbInstance = collection(this.firestore, `sites/${siteId}/passwords`);
    return addDoc(dbInstance, data);
  }
  loadPasswords(siteId: string) {
    const dbInstance = collection(this.firestore, `sites/${siteId}/passwords`);
    return collectionData(dbInstance, { idField: 'id' });
  }
  updatePassword(siteId: string, passwordId: string, data: object) {
    const dbInstance = doc(
      this.firestore,
      `sites/${siteId}/passwords`,
      passwordId
    );
    return updateDoc(dbInstance, data);
  }
  deletePassword(siteId: string, passwordId: string) {
    const docInstance = doc(
      this.firestore,
      `sites/${siteId}/passwords`,
      passwordId
    );
    return deleteDoc(docInstance);
  }
}
