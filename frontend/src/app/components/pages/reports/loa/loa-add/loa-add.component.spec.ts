import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaAddComponent } from './loa-add.component';

describe('LoaAddComponent', () => {
  let component: LoaAddComponent;
  let fixture: ComponentFixture<LoaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
