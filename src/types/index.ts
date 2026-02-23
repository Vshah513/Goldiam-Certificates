export interface ValuationItem {
  description: string;
  stoneType: string;
  stoneWeight: number;
  numberOfDiamonds: number;
  diamondType: string;
  metal: string;
  metalColour: string;
  valueKSH: number;
}

export interface ValuationFormData {
  clientName: string;
  date: string;
  certificateNumber: string;
  items: ValuationItem[];
  valuerName: string;
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
  stoneName: string;
  stoneType: string;
  stoneWeight: number;
  stoneShape: string;
  numberOfStones: number;
  stoneColour: string;
  stoneClarity: string;
  additionalNotes: string;
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
}
