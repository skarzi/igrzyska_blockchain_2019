import React from 'react';
import renderer from 'react-test-renderer';

import { Loading } from '../index';

describe('Loading Component', () => {
  it('renders properly', () => {
    const component = renderer.create(<Loading />);

    expect(component).toMatchSnapshot();
  });
});
