import mongoose, { Schema, Model } from "mongoose";

export interface IAsset {
  assetTag?: string;
  serialNumber: string;
  name: string;
  manufacturer: "Lenovo" | "Lava" | "Samsung" | "Other";
  type: "Tablet" | "Mobile" | "Laptop" | "Desktop" | "Router" | "Other";
  model?: string;
  status: "Active" | "Scrap" | "Repair" | "Missing";
  locationType: "Store" | "ZEDC" | "HO";
  storeCode?: string;
  storeName?: string;
  assignedTo?: string;
  purchaseDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ASSET_TYPES = [
  "Tablet",
  "Mobile",
  "Laptop",
  "Desktop",
  "Router",
  "Other",
] as const;

const AssetSchema = new Schema<IAsset>(
  {
    assetTag: String,

    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    manufacturer: {
      type: String,
      enum: ["Lenovo", "Lava", "Samsung", "Other"],
      required: true,
    },

    type: {
      type: String,
      enum: ASSET_TYPES,
      required: true,
    },

    model: String,

    status: {
      type: String,
      enum: ["Active", "Scrap", "Repair", "Missing"],
      default: "Active",
    },

    locationType: {
      type: String,
      enum: ["Store", "ZEDC", "HO"],
      required: true,
    },

    storeCode: String,
    storeName: String,
    assignedTo: String,
    purchaseDate: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

AssetSchema.index({ storeCode: 1 });
AssetSchema.index({ manufacturer: 1 });
AssetSchema.index({ status: 1 });
AssetSchema.index({ locationType: 1 });
AssetSchema.index({ serialNumber: 1 });

const Asset: Model<IAsset> =
  mongoose.models.Asset ||
  mongoose.model<IAsset>("Asset", AssetSchema);

export { Asset };
export default Asset;