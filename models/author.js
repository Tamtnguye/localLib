const mongoose = require('mongoose');
const { DateTime } = require("luxon");
// const getNumberSuffix = require("../utils/date_suffix");
// const getMonthName = require("../utils/month_name");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's lifespan
// AuthorSchema
// .virtual('lifespan')
// .get(function () {
//   return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
// });

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  if(!this.date_of_birth) {
    return "N/A";
  }
  let end_datetime;
  if (this.date_of_death) {
    end_datetime = DateTime.fromJSDate(this.date_of_death);
  } else {
    end_datetime = DateTime.local();
  }
  const birth_datetime = DateTime.fromJSDate(this.date_of_birth);
  const date_diff = end_datetime.diff(birth_datetime, [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds"

  ]);
  return date_diff.toObject();
});
//- DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED));

/*.virtual('due_back_formatted')
.get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
}); */
// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);