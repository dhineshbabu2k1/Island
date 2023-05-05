const db = require("../config/Connection");

const loginschema = new db.mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    role: { type: Number, required: true },
    ref_id: { type: String, required: true },
    status: Number
  }
);

const adminSchema = new db.mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  address: String,
  mobile_no: String,
  status: Number
});

const serviceSchema = new db.mongoose.Schema({
  name: { type: String, require: true, unique: true },
  picture: String,
  status: Number
});

const patientSchema = new db.mongoose.Schema({
  nm: { type: String, require: true, unique: true },
  mob: { type: String, require: true },
  age: { type: Number },
  sx: String,
  occ: String,
  city: String,
  status: Number
});

const locationSchema = new db.mongoose.Schema({
  location_name: { type: String, require: true, unique: true },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  entry_by_id: Number,
  active_status: Number
});


module.exports.Login = db.mongoose.model("Login", loginschema);
module.exports.Admin = db.mongoose.model("Admin", adminSchema);
module.exports.Service = db.mongoose.model("Service", serviceSchema);
module.exports.Patient = db.mongoose.model("Patient", patientSchema);
module.exports.Location = db.mongoose.model("location", locationSchema);
