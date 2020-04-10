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
  selector: 'app-song-create',
  templateUrl: './song-create.page.html',
  styleUrls: ['./song-create.page.scss'],
})

export class SongCreatePage implements OnInit {
  userId: string;
  hasError: boolean;

  public createSongForm: FormGroup;

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

    this.createSongForm = this.formBuilder.group({
      albumName: ['', Validators.compose([
        Validators.required
      ])],
      artistName: ['', Validators.compose([
        Validators.required
      ])],
      songDescription: ['', Validators.compose([
        Validators.required
      ])],
      songName: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createSongForm.controls; }

  keyDownFunction(event) {
    // User pressed return on keypad, proceed with creating profile.
    if (event.keyCode === 13) {
      this.keyboard.hide();
      this.createSong();
    }
  }

  public createSong(): void {
    const albumName = this.f.albumName.value;
    const artistName = this.f.artistName.value;
    const songDescription = this.f.songDescription.value;
    const songName = this.f.songName.value;

    if (!this.createSongForm.valid) {
      this.hasError = true;
    } else {
      this.loading.showLoading('Registering Song...');

      this.firestore.createSong(albumName, artistName, songDescription, songName, this.userId).then(() => {
        this.loading.dismiss();
        this.toast.showToast(this.translate.get('register.add.success'));
        this.navCtrl.navigateRoot('/song-list');
      });
    }
  }

  onChange($event) {
    console.log($event);
  }

}
