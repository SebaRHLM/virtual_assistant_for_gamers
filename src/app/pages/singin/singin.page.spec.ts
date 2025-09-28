import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinginPage } from './singin.page';

describe('SinginPage', () => {
  let component: SinginPage;
  let fixture: ComponentFixture<SinginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SinginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
