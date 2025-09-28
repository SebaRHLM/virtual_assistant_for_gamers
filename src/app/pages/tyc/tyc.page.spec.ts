import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TycPage } from './tyc.page';

describe('TycPage', () => {
  let component: TycPage;
  let fixture: ComponentFixture<TycPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TycPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
