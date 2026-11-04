'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../src/ptv-engine.js');

test('Julian day anchor', () => {
  assert.equal(engine.jdFromDate(1,1,2000), 2451545);
});

test('Known lunar new years, Vietnam UTC+7', () => {
  for (const [day,month,year] of [[22,1,2023],[10,2,2024],[29,1,2025],[17,2,2026]]) {
    const actual = engine.convertSolar2Lunar(day,month,year,7);
    assert.deepEqual([actual.day,actual.month,actual.year,actual.leap],[1,1,year,0]);
  }
});

test('Lunar output day and month bounds 2020 to 2030', () => {
  for (let year=2020;year<=2030;year++) for (let month=1;month<=12;month++) {
    const a=engine.convertSolar2Lunar(15,month,year,7);
    assert.ok(a.day>=1 && a.day<=30, JSON.stringify(a));
    assert.ok(a.month>=1 && a.month<=12, JSON.stringify(a));
    assert.ok(a.leap===0 || a.leap===1);
  }
});

test('Year pillar reference years away from seasonal boundary', () => {
  assert.equal(engine.yearPillar(1,6,2024).pillar.text,'Giáp Thìn');
  assert.equal(engine.yearPillar(1,6,2023).pillar.text,'Quý Mão');
});

// WARNING: exact solar-term boundaries remain unverified (currently approximate).
