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

import { Song } from '../../models';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.page.html',
  styleUrls: ['./song-detail.page.scss'],
})

export class SongDetailPage implements OnInit, OnDestroy {
  public song: Song;
  public eID;
  public mode = 'detail';
  private subscription: Subscription;

  hasError: boolean;
  // eventID = this.route.snapshot.paramMap.get('id');
  public editSongForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public toast: ToastService,
    public loading: LoadingService,
    public alert: AlertController,
    public translate: TranslateProvider,
    public navCtrl: NavController,
    private firestore: FirestoreService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.eID = params.get('id');
      }
    );

    this.firestore.get('songList/' + this.eID).then(res => {
      this.subscription = res.valueChanges().subscribe((r: Song) => {
        this.song = new Song(r.id, r.albumName, r.artistName, r.songDescription, r.songName, r.userId);

        this.editSongForm = this.formBuilder.group({
          albumName: [this.song.albumName, Validators.compose([
            Validators.required
          ])],
          artistName: [this.song.artistName, Validators.compose([
            Validators.required
          ])],
          songDescription: [this.song.songDescription, Validators.compose([
            Validators.required
          ])],
          songName: [this.song.songName, Validators.compose([
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
  get f() { return this.editSongForm.controls; }

  async deleteSong() {
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
            this.loading.showLoading('Deleting song...');

            this.firestore.deleteSong(this.eID).then(() => {
              this.loading.dismiss();
              this.toast.showToast(this.translate.get('alert.delete.success'));

              this.navCtrl.navigateRoot('/song-list');
            }).catch(() => {});
          }
        }
      ]
    });

    await alert.present();
  }

  public editSong(): void {
    const albumName = this.f.albumName.value;
    const artistName = this.f.artistName.value;
    const songDescription = this.f.songDescription.value;
    const songName = this.f.songName.value;

    if (!this.editSongForm.valid) {
      this.hasError = true;
    } else {
      this.loading.showLoading('Updating song...');

      this.firestore
      .updateSong(this.eID , albumName, artistName, songDescription, songName)
      .then(
        () => {
          this.loading.dismiss().then(() => {
            this.navCtrl.navigateRoot('/song-list');
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
