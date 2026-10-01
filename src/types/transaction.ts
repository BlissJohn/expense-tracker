export type Category =
  | "Food"
  | "Alcohol"
  | "Tech Accessories"
  | "Non-Tech Accessories"
  | "Groceries"
  | "Rent"
  | "Personal Activities"
  | "Salary Earned"
  | "Money Received from Mom"
  | "Money Received from Brother";

export type Transaction = {
  id: number;
  name: string;
  amount: number;
  category: Category;
  date: string;
  user_id?: string;
};