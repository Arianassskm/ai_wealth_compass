export interface Asset {
  id: string;
  name: string;
  category: string;
  price: number;
  dailyDepreciation: number;
  purchaseDate: string;
  expiryDate?: string;
  status: string;
  usageCount: number;
  icon: string;
  secondHandPrice?: number;
  discount?: number;
}

export interface AssetSummary {
  totalAssetValue: number;
  assetCount: number;
  dailyDepreciation: number;
  date: string;
  recommendedRenewal?: string;
}

