import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgChineseChess2Component } from './pg-chinese-chess2.component';

describe('PgChineseChess2Component', () => {
  let component: PgChineseChess2Component;
  let fixture: ComponentFixture<PgChineseChess2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgChineseChess2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgChineseChess2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
