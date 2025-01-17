import { Platform } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { environment } from '../../../environments/environment';

import { Subscription } from 'rxjs';

import { FirestoreService } from '../firestore/firestore.service';
import { TranslateProvider } from '../translate/translate.service';

import { User } from '../../models';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public user: User;
  private fbSubscription: Subscription;
  private fsSubscription: Subscription;

  constructor (
    private platform: Platform,
    private afAuth: AngularFireAuth,
    private facebook: Facebook,
    private firestore: FirestoreService,
    public translate: TranslateProvider
  ) { }

  // Get the userData from Firestore of the logged in user on Firebase.
  public getUserData(): User {
    return this.user;
  }

  public setUserData(socialUser) {
    this.user = socialUser;
  }

  public getUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      if (this.fbSubscription) {
        this.fbSubscription.unsubscribe();
      }
      this.fbSubscription = this.afAuth.authState.subscribe((user: firebase.User) => {
        // User is logged in on Firebase.
        if (user) {
          this.firestore.get('users/' + user.uid).then(ref => {
            if (this.fsSubscription) {
              this.fsSubscription.unsubscribe();
            }
            // Update userData variable from Firestore.
            this.fsSubscription = ref.valueChanges().subscribe((usr: User) => {
              this.user = usr;
            });
          }).catch(() => {
            reject();
          });
        }
        resolve(user);
      });
    });
  }

  // Change password of the logged in user on Firebase.
  public changePassword(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.currentUser.updatePassword(password).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }

  // Reset password of the logged in user on Firebase.
  public resetPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email).then((res) => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }

  // Login to Firebase using email and password combination.
  public loginWithEmail(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }

  // Register an account on Firebase with email and password combination.
  public registerWithEmail(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(res => {
        console.log('1 - createUserWithEmailAndPassword res: ', res);
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }

  // Log the user out from Firebase.
  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut().then(() => {
        this.facebook.logout();
        // this.googlePlus.logout();
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  // Login on Firebase using Facebook.
  public authWithFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.facebook.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
          const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
          this.afAuth.auth.signInWithCredential(credential).then(response => {
            // console.log(response.user);
            // resolve(response.user);
            console.log(response);
            resolve(response);
          }).catch(err => {
            console.log(err);
            reject(this.translate.get(err.code));
          });
        }).catch(err => {
          console.log(err);
          // User cancelled, don't show any error.
          reject();
        });
      } else {
        const fbprovider = new firebase.auth.FacebookAuthProvider();

        this.afAuth.auth.signInWithPopup(fbprovider).then(res => {
          resolve(res);
        }).catch((e) => {
          reject(e);
        });
      }
    });
  }

  // Login on Firebase using Google.
  // public authWithGoogle(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     if (this.platform.is('cordova')) {
  //       this.googlePlus.login({
  //         'webClientId': environment.googleWebClientId,
  //         'offline': true // set FALSE or remove this line before you build and release a prod version.
  //       }).then(res => {
  //         const credential = firebase.auth.GoogleAuthProvider.credential(res.idToken, res.accessToken);
  //         this.afAuth.auth.signInWithCredential(credential).then(ress => {
  //           resolve(ress);
  //         }).catch(err => {
  //           reject(err.code);
  //         });
  //       }).catch(err => {
  //         // User cancelled, don't show any error.
  //         reject();
  //       });
  //     } else {
  //       const gprovider = new firebase.auth.GoogleAuthProvider();

  //       this.afAuth.auth.signInWithPopup(gprovider).then(res => {
  //         resolve(res);
  //       }).catch((e) => {
  //         reject(e);
  //       });
  //     }
  //   });
  // }


}
