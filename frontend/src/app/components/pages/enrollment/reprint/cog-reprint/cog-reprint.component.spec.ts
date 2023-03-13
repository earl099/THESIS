import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CogReprintComponent } from './cog-reprint.component';

describe('CogReprintComponent', () => {
  let component: CogReprintComponent;
  let fixture: ComponentFixture<CogReprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CogReprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CogReprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
