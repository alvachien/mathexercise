import { MathexercisePage } from './app.po';

describe('mathexercise App', () => {
  let page: MathexercisePage;

  beforeEach(() => {
    page = new MathexercisePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
