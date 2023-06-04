import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledListComponent } from './enrolled-list.component';

describe('EnrolledListComponent', () => {
  let component: EnrolledListComponent;
  let fixture: ComponentFixture<EnrolledListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolledListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
