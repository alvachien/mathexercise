import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgGobangComponent } from './pg-gobang.component';

describe('PgGobangComponent', () => {
  let component: PgGobangComponent;
  let fixture: ComponentFixture<PgGobangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgGobangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgGobangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
