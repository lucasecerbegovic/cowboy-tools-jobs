import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  detectApprenticeship,
  isTradesNoc,
  tradeFromNoc,
  tradeFromText,
} from "./trades";

describe("trades mapping", () => {
  it("accepts 72/73/74 NOC codes and featured trades", () => {
    assert.equal(isTradesNoc("72200"), true);
    assert.equal(isTradesNoc("72300"), true);
    assert.equal(isTradesNoc("73400"), true);
    assert.equal(isTradesNoc("21231"), false);
    assert.equal(tradeFromNoc("72200"), "electrician");
    assert.equal(tradeFromNoc("72310"), "carpenter");
    assert.equal(tradeFromNoc("72106"), "welder");
    assert.equal(tradeFromNoc("72400"), "millwright");
    assert.equal(tradeFromNoc("72402"), "hvac");
    assert.equal(tradeFromNoc("73200"), "hvac");
    assert.equal(tradeFromNoc("73400"), "heavy_equipment");
  });

  it("detects apprenticeships and keyword trades", () => {
    assert.equal(detectApprenticeship("1st year electrical apprentice"), true);
    assert.equal(detectApprenticeship("Journeyperson electrician"), false);
    assert.equal(tradeFromText("Residential HVAC technician"), "hvac");
  });
});
