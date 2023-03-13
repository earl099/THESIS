import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangingComponent } from './changing.component';

describe('ChangingComponent', () => {
  let component: ChangingComponent;
  let fixture: ComponentFixture<ChangingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
