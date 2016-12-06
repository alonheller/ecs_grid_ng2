import { EcsGridNg2Page } from './app.po';

describe('ecs-grid-ng2 App', function() {
  let page: EcsGridNg2Page;

  beforeEach(() => {
    page = new EcsGridNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
