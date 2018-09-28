const faker = require("faker");
const { createNew } = require("../../ModelMethods.js");
const { ObjectID } = require("mongodb");

const modelNames = [
  "system",
  "client",
  "contractor",
  "inspector",
  "spec",
  "upload",
  "invoice"
];

const dropAll = () => {
  try {
    modelNames.forEach(m => global.models[m].collection.drop().catch(e => {}));
  } catch (e) {
    () => {};
  }

  return {};
};

const generateAll = () => {
  dropAll();

  const meta = global.metaData;
  modelNames.forEach(m => {
    for (var i = 0; i < 10; i++) {
      const obj = {};

      for (key in meta[m].fields) {
        switch (meta[m].fields[key].type) {
          case "Boolean":
            obj[key] = faker.random.boolean();
            break;
          case "String":
            obj[key] = faker.lorem.word();
            break;
          case "templateString":
            obj[key] = faker.lorem.paragraph();
            break;
          case "Number":
            obj[key] = faker.random.number();
            break;
          case "Date":
            obj[key] = faker.date.recent();
            break;

          default:
            break;
        }
      }

      createNew(m, obj, "5b469dd5a69858086f2890c8", (doc, e) => {});
    }
  });
};

module.exports = { dropAll, generateAll };
