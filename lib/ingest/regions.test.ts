import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  canadianRegionCode,
  isWesternCanada,
  locationMatches,
  locationSearchText,
  matchesRegionFilter,
  parseRegionFilter,
} from '@/lib/ingest/regions';

describe('canadian regions', () => {
  it('maps names and codes, including territories', () => {
    assert.equal(canadianRegionCode('British Columbia'), 'BC');
    assert.equal(canadianRegionCode('ab'), 'AB');
    assert.equal(canadianRegionCode('Northwest Territories'), 'NT');
    assert.equal(canadianRegionCode('NWT'), 'NT');
    assert.equal(canadianRegionCode('Yukon Territory'), 'YT');
    assert.equal(canadianRegionCode('Nunavut'), 'NU');
    assert.equal(canadianRegionCode('Québec'), 'QC');
    assert.equal(canadianRegionCode('Texas'), null);
  });

  it('treats Manitoba through BC plus territories as Western Canada', () => {
    assert.equal(isWesternCanada('Manitoba'), true);
    assert.equal(isWesternCanada('Saskatchewan'), true);
    assert.equal(isWesternCanada('Alberta'), true);
    assert.equal(isWesternCanada('BC'), true);
    assert.equal(isWesternCanada('Yukon'), true);
    assert.equal(isWesternCanada('NT'), true);
    assert.equal(isWesternCanada('NU'), true);
    assert.equal(isWesternCanada('Ontario'), false);
    assert.equal(isWesternCanada('Quebec'), false);
  });

  it('parses west and explicit province lists', () => {
    assert.equal(parseRegionFilter('west'), 'west');
    assert.deepEqual(parseRegionFilter('BC, Alberta | SK'), ['BC', 'AB', 'SK']);
  });

  it('builds a location haystack with full names and west', () => {
    assert.equal(
      locationSearchText('Iqaluit', 'NU', 'CA').includes('nunavut'),
      true,
    );
    assert.equal(locationSearchText('Calgary', 'AB', 'CA').includes('alberta'), true);
    assert.equal(locationSearchText('Toronto', 'ON', 'CA').includes('west'), false);
    assert.equal(locationSearchText('Vancouver', 'BC', 'CA').includes('west'), true);
    assert.equal(locationMatches('Vancouver', 'BC', 'CA', 'MB'), false);
    assert.equal(locationMatches('Drayton Valley', 'AB', 'CA', 'YT'), false);
    assert.equal(locationMatches('Winnipeg', 'MB', 'CA', 'MB'), true);
    assert.equal(locationMatches('Iqaluit', 'NU', 'CA', 'Nunavut'), true);
  });

  it('matches a west filter and a custom code list', () => {
    assert.equal(matchesRegionFilter('Calgary', undefined), true);
    assert.equal(matchesRegionFilter('Alberta', 'west'), true);
    assert.equal(matchesRegionFilter('Ontario', 'west'), false);
    assert.equal(matchesRegionFilter('Manitoba', ['MB', 'ON']), true);
    assert.equal(matchesRegionFilter('Alberta', ['MB', 'ON']), false);
  });
});
