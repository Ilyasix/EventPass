module.exports = {
  packageManager: "pnpm",

  testRunner: "command",
  commandRunner: {
    command: "pnpm -r test:unit",
  },

  reporters: ["html", "clear-text", "progress"],

  mutate: [
    "apps/people-service/src/validation/people.ts",
    "apps/event-service/src/validation/events.ts",
  ],

  checkers: [],

  coverageAnalysis: "off",
};
