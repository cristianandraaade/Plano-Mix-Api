import type { Store } from "../Types/Store.ts";
import type { Request, Response } from "express";
import handleError from "../Lib/Error/Handle.ts";
import StoreService from "../Service/StoreService.ts"
import { success } from "zod";

class StoreController {
    private service: StoreService;

    public constructor() {
        this.service = new StoreService();
    }

    public getAllStore = async (req: Request, res: Response): Promise<Response> => {
        try {
            const storeData = await this.service.getAllStore();
            return res.status(200).json(storeData);
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public getStoreById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            const storeData = await this.service.getStoreById(id);
            if (storeData == null) {
                return res.status(404).json({
                    success: false,
                    message: "Store não encontrado"
                })
            }
            return res.status(200).json(storeData);
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public getShoppingStores = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            const shoppingStoresData = await this.service.getShoppingStores(id);
            return res.status(200).json({
                success: true,
                data: shoppingStoresData
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createStore = async (req: Request, res: Response): Promise<Response> => {
        try {
            const canCreateStore = this.service.canCreateStore(req.body);
            if (canCreateStore == false) {
                return res.status(400).json({
                    success: false,
                    message: "Dados invalidos para adicionar Store"
                })
            }
            const storeData: Store = req.body;
            const storeExist = await this.service.storeExist(storeData.name, storeData.classification_id);
            if (storeExist == true) {
                return res.status(409).json({
                    success: false,
                    message: "Store já cadastrado"
                })
            }

            await this.service.createStore(storeData);
            return res.status(200).json({
                success: true,
                message: "Store adicionada com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createManyStores = async (req: Request, res: Response): Promise<Response> => {
        try {
            const stores: Store[] = req.body;
            if (Array.isArray(stores) == false || stores.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "Nenhuma Loja fornecida"
                })
            }
            const invalidItems = stores.filter(
                (item) => this.service.canCreateStore(item) == false
            );
            if (invalidItems.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Um ou mais itens invalidos"
                });
            }
            for (const item of stores) {
                const exist = await this.service.storeExist(item.name, item.classification_id);
                if (exist == true) {
                    return res.status(400).json({
                        success: false,
                        message: `A loja '${item.name}' já foi adicionada`
                    })
                }
            }
            await this.service.createManyStores(stores);
            return res.status(201).json({
                success: true,
                message: "Lojas adicionadas com sucesso"
            });
        } catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public updateStore = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            const dataToUpdate = req.body;
            const canUpdateStore = this.service.canCreateStore(dataToUpdate);
            if (canUpdateStore == false) {
                return res.status(400).json({
                    success: false,
                    message: "Dados invalidos para atualizar"
                })
            }
            const nameExist = await this.service.nameExistent(id);
            const storeExist = await this.service.storeExist(dataToUpdate.name, dataToUpdate.classification_id)
            if (nameExist != dataToUpdate.name && storeExist == true) {
                return res.status(400).json({
                    success: false,
                    message: "Store já cadastrado"
                })
            }
            await this.service.updateStore(id, dataToUpdate);
            return res.status(200).json({
                success: true,
                message: "Store Atualizado com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public deleteStore = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            await this.service.deleteStore(id);
            return res.status(200).json({
                success: true,
                message: "Store deletado com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public dd(debug: any): void {
        console.log(debug);
        process.exit(1);
    }
}

export default StoreController;