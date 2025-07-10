import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "EUR", "GBP", "INR", "JPY"],
      default: "INR",
    },
    frequency: {
      type: String,
      // required: [true, 'Frequency is required'],
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "OTT",
        "Sports",
        "Gaming",
        "News",
        "Music",
        "Education",
        "Health",
        "Lifestyle",
      ],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value) {
          return value <= Date.now();
        },
        message: "Start date cannot be in the future",
      },
      renewdate: {
        type: Date,
        validate: {
          validator: function (value) {
            return value >= this.startDate;
          },
          message: "Renewal date must be after the start date",
        },
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
      },
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewdate) {
    this.renewdate = new Date(this.startDate);
    if (this.frequency === "daily") {
      this.renewdate.setDate(this.renewdate.getDate() + 1);
    } else if (this.frequency === "weekly") {
      this.renewdate.setDate(this.renewdate.getDate() + 7);
    } else if (this.frequency === "monthly") {
      this.renewdate.setMonth(this.renewdate.getMonth() + 1);
    } else if (this.frequency === "yearly") {
      this.renewdate.setFullYear(this.renewdate.getFullYear() + 1);
    }
  }

  if (this.renewdate < this.startDate) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
