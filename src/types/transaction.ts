interface MergeTransactionType {
  amount: number;
  balance: number;
  cancelYn: "Y" | "N";
  date: string; // yyyy-MM-dd
  storeId: string;
  transactionId: string;
  productId: string;
}

interface TransactionType extends Omit<MergeTransactionType, "productId"> {}
interface StoreTransactionType
  extends Pick<MergeTransactionType, "productId" | "storeId" | "transactionId"> {}


  export { MergeTransactionType, TransactionType, StoreTransactionType };