import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamWrapperComponent } from './stream-wrapper.component';

describe('StreamWrapperComponent', () => {
  let component: StreamWrapperComponent;
  let fixture: ComponentFixture<StreamWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
