import mongoose from "mongoose";

const { Schema, model } = mongoose;

const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: [2, "Subscription name must be at least 2 characters long"],
      maxLength: [100, "Subscription name must not exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Subscription price must be a positive number"],
    },
    currency: {
      type: String,
      trim: true,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enums: [
        "sports",
        "news",
        "entertainment",
        "lifeStyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer", "other"],
      required: [true, "Payment method is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: (value) => value <= new Date(),
        message: "startDate must be in the past or today",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        /**
         * @this {import("mongoose").InferSchemaType<typeof subscriptionSchema>}
         */
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "renewalDate must be after startDate",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(this.startDate);
    // example: const date = new Date("2024-01-01");
    // date.setDate(10); "2024-01-10"
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
    // example: const date = new Date("2024-01-01");
    // date.getDate(); // returns 1
  }
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});

const Subscription = model("Subscription", subscriptionSchema);

export default Subscription;
