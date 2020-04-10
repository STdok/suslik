import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

import { Subscription } from 'rxjs';

import {
  FirestoreService,
  TranslateProvider,
  LoadingService,
  ToastService
} from '../../services';

import { Event } from '../../models';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})

export class EventDetailPage implements OnInit, OnDestroy {
  public event: Event;
  public eID;
  public mode = 'detail';
  private subscription: Subscription;

  hasError: boolean;
  // eventID = this.route.snapshot.paramMap.get('id');
  public editEventForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public toast: ToastService,
    public loading: LoadingService,
    public alert: AlertController,
    public translate: TranslateProvider,
    public navCtrl: NavController,
    private firestore: FirestoreService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.eID = params.get('id');
      }
    );

    this.firestore.get('eventList/' + this.eID).then(res => {
      this.subscription = res.valueChanges().subscribe((r: Event) => {
        this.event = new Event(r.id, r.eventName, r.eventDescription, r.eventLocation, r.eventDate, r.userId);

        this.editEventForm = this.formBuilder.group({
          eventName: [this.event.eventName, Validators.compose([
            Validators.required
          ])],
          eventDescription: [this.event.eventDescription, Validators.compose([
            Validators.required
          ])],
          eventLocation: [this.event.eventLocation, Validators.compose([
            Validators.required
          ])],
          eventDate: [this.event.eventDate, Validators.compose([
            Validators.required
          ])]
        });
      });
    });

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.editEventForm.controls; }

  async deleteEvent() {
    const alert = await this.alert.create({
      header: this.translate.get('alert.delete.title'),
      message: this.translate.get('alert.delete.message'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: (e) => {
            this.subscription.unsubscribe();
            // this.editEventForm = null;
            this.loading.showLoading('Deleting event...');

            this.firestore.deleteEvent(this.eID).then(() => {
              this.loading.dismiss();
              this.toast.showToast(this.translate.get('alert.delete.success'));

              this.navCtrl.navigateRoot('/event-list');
            }).catch(() => {});
          }
        }
      ]
    });

    await alert.present();
  }

  public editEvent(): void {
    const eventName = this.f.eventName.value;
    const eventDescription = this.f.eventDescription.value;
    const eventLocation = this.f.eventLocation.value;
    const eventDate = this.f.eventDate.value;

    if (!this.editEventForm.valid) {
      this.hasError = true;
    } else {
      this.loading.showLoading('Updating event...');

      this.firestore
      .updateEvent(this.eID , eventName, eventDescription, eventLocation, eventDate)
      .then(
        () => {
          this.loading.dismiss().then(() => {
            this.navCtrl.navigateRoot('/event-list');
          });
        },
        async error => {
          const alertUp = await this.alert.create({
            header: 'Update Error!',
            message: error.message,
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {}
              }
            ]
          });

          alertUp.present();
        }
      );
    }
  }



}
