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
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "EUR", "GBP", "INR", "JPY"],
      default: "INR",
    },
    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
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
        "Other"
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
    paymentMethod: {
      type: String,
      trim: true,
      default: "Not specified",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    trialPeriod: {
      type: {
        active: { type: Boolean, default: false },
        durationDays: { type: Number, default: 0 },
      },
      default: { active: false, durationDays: 0 },
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewdate) {
    this.renewdate = new Date(this.startDate);
    if (this.frequency === "Daily") {
      this.renewdate.setDate(this.renewdate.getDate() + 1);
    } else if (this.frequency === "Weekly") {
      this.renewdate.setDate(this.renewdate.getDate() + 7);
    } else if (this.frequency === "Monthly") {
      this.renewdate.setMonth(this.renewdate.getMonth() + 1);
    } else if (this.frequency === "Yearly") {
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
