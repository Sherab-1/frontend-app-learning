import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render, screen } from '../../../../test/test-utils';
import UnitNavigation from './UnitNavigation';

describe('Unit Navigation', () => {
  const testUnits = [...Array(10).keys()].map(i => String(i + 1));
  const initialState = {
    courseware: {
      sequenceStatus: 'loaded',
      courseStatus: 'loaded',
      courseId: '1',
    },
    models: {
      courses: {
        1: {
          sectionIds: ['1'],
        },
      },
      sections: {
        1: {
          sequenceIds: ['1', '2'],
        },
      },
      sequences: {
        1: {
          unitIds: testUnits,
          showCompletion: true,
        },
        2: {
          unitIds: testUnits,
          showCompletion: true,
        },
      },
      units: testUnits.reduce(
        (acc, unitId) => Object.assign(acc, {
          [unitId]: {
            contentType: 'other',
            title: unitId,
          },
        }),
        {},
      ),
    },
  };
  const mockData = {
    sequenceId: '1',
    unitId: '2',
    onClickPrevious: () => {},
    onClickNext: () => {},
  };

  it('renders correctly without units', () => {
    const { asFragment } = render(<UnitNavigation
      {...mockData}
      sequenceId=""
      unitId=""
      onClickPrevious={() => {}}
      onClickNext={() => {}}
    />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('handles the clicks', () => {
    const onClickPrevious = jest.fn();
    const onClickNext = jest.fn();

    render(<UnitNavigation
      {...mockData}
      sequenceId=""
      unitId=""
      onClickPrevious={onClickPrevious}
      onClickNext={onClickNext}
    />);

    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(onClickPrevious).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onClickNext).toHaveBeenCalledTimes(1);
  });

  it('should have the navigation buttons enabled for the non-corner unit in the sequence', () => {
    render(<UnitNavigation {...mockData} />, { initialState });
    screen.getAllByRole('button').forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('should have the "Previous" button disabled for the first unit in the sequence', () => {
    render(<UnitNavigation {...mockData} unitId="1" />, { initialState });
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });

  it('should display "learn.end.of.course" message instead of the "Next" button for the last unit in the sequence', () => {
    render(
      <UnitNavigation
        {...mockData}
        sequenceId="2"
        unitId={testUnits.length.toString()}
      />, { initialState },
    );
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    expect(screen.getByText("You've reached the end of this course!")).toBeInTheDocument();
  });
});
