import z from "zod";
import type { Store, StoreRead, StoreInShopping, StoreWithClassification } from "../Types/Store.ts";
import StoreRepository from "../Repository/StoreRepository.ts";
import type { Visit, VisitStore, VisitStoreCreate, VisitStoreUpdate } from "../Types/Visit.ts";

class StoreService {
    private repository: StoreRepository;

    public constructor() {
        this.repository = new StoreRepository();
    }

    public getAllStore = async (): Promise<StoreRead[]> => {
        return await this.repository.getAll();
    }

    public getManyByIds = async (ids: number[]): Promise<StoreWithClassification[]> => {
        return await this.repository.getManyByIds(ids);
    }

    public getStoreById = async (id: number): Promise<StoreRead | null> => {
        return await this.repository.getById(id);
    }

    public getShoppingStores = async (id: number): Promise<StoreInShopping[]> =>{
        return await this.repository.getStoresByShoppingId(id);
    }

    public canCreateStore = (reqBody?: Partial<Store>): boolean => {
        const validations = z.object({
            name: z.string(),
            classification_id: z.number().int(),
            segment_id: z.number().int(),
            activity_id: z.number().int().nullable().optional(),
        })
        return validations.safeParse(reqBody).success;
    }

    public storeExist = async (storeName: string, storeClassification: number): Promise<boolean> => {
        const exist = await this.repository.exist(storeName, storeClassification);
        return exist > 0
    }

    public nameExistent = async (id: number): Promise<string> => {
        return await this.repository.getNameById(id);
    }

    public createStore = async (storeData: Store): Promise<number> => {
        return await this.repository.create(storeData);
    }

    public createManyStores = async (storeData: Store[]): Promise<number> =>{
        return await this.repository.createMany(storeData);
    }

    public updateStore = async (id: number, storeData: Store): Promise<boolean> => {
        return await this.repository.update(id, storeData);
    }

    public deleteStore = async (id: number): Promise<boolean> => {
        return await this.repository.deleteById(id);
    }

    public visitStoresExists = async (stores: VisitStore[]): Promise<boolean> => {
        if(stores.length == 0){
            return false;
        }

        const idsToCheck = Array.from(new Set(stores.flatMap(v => [v.store_id, v.store_id_left, v.store_id_right])));
        return await this.repository.visitStoresExists(idsToCheck) == idsToCheck.length;
    }

    public createShoppingStore = async (store: VisitStore) => {
        const dataToSave: VisitStoreCreate = {
            shopping_id: store.shopping_id,
            store_id: store.store_id,
            store_id_left: store.store_id_left,
            store_id_right: store.store_id_right,
            status: 'active'
        }
        return await this.repository.createShoppingStore(dataToSave);
    }

    public updateShoppingStore = async (store: VisitStore, id?: number | null) => {
        if(!id){
            throw new Error('ID inválido para atualizar loja do shopping!');
        }

        const dataToUpdate: VisitStoreUpdate = {
            shopping_id: store.shopping_id,
            store_id: store.store_id,
            store_id_left: store.store_id_left,
            store_id_right: store.store_id_right,
            status: 'active'
        }
        return await this.repository.updateShoppingStore(dataToUpdate, id);
    }

    public deleteShoppingStore = async (id?: number | null) => {
        if(!id){
            throw new Error('ID inválido para apagar loja do shopping!');
        }

        return await this.repository.deleteShoppingStore(id);
    }
}

export default StoreService;