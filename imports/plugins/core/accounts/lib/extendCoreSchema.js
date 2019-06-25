import { Accounts } from "/imports/collections/schemas";

const schemaExtension = {
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  },
  birthDate: {
    type: Date,
    optional: true
  }
};

Accounts.extend(schemaExtension);
