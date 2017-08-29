import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgSudouComponent } from './pg-sudou.component';

describe('PgSudouComponent', () => {
  let component: PgSudouComponent;
  let fixture: ComponentFixture<PgSudouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgSudouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgSudouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
