import type { Store as StoreData } from "../Types/Store.ts";
import prisma, {ShoppingStore, Store } from "../Lib/Database/Prisma.ts";
import type { Visit, VisitStoreCreate, VisitStoreUpdate } from "../Types/Visit.ts";
import type { StoreRead, StoreInShopping, StoreWithClassification } from "../Types/Store.ts";

class StoreRepository {

    public getAll = async (): Promise<StoreRead[]> => {
        return await Store.findMany();
    }

    public getById = async (id: number): Promise<StoreRead | null> => {
        return await Store.findUnique({
            where: { id: id }
        })
    }

    public getManyByIds = async (ids: number[]): Promise<StoreWithClassification[]> => {
        const stores =  await Store.findMany({
            where: {
                id: {in : ids},
            },
            select: {
                name: true,
                activity: {
                    select: { name: true }
                },
                classification: {
                    select: { name: true }
                },
                segment: {
                    select: { name: true }
                }
            }
        });

        return stores.map(s => ({
            name: s.name,    
            classification: s.classification!.name,
            segment: s.segment!.name,
            activity: s.activity?.name ?? null
        }));
    }

    public exist = async (storeName: string, storeClassification: number): Promise<number> => {
        return await Store.count({
            where: {
                name: storeName,
                classification_id: storeClassification
            }
        })
    }

    public getNameById = async (id: number): Promise<string> => {
        const resultado = await Store.findUnique({
            where: { id: id },
            select: { name: true }
        })
        return resultado!.name
    }

    public getStoresByShoppingId = async (id: number): Promise<StoreInShopping[]> => {
        const resultado = await prisma.$queryRaw<StoreInShopping[]>`
    SELECT 
      s.name AS store_name,
      m.classification AS store_classification, 
      m.segment AS store_segment, 
      p.status AS store_status
    FROM store s
    JOIN shopping_store p ON p.store_id = s.id
    JOIN mix m ON m.activity_id = s.activity_id
    WHERE p.shopping_id = ${id};
    `;

        return resultado;
    }


    public create = async (storeData: StoreData): Promise<number> => {
        const store = await Store.create({
            data: storeData,
            select: { id: true }
        })
        return store.id;
    }

    public createMany = async (storeData: StoreData[]): Promise<number> => {
        const store = await Store.createMany({
            data: storeData
        })
        return store.count;
    }

    public update = async (id: number, storeData: StoreData) => {
        const updated = await Store.update({
            data: storeData,
            where: { id: id }
        })
        return !!updated
    }

    public deleteById = async (id: number): Promise<boolean> => {
        const deleted = await Store.delete({
            where: { id: id }
        })
        return !!deleted
    }

    public visitStoresExists = async (ids: number[]): Promise<number> => {
        return await Store.count({
            where: {
                id: {in: ids} 
            }
        })
    }

    public createShoppingStore = async (data: VisitStoreCreate) => {
        return await ShoppingStore.create({
            data: data
        })
    }

    public updateShoppingStore = async (shoppingStore: VisitStoreUpdate, id: number) => {
        return await ShoppingStore.update({
            data: shoppingStore,
            where: { id: id}
        })
    }

    public deleteShoppingStore = async (id: number) => {
        return await ShoppingStore.update({
            data: { status: 'deleted'},
            where: { id: id}
        })
    }

}
export default StoreRepository;