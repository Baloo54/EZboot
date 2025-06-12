export default {
  transform: { "^.+\\.js$": "babel-jest" },
  // ou si tu utilises Babel :
  // transform: { '^.+\\.jsx?$': 'babel-jest' },
  // extensions
  moduleFileExtensions: ['js', 'mjs'],
  // et pour ESM
  testEnvironment: 'node',
};
