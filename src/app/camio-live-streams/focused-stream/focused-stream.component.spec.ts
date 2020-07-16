import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusedStreamComponent } from './focused-stream.component';

describe('FocusedStreamComponent', () => {
  let component: FocusedStreamComponent;
  let fixture: ComponentFixture<FocusedStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusedStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusedStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
