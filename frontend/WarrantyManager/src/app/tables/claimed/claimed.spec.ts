import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Claimed } from './claimed';

describe('Claimed', () => {
  let component: Claimed;
  let fixture: ComponentFixture<Claimed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Claimed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Claimed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
