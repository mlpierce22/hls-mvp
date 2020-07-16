import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamButtonsComponent } from './stream-buttons.component';

describe('StreamButtonsComponent', () => {
  let component: StreamButtonsComponent;
  let fixture: ComponentFixture<StreamButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
