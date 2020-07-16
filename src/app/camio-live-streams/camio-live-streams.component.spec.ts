import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamioLiveStreamsComponent } from './camio-live-streams.component';

describe('CamioLiveStreamsComponent', () => {
  let component: CamioLiveStreamsComponent;
  let fixture: ComponentFixture<CamioLiveStreamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamioLiveStreamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamioLiveStreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
