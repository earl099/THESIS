import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShifteeAddComponent } from './shiftee-add.component';

describe('ShifteeAddComponent', () => {
  let component: ShifteeAddComponent;
  let fixture: ComponentFixture<ShifteeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShifteeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShifteeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
