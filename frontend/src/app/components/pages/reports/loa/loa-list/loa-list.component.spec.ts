import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaListComponent } from './loa-list.component';

describe('LoaListComponent', () => {
  let component: LoaListComponent;
  let fixture: ComponentFixture<LoaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
