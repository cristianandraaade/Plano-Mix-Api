export type Shopping = {
    name: string,
    zip_code: number,
    zip_number: number,
    observation: string | null
}
export type ShoppingRead = Shopping & {
    id: number;
};
