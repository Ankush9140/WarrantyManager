import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Active } from './active';

describe('Active', () => {
  let component: Active;
  let fixture: ComponentFixture<Active>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Active]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Active);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
