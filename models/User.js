const mongoose = require("../utils/mongoose");
const constants = require("../utils/constants");
// type: String,
// required: true,
// unique: true
const MongooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      // unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    house: {
      type: mongoose.Types.ObjectId,
      ref: "house",
      required: true,
      autopopulate: { maxDepth: 1 },
    },
    // gender: {
    //   type: String,
    //   required: true,
    // },
    // identityNo: {
    //   type: String,
    //   // unique: true,
    // },
    // identityUrl: {
    //   type: String,
    //   // required: true,
    //   // unique: true,
    // },
    // imageUrl: {
    //   type: String,
    //   // required: true,
    //   // unique: true,
    // },
    // profession: {
    //   type: String,
    //   required: true,
    // },
    // father: {
    //   type: String,
    //   required: true,
    //   // unique: true,
    // },
    // fatherNid: {
    //   type: String,
    //   required: true,
    // },
    // fatherNo: {
    //   type: String,
    //   required: true,
    // },
    // mother: {
    //   type: String,
    //   required: true,
    // },
    // motherNid: {
    //   type: String,
    //   required: true,
    // },
    // motherNo: {
    //   type: String,
    //   required: true,
    // },
    status: {
      type: String,
      enum: ["admin", "blocked", "user", "Current Member", "Previous Member"],
      default: "Current Member",
    },
  },
  { timestamps: true }
).plugin(require("mongoose-autopopulate"));

//
const SchemaModel = (module.exports = mongoose.model("user", MongooseSchema));

// C
module.exports.createData = (data, callback) => {
  if (SchemaModel(data).validateSync(data)) {
    callback(new SchemaModel(data).validateSync(data), null);
  } else {
    SchemaModel.create(data, callback);
  }
};

// Ra
module.exports.getAllData = (query, pageNumber, callback) => {
  SchemaModel.find(query)
    .limit(constants.paginate)
    .sort({ createdAt: "desc" })
    .skip(constants.paginate * pageNumber)
    .exec()
    .then((data) => callback(null, data))
    .catch((error) => callback(error, null));
};

// R1
module.exports.getOneData = (query, callback) => {
  SchemaModel.findOne(query)
    .exec()
    .then((data) => callback(null, data))
    .catch((error) => callback(error, null));
};

// U1
module.exports.updateOneData = (query, data, callback) => {
  SchemaModel.findOneAndUpdate(query, data, { new: true }).exec((err, data) => {
    callback(err, data);
  });
};

// D1
module.exports.removeOneData = (query, callback) => {
  SchemaModel.remove(query, callback);
};

// Da
module.exports.removeAllData = (callback) => {
  SchemaModel.remove(
    {
      status: {
        $ne: "admin",
      },
    },
    callback
  );
};
