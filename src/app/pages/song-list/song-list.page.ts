import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

import {
  FirestoreService
} from '../../services';

import { Observable } from 'rxjs';
import { Song } from '../../models';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.page.html',
  styleUrls: ['./song-list.page.scss'],
})

export class SongListPage implements OnInit {
  public songList: Observable<Song[]>;
  public userId;

  constructor(
    public storage: Storage,
    private firestore: FirestoreService
  ) { }

  ngOnInit() {
    this.storage.get('uid').then(uid => {
      this.userId = uid;
      this.songList = this.firestore.getSongList(this.userId).valueChanges();
    });
  }

}
