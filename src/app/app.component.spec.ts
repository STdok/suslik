import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';

import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { Facebook } from '@ionic-native/facebook/ngx';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireMessagingModule,
        IonicStorageModule.forRoot({
          name: '__fireionic2',
          driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        Facebook,
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
      ]
    }).compileComponents();


    // it('should create the app', async() => {
    //   const fixture = TestBed.createComponent(AppComponent);
    //   const app = fixture.debugElement.componentInstance;
    //   expect(app).toBeTruthy();
    // });

    it('should create the app', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }));

    it('should initialize the app', async () => {
      TestBed.createComponent(AppComponent);
      expect(platformSpy.ready).toHaveBeenCalled();
      await platformReadySpy;
      expect(statusBarSpy.styleDefault).toHaveBeenCalled();
      expect(splashScreenSpy.hide).toHaveBeenCalled();
    });

    it('should have menu labels', async () => {
      const fixture = await TestBed.createComponent(AppComponent);
      await fixture.detectChanges();
      const app = fixture.nativeElement;
      const menuItems = app.querySelectorAll('ion-label');
      expect(menuItems.length).toEqual(1);
      expect(menuItems[0].textContent).toContain('Home');
      // expect(menuItems[1].textContent).toContain('List');
    });

    it('should have urls', async () => {
      const fixture = await TestBed.createComponent(AppComponent);
      await fixture.detectChanges();
      const app = fixture.nativeElement;
      const menuItems = app.querySelectorAll('ion-item');
      expect(menuItems.length).toEqual(1);
      expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/home');
      // expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/list');
    });

  }));

});
