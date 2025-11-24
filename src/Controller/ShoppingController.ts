import type { Request, Response } from "express";
import handleError from "../Lib/Error/Handle.ts";
import type { Shopping } from "../Types/Shopping.ts";
import ShoppingService from "../Service/ShoppingService.ts";

class ShoppingController {
    private service: ShoppingService;

    public constructor() {
        this.service = new ShoppingService();
    }
    
    public getAllShopping = async (req: Request, res: Response): Promise<Response> => {
        try {
            const shoppingData = await this.service.getShoppingAll();
            return res.status(200).json(shoppingData);
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public getShoppingById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            const shoppingData = await this.service.getShoppingById(id)
            if (shoppingData == null) {
                return res.status(404).json({
                    success: false,
                    message: "Shopping não encontrado"
                })
            }
            return res.status(200).json(shoppingData);
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public createShopping = async (req: Request, res: Response): Promise<Response> => {
        try {
            const canCreateShopping = this.service.canCreateShopping(req.body);
            if (canCreateShopping == false) {
                return res.status(400).json({
                    success: false,
                    message: "Dados invalidos para adicionar shopping"
                })
            }
            const shoppingData: Shopping = req.body;
            const shoppingExist = await this.service.shoppingExist(shoppingData.zip_code)
            if (shoppingExist == true) {
                return res.status(409).json({
                    success: false,
                    message: "Shopping já cadastrado"
                })
            }

            await this.service.createShopping(shoppingData);
            return res.status(201).json({
                success: true,
                message: "Shopping adicionado com sucesso"
            })
        }
        catch (err) {
            const error = handleError(err as Error);
            return res.status(error.statusCode).json(error.json);
        }
    }

    public updateShopping = async (req: Request, res: Response): Promise<Response> => {
        const id = Number(req.params.id);
        const dataToUpdate: Shopping = req.body;
        const canUpdateShopping = this.service.canCreateShopping(dataToUpdate);
        if (canUpdateShopping == false) {
            return res.status(400).json({
                success: false,
                message: "Dados invalidos para atualizar"
            })
        }

        const cepExist = await this.service.cepExistent(id);
        const shoppingExist = await this.service.shoppingExist(dataToUpdate.zip_code);
        if(cepExist != dataToUpdate.zip_code && shoppingExist == true){
            return res.status(409).json({
                success: false,
                message: "Shopping já cadastrado"
            })
        }

        await this.service.updateShopping(id, dataToUpdate);
        return res.status(200).json({
            success: true,
            message: "Shopping Atualizado com sucesso"
        })
    }

    public deleteShopping = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id);
            await this.service.deleteShopping(id);
            return res.status(200).json({
                success: true,
                message: "Shopping deletado com sucesso"
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

export default ShoppingController;