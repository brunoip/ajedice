import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalScreenComponent } from './final-screen.component';

describe('FinalScreenComponent', () => {
  let component: FinalScreenComponent;
  let fixture: ComponentFixture<FinalScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
