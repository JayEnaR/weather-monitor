import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindDeviceComponent } from './find-device.component';

describe('FindDeviceComponent', () => {
  let component: FindDeviceComponent;
  let fixture: ComponentFixture<FindDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
