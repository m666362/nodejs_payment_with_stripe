const mongoose = require("../utils/mongoose");
const constants = require("../utils/constants");
const Transaction = require("./Transaction");
// type: String,
// required: true,
// unique: true
const MongooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      // unique: true,
    },
    due: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["admin", "blocked", "user"],
      default: "user",
    },
  },
  { timestamps: true }
).plugin(require("mongoose-autopopulate"));

//
module.exports.MongooseSchema = MongooseSchema;
const SchemaModel = (module.exports = mongoose.model("house", MongooseSchema));

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

// transactions: [
//     {
//       type: mongoose.Types.ObjectId,
//       ref: "transaction",
//       autopopulate: { maxDepth: 1 }
//     },
//   ],
