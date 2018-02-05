import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgChineseChessComponent } from './pg-chinese-chess.component';

describe('PgChineseChessComponent', () => {
  let component: PgChineseChessComponent;
  let fixture: ComponentFixture<PgChineseChessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgChineseChessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgChineseChessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
