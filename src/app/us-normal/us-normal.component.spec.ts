import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsNormalComponent } from './us-normal.component';

describe('UsNormalComponent', () => {
  let component: UsNormalComponent;
  let fixture: ComponentFixture<UsNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsNormalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
