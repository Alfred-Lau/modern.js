import { repeatKeyWarning } from '@/utils/repeatKeyWarning';
import { UserConfig } from '@/config';

jest.spyOn(process, 'exit').mockImplementation();

describe('check repeated keys in user config', () => {
  test(`should exit with error`, () => {
    expect(() => {
      repeatKeyWarning(
        {
          type: 'object',
          properties: {
            a: {
              type: 'object',
              properties: {
                b: {
                  type: 'object',
                  properties: { c: { type: ['boolean', 'object'] } },
                },
              },
            },
          },
        },
        { a: { b: { c: true } } } as UserConfig,
        { a: { b: { c: false } } } as UserConfig,
      );
    }).toThrowError(
      'The same configuration a.b.c exists in modern.config.js and package.json.',
    );
  });

  test(`should exit succcessfully`, () => {
    expect(
      repeatKeyWarning(
        {
          type: 'object',
          properties: {
            a: {
              type: 'object',
              properties: { b: { type: 'string' } },
            },
          },
          c: {
            type: 'object',
            proeperties: {
              d: {
                type: 'object',
                properties: { e: { type: 'string' } },
              },
              f: { type: 'string' },
            },
          },
        },
        {
          a: { b: 'name' },
          c: { d: { e: 's' } },
        } as UserConfig,
        {
          a: {},
          c: {
            d: {},
            f: 'ss',
          },
        } as UserConfig,
      ),
    ).toBeUndefined();
  });
});