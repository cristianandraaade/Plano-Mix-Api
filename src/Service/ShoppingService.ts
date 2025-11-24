import z from "zod";
import type { Shopping, ShoppingRead } from "../Types/Shopping.ts";
import ShoppingRepository from "../Repository/ShoppingRepository.ts";

class ShoppingService {
    private repository: ShoppingRepository;

    public constructor() {
        this.repository = new ShoppingRepository();
    }

    public getShoppingAll = async (): Promise<ShoppingRead[]> => {
        return await this.repository.getAll();
    }

    public getShoppingById = async (id: number): Promise<ShoppingRead | null> => {
        return await this.repository.getById(id);
    }

    public canCreateShopping = (reqBody?: Partial<Shopping>): boolean => {
        const validations = z.object({
            name: z.string(),
            zip_code: z.int().min(8),
            zip_number: z.int(),
            observation: z.string()
        })
        return validations.safeParse(reqBody).success;
    }

    public shoppingExist = async (zip_code: number): Promise<boolean> => {
        const exist = await this.repository.exists(zip_code);
        return exist > 0;
    }

    public createShopping = async (shoppingData: Shopping): Promise<number> => {
        return await this.repository.create(shoppingData);
    }

    public cepExistent = async (id: number): Promise<number> => {
        return await this.repository.getCepById(id);
    }

    public existsById = async(id: number): Promise<boolean> => {
        return await this.repository.existsById(id) > 0;
    }

    public updateShopping = async (id: number, updatedData: Shopping): Promise<boolean> => {
        return await this.repository.update(id, updatedData);
    }

    public deleteShopping = async (id: number): Promise<boolean> => {
        return await this.repository.deleteById(id);
    }
}
export default ShoppingService;