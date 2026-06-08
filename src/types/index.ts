export interface ValuationStone {
  name: string;
  type: string;
  weight: number;
  count: number;
  shape: string;
  colour: string;
  clarity: string;
}

export interface ValuationItem {
  description: string;
  metal: string;
  metalColour: string;
  metalWeight: number;
  hasStones: boolean;
  valueKSH: number;
  stones: ValuationStone[];
  // Legacy single-stone fields — optional so previously-saved certificates still load.
  stoneType?: string;
  stoneWeight?: number;
  numberOfDiamonds?: number;
  diamondType?: string;
}

export interface ValuationFormData {
  clientName: string;
  date: string;
  certificateNumber: string;
  items: ValuationItem[];
  valuerName: string;
  showSignature?: boolean;
}

export interface Stone {
  stoneName: string;
  stoneType: string;
  stoneWeight: number;
  stoneShape: string;
  numberOfStones: number;
  stoneColour: string;
  stoneClarity: string;
}

export interface GuaranteeFormData {
  clientName: string;
  date: string;
  certificateNumber: string;
  itemDescription: string;
  metalType: string;
  metalColour: string;
  goldPurity: string;
  totalMetalWeight: number;
  hasStones: boolean;
  stones: Stone[];
  // Legacy single-stone fields — optional so previously-saved certificates still load.
  stoneName?: string;
  stoneType?: string;
  stoneWeight?: number;
  stoneShape?: string;
  numberOfStones?: number;
  stoneColour?: string;
  stoneClarity?: string;
  additionalNotes: string;
  showSignature?: boolean;
}

export interface VoucherFormData {
  recipientName: string;
  occasion: string;
  amountKSH: number;
  issuedBy: string;
  issueDate: string;
  validityPeriod: string;
  customExpiryDate: string;
  voucherCode: string;
  personalMessage: string;
}

export interface CreditNoteFormData {
  clientName: string;
  clientContact: string;
  creditNoteNumber: string;
  dateIssued: string;
  originalReference: string;
  reason: string;
  reasonDetails: string;
  creditAmountKSH: number;
  validityPeriod: string;
  customExpiry: string;
  issuedBy: string;
  showSignature?: boolean;
}
