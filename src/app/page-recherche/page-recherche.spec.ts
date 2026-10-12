import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageRecherche } from './page-recherche';

describe('PageRecherche', () => {
  let component: PageRecherche;
  let fixture: ComponentFixture<PageRecherche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageRecherche],
    }).compileComponents();

    fixture = TestBed.createComponent(PageRecherche);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
