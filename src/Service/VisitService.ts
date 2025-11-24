import { z } from 'zod';
import StoreService from './StoreService.ts';
import VisitRepository from "../Repository/VisitRepository.ts";
import type {CompareVisitHistory, VisitCreate, VisitDetailsWithStores, VisitHistory, VisitRequest, VisitStore } from "../Types/Visit.ts";

class VisitService {

    private repository: VisitRepository;

    public constructor() {
        this.repository = new VisitRepository();
    }

    public getAllVisits = async () => {
        return await this.repository.getAllVisits();
    }

    public getVisitByShoppingId = async (id: number) => {
        return await this.repository.getVisitByShoppingId(id);
    }

    public visitExist = async (id: number): Promise<boolean> => {
        return await this.repository.getVisitById(id) > 0;
    }

    public getVisitDetails = async (id: number): Promise<VisitDetailsWithStores> => {
        const visitDetailsData = await this.repository.getVisitDetails(id);
        const visitHistory = await this.repository.getHistoryByVisit(id);
        const storeIds = Array.from(new Set(visitHistory.flatMap(v => [v.store_id, v.store_id_left, v.store_id_right])));
        const visitStores = await (new StoreService().getManyByIds(storeIds));
        const visitDetails = 
        {
            ...visitDetailsData,
            stores : visitStores
        }
        return visitDetails;
    }

    public canCreateVisit = (bodyData: Partial<VisitRequest>): boolean => {

        const shoppingStoreValidations = z.object({
            id: z.number().optional(),
            store_id: z.number(),
            shopping_id: z.number(),
            store_id_right: z.number().optional(),
            store_id_left: z.number().optional(),
            status: z.enum(["active", 'deleted']),
            action: z.enum(["new", "update", "delete", "none"]),
        });

        const validations = z.object({
            observation: z.string().optional().or(z.literal("")),
            shopping_id: z.number(),
            shopping_stores: z.array(shoppingStoreValidations),
        });

        const dataIsValid = validations.safeParse(bodyData).success;
        return dataIsValid;
    }

    public saveVisit = async (visitData: VisitRequest, user_id: number) => {
        const dataToSave: VisitCreate = {
            date: new Date(),
            user_id: user_id,
            observation: visitData.observation,
            shopping_id: visitData.shopping_id
        };

        const visitId = await this.repository.create(dataToSave);
        await this.manageVisitStores(visitData.shopping_stores);

        return await this.saveHistory(visitData.shopping_stores, visitId);
    }

    private manageVisitStores = async (stores: VisitStore[]) => {
        const storeService = new StoreService();
        stores.forEach(store => {
            if (store.action == 'none') {
                return;
            }
            if (store.action == 'new') {
                console.log('create')
                return storeService.createShoppingStore(store);
            }
            if (store.action == 'update') {
                return storeService.updateShoppingStore(store, store.id);
            }
            if (store.action == 'delete') {
                return storeService.deleteShoppingStore(store.id);
            }
        })
    }

    private saveHistory = async (shoppingStores: VisitStore[], visit_id: number) => {
        const historyJson = shoppingStores.map(({ id, action, status, shopping_id, ...rest }) => rest);
        const historyToSave: VisitHistory = {
            visit_id: visit_id,
            stores: historyJson
        }
        return await this.repository.saveHistory(historyToSave);
    }

    public delete = async (visitId: number) => {
        return await this.repository.delete(visitId);
    }

    public compareVisits = async (visit1Id: number, visit2Id: number): Promise<CompareVisitHistory> => {
        const historyVisit1 = await this.repository.getHistoryByVisit(visit1Id);
        const historyVisit2 = await this.repository.getHistoryByVisit(visit2Id);

        const storeIds1 = Array.from(new Set(historyVisit1.flatMap(v => [v.store_id, v.store_id_left, v.store_id_right])))
        const storeIds2 = Array.from(new Set(historyVisit2.flatMap(v => [v.store_id, v.store_id_left, v.store_id_right])))

        const storeService = new StoreService();
        const StoresVisit1 = await storeService.getManyByIds(storeIds1);
        const StoresVisit2 = await storeService.getManyByIds(storeIds2);

        return {
            visit1: StoresVisit1,
            visit2: StoresVisit2
        }
    }
}

export default VisitService;