import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Keyboard } from '@ionic-native/keyboard/ngx';

import {
  FirestoreService,
  TranslateProvider,
  LoadingService,
  ToastService
} from '../../services';


@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss'],
})

export class EventCreatePage implements OnInit {
  userId: string;
  hasError: boolean;
  // eventID = this.route.snapshot.paramMap.get('id');
  public createEventForm: FormGroup;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public translate: TranslateProvider,
    public loading: LoadingService,
    public toast: ToastService,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    private firestore: FirestoreService,
    private storage: Storage,
    private keyboard: Keyboard
  ) {
    // console.log(this.eventID);
  }

  ngOnInit() {
    this.storage.get('uid').then(uid => {
      this.userId = uid;
    });

    this.createEventForm = this.formBuilder.group({
      eventName: ['', Validators.compose([
        Validators.required
      ])],
      eventDescription: ['', Validators.compose([
        Validators.required
      ])],
      eventLocation: ['', Validators.compose([
        Validators.required
      ])],
      eventDate: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createEventForm.controls; }

  keyDownFunction(event) {
    // User pressed return on keypad, proceed with creating profile.
    if (event.keyCode === 13) {
      this.keyboard.hide();
      this.createEvent();
    }
  }

  public createEvent(): void {
    const eventName = this.f.eventName.value;
    const eventDescription = this.f.eventDescription.value;
    const eventLocation = this.f.eventLocation.value;
    const eventDate = this.f.eventDate.value;
    if (!this.createEventForm.valid) {
      // console.log('Errooo!');
      this.hasError = true;
    } else {
      console.log('Entrou!!');
      this.loading.showLoading('Creating event...');

      this.firestore.createEvent(eventName, eventDescription, eventLocation, eventDate, this.userId).then(() => {
        this.loading.dismiss();
        this.toast.showToast(this.translate.get('register.add.success'));
        this.navCtrl.navigateRoot('/event-list');
      });
    }
  }

  onChange($event) {
    console.log($event);
  }

}
