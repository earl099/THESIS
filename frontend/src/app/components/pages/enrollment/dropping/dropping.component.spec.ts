import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroppingComponent } from './dropping.component';

describe('DroppingComponent', () => {
  let component: DroppingComponent;
  let fixture: ComponentFixture<DroppingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DroppingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
