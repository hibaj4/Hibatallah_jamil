import { TransformingPipe } from './transforming.pipe';

describe('TransformingPipe', () => {
  it('create an instance', () => {
    const pipe = new TransformingPipe();
    expect(pipe).toBeTruthy();
  });
});
