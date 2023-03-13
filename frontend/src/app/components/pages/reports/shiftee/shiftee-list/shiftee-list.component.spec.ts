import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShifteeListComponent } from './shiftee-list.component';

describe('ShifteeListComponent', () => {
  let component: ShifteeListComponent;
  let fixture: ComponentFixture<ShifteeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShifteeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShifteeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
