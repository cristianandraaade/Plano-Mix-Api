import type { Visit } from "../Types/Visit.ts";
import type { Request, Response } from "express";
import handleError from "../Lib/Error/Handle.ts";
import VisitService from "../Service/VisitService.ts";
import StoreService from "../Service/StoreService.ts";
import ShoppingService from "../Service/ShoppingService.ts";
import { number, success } from "zod";

class VisitController {
    private service: VisitService;

    public constructor() {
        this.service = new VisitService();
    }
    
    public getAllVisits = async (req: Request, res: Response): Promise<Response> => {
        const visitData = await this.service.getAllVisits();
        return res.status(200).json({
            success: true,
            data: visitData
        });
    }

    public getVisitByShoppingId = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        const visitData = await this.service.getVisitByShoppingId(id);
        return res.status(200).json({
            success: true,
            data: visitData
        });
    }

    public getVisitDetails = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        const visitExist = await this.service.visitExist(id);
        if(visitExist == false){
            return res.status(404).json({
                success: false,
                message: "Nenhuma visita encontrada"
            });
        }
        const visitDetailsData = await this.service.getVisitDetails(id);
        return res.status(200).json({
            success: true,
            data: visitDetailsData
        });
    }
    
    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const dataTypesAreValid = this.service.canCreateVisit(req.body);
            if(dataTypesAreValid == false){
                return res.status(400).json({
                    success: false,
                    message: "Dados inválidos para criar a visita"
                });
            }

            const visitData: Visit = req.body;
            const shoppingExists = await (new ShoppingService().existsById(visitData.shopping_id));
            if(shoppingExists == false){
                return res.status(400).json({
                    success: false,
                    message: "O shopping selecionado é inválido!"
                });
            }

            const storesExists = await (new StoreService().visitStoresExists(visitData.shopping_stores));
            if(storesExists == false){
                return res.status(400).json({
                    success: false,
                    message: "Lojas inválidas para salvar a visita!"
                });
            }

            await this.service.saveVisit(visitData, Number(req.user!.sub));
            return res.status(200).json({
                success: true,
                message: "Visita Registrada com sucesso!"
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            if(!req.params.id){
                return res.status(200).json({
                    success: false,
                    message: "ID inválido para apagar a visita!"
                });
            }

            const visitId = req.params.id;
            await this.service.delete(Number(visitId));

            return res.status(200).json({
                success: true,
                message: "Visita apagada com sucesso!"
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public compare = async (req: Request, res: Response): Promise<Response> => {
        try {
            if(!req.params.visit_id || !req.params.compare_id){
                return res.status(200).json({
                    success: false,
                    message: "IDs inválidos para compara as visitas!"
                });
            }

            const visit1Id = req.params.visit_id;
            const visit2Id = req.params.compare_id;
            const visitCompare = await this.service.compareVisits(Number(visit1Id), Number(visit2Id));

            return res.status(200).json({
                success: true,
                data: visitCompare
            });
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }
}

export default VisitController;