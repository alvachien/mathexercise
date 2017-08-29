import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgTypingtourComponent } from './pg-typingtour.component';

describe('PgTypingtourComponent', () => {
  let component: PgTypingtourComponent;
  let fixture: ComponentFixture<PgTypingtourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgTypingtourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgTypingtourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
