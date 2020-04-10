import { Component, OnInit } from '@angular/core';

import { Pages } from '../../interfaces/pages';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})

export class CrudPage implements OnInit {
  pages: Array<Pages>;

  constructor() {
    this.pages = [
      { title: 'Event List', url: '/event-list', direct: 'forward', icon: 'calendar' },
      { title: 'Song List', url: '/song-list', direct: 'forward', icon: 'musical-notes' }
    ];
  }

  ngOnInit() {
  }

}
