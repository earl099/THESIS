import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallPageComponent } from './install-page.component';

describe('InstallPageComponent', () => {
  let component: InstallPageComponent;
  let fixture: ComponentFixture<InstallPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
