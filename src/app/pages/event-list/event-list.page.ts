import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

import {
  FirestoreService
} from '../../services';

import { Observable } from 'rxjs';
import { Event } from '../../models';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss'],
})

export class EventListPage implements OnInit {
  public eventList: Observable<Event[]>;
  public userId;

  constructor(
    public storage: Storage,
    private firestore: FirestoreService
  ) {

  }

  ngOnInit() {
    this.storage.get('uid').then(uid => {
      this.userId = uid;
      this.eventList = this.firestore.getEventList(this.userId).valueChanges();
    });
  }

}
