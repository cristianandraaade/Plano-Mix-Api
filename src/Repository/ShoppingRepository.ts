import { Shopping } from "../Lib/Database/Prisma.ts";
import type { ShoppingRead } from "../Types/Shopping.ts";
import type { Shopping as ShoppingData } from "../Types/Shopping.ts";

class ShoppingRepository {

    public getAll = async (): Promise<ShoppingRead[]> => {
        return await Shopping.findMany();
    }

    public getById = async (id: number): Promise<ShoppingRead | null> =>{
        return await Shopping.findUnique({
            where: {id : id}
        })
    }

    public create = async (shoppingData: ShoppingData): Promise<number> => {
        const shopping = await Shopping.create({
            data: shoppingData,
            select: { id: true }
        })
        return shopping.id
    }

    public update = async (id: number, updatedData: ShoppingData): Promise<boolean> =>{
        const updated = await Shopping.update({
            data : updatedData,
            where: {id : id}
        })
        return !!updated;
    }

    public deleteById = async (id: number): Promise<boolean> =>{
        const deleted  = await Shopping.delete({
            where: {id : id}
        })
        return !!deleted;
    }

    public exists = async (zip_code: number) => {
        return await Shopping.count({
            where: { zip_code: zip_code }
        })
    }

    public getCepById = async (id: number): Promise<number> =>{
        const resultado = await Shopping.findUnique({
            where: {id : id},
            select: {
                zip_code : true
            }
        });
        return resultado!.zip_code;
    }
    
    public existsById = async (id: number): Promise<number> => {
        return await Shopping.count({
            where: {
                id: id
            }
        });
    }
}

export default ShoppingRepository;