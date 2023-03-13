import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegformReprintComponent } from './regform-reprint.component';

describe('RegformReprintComponent', () => {
  let component: RegformReprintComponent;
  let fixture: ComponentFixture<RegformReprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegformReprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegformReprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
