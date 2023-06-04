import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessedListComponent } from './assessed-list.component';

describe('AssessedListComponent', () => {
  let component: AssessedListComponent;
  let fixture: ComponentFixture<AssessedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
